import { Request, Response } from 'express';
import { PrismaClient, BadgeTier, DisputeStatus } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper function to create error response
function createErrorResponse(res: Response, status: number, message: string) {
  return res.status(status).json({
    status: 'error',
    message,
  });
}

// Helper function to generate blockchain hash
function generateBlockchainHash(data: any): string {
  const dataString = JSON.stringify(data);
  return createHash('sha256').update(dataString).digest('hex');
}

// Helper function to check if user can vote
async function canUserVote(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: {
        include: {
          badge: true
        }
      }
    }
  });

  if (!user) return false;

  // Check if user has required badges
  const hasRequiredBadge = user.badges.some(
    userBadge => 
      userBadge.badge.tier === BadgeTier.ACHARYA || 
      userBadge.badge.tier === BadgeTier.GURU
  );

  // Check if user has minimum tokens
  const hasMinimumTokens = user.tokens >= 100;

  return hasRequiredBadge || hasMinimumTokens;
}

// Helper function to calculate vote weight
async function calculateVoteWeight(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: {
        include: {
          badge: true
        }
      }
    }
  });

  if (!user) return 0;

  let weight = 1; // Base weight

  // Add weight based on badges
  const badgeWeights: Record<BadgeTier, number> = {
    [BadgeTier.SHIKSHARTHI]: 1,
    [BadgeTier.SIKSHA_SEVI]: 2,
    [BadgeTier.UTSAAHI_INTERN]: 2,
    [BadgeTier.ACHARYA]: 3,
    [BadgeTier.GURU]: 5
  };

  user.badges.forEach(userBadge => {
    const badgeWeight = badgeWeights[userBadge.badge.tier] || 0;
    weight += badgeWeight;
  });

  // Add weight based on tokens (1 weight per 100 tokens)
  weight += Math.floor(user.tokens / 100);

  return weight;
}

// Raise a new dispute
export const raiseDispute = async (req: Request, res: Response) => {
  try {
    const { contractId, reason, evidence } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(contractId)) {
      return createErrorResponse(res, 400, 'Invalid contract ID');
    }

    // Check if contract exists and user is part of it
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        student: true,
        employer: true
      }
    });

    if (!contract) {
      return createErrorResponse(res, 404, 'Contract not found');
    }

    if (contract.studentId !== userId && contract.employerId !== userId) {
      return createErrorResponse(res, 403, 'Not authorized to raise dispute for this contract');
    }

    // Check if contract is active or completed
    if (contract.status !== 'ACTIVE' && contract.status !== 'COMPLETED') {
      return createErrorResponse(res, 400, 'Can only raise disputes for active or completed contracts');
    }

    // Check if dispute already exists
    const existingDispute = await prisma.dispute.findFirst({
      where: { contractId }
    });

    if (existingDispute) {
      return createErrorResponse(res, 400, 'Dispute already exists for this contract');
    }

    // Generate blockchain hash
    const disputeData = {
      contractId,
      raisedById: userId,
      reason,
      evidence,
      timestamp: new Date().toISOString()
    };
    const blockchainHash = generateBlockchainHash(disputeData);

    // Create dispute
    const dispute = await prisma.dispute.create({
      data: {
        contractId,
        raisedById: userId,
        reason,
        evidence,
        blockchainHash,
        status: 'OPEN'
      },
      include: {
        contract: {
          include: {
            student: true,
            employer: true,
            job: true
          }
        },
        raisedBy: true
      }
    });

    // Update contract status
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'DISPUTED' }
    });

    return res.json({
      status: 'success',
      data: dispute
    });
  } catch (error) {
    console.error('Error raising dispute:', error);
    return createErrorResponse(res, 500, 'Failed to raise dispute');
  }
};

// Respond to a dispute
export const respondToDispute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, evidence } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(id)) {
      return createErrorResponse(res, 400, 'Invalid dispute ID');
    }

    // Check if dispute exists
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        contract: true
      }
    });

    if (!dispute) {
      return createErrorResponse(res, 404, 'Dispute not found');
    }

    // Check if user is the other party in the contract
    if (dispute.contract.studentId !== userId && dispute.contract.employerId !== userId) {
      return createErrorResponse(res, 403, 'Not authorized to respond to this dispute');
    }

    // Check if user is not the one who raised the dispute
    if (dispute.raisedById === userId) {
      return createErrorResponse(res, 400, 'Cannot respond to your own dispute');
    }

    // Check if dispute already has a response
    if (dispute.status !== 'OPEN') {
      return createErrorResponse(res, 400, 'Dispute already has a response');
    }

    // Generate blockchain hash for response
    const responseData = {
      disputeId: id,
      respondedById: userId,
      reason,
      evidence,
      timestamp: new Date().toISOString()
    };
    const blockchainHash = generateBlockchainHash(responseData);

    // Update dispute with response
    const updatedDispute = await prisma.dispute.update({
      where: { id },
      data: {
        response: reason,
        respondedById: userId,
        status: 'RESPONDED',
        blockchainHash: `${dispute.blockchainHash}-${blockchainHash}`
      },
      include: {
        contract: {
          include: {
            student: true,
            employer: true,
            job: true
          }
        },
        raisedBy: true,
        respondedBy: true
      }
    });

    return res.json({
      status: 'success',
      data: updatedDispute
    });
  } catch (error) {
    console.error('Error responding to dispute:', error);
    return createErrorResponse(res, 500, 'Failed to respond to dispute');
  }
};

// Cast a vote on a dispute
export const castVote = async (req: Request, res: Response) => {
  try {
    const { disputeId, votedForId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(disputeId) || !isValidObjectId(votedForId)) {
      return createErrorResponse(res, 400, 'Invalid dispute or user ID');
    }

    // Check if dispute exists and is in voting state
    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        contract: true,
        raisedBy: true,
        respondedBy: true,
        votes: {
          include: {
            voter: true
          }
        }
      }
    });

    if (!dispute) {
      return createErrorResponse(res, 404, 'Dispute not found');
    }

    if (dispute.status !== 'RESPONDED') {
      return createErrorResponse(res, 400, 'Dispute is not in voting state');
    }

    // Check if user can vote
    const canVote = await canUserVote(userId);
    if (!canVote) {
      return createErrorResponse(res, 403, 'User does not meet voting requirements');
    }

    // Check if user is voting for a valid party
    if (votedForId !== dispute.raisedById && votedForId !== dispute.respondedById) {
      return createErrorResponse(res, 400, 'Invalid vote target');
    }

    // Check if user is one of the parties in dispute
    if (userId === dispute.raisedById || userId === dispute.respondedById) {
      return createErrorResponse(res, 400, 'Cannot vote on your own dispute');
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findFirst({
      where: {
        disputeId,
        voterId: userId
      }
    });

    if (existingVote) {
      return createErrorResponse(res, 400, 'User has already voted on this dispute');
    }

    // Calculate vote weight
    const voteWeight = await calculateVoteWeight(userId);

    // Create vote
    const vote = await prisma.vote.create({
      data: {
        disputeId,
        voterId: userId,
        votedForId,
        weight: voteWeight
      },
      include: {
        dispute: true,
        voter: true,
        votedFor: true
      }
    });

    // Check if we should auto-resolve the dispute
    const totalVotes = dispute.votes.length + 1; // Including the new vote
    if (totalVotes >= 5) { // Minimum 5 votes required for auto-resolution
      let raisedByVotes = dispute.votes
        .filter(v => v.votedForId === dispute.raisedById)
        .reduce((sum, v) => sum + (v.weight || 1), 0);
      
      let respondedByVotes = dispute.votes
        .filter(v => v.votedForId === dispute.respondedById)
        .reduce((sum, v) => sum + (v.weight || 1), 0);
      
      // Add the new vote to the count
      if (votedForId === dispute.raisedById) {
        raisedByVotes += voteWeight;
      } else {
        respondedByVotes += voteWeight;
      }

      // If one party has more than 60% of the total weighted votes, auto-resolve
      const totalWeightedVotes = raisedByVotes + respondedByVotes;
      const threshold = totalWeightedVotes * 0.6;

      if (raisedByVotes > threshold || respondedByVotes > threshold) {
        const winnerId = raisedByVotes > respondedByVotes ? dispute.raisedById : dispute.respondedById;
        
        // Auto-resolve the dispute
        const mockReq = {
          params: { id: disputeId },
          body: { winnerId },
          user: { id: 'system' }
        } as unknown as Request;
        
        await resolveDispute(mockReq, res);
      }
    }

    return res.json({
      status: 'success',
      data: vote
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    return createErrorResponse(res, 500, 'Failed to cast vote');
  }
};

// Resolve a dispute
export const resolveDispute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { winnerId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(id) || !isValidObjectId(winnerId)) {
      return createErrorResponse(res, 400, 'Invalid dispute or winner ID');
    }

    // Check if dispute exists
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        contract: true,
        raisedBy: true,
        respondedBy: true,
        votes: true
      }
    });

    if (!dispute) {
      return createErrorResponse(res, 404, 'Dispute not found');
    }

    if (dispute.status === 'RESOLVED') {
      return createErrorResponse(res, 400, 'Dispute is already resolved');
    }

    // Check if resolver is an admin or has required badges
    const resolver = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true
          }
        }
      }
    });

    if (!resolver) {
      return createErrorResponse(res, 404, 'Resolver not found');
    }

    const isAdmin = resolver.role === 'ADMIN';
    const hasRequiredBadge = resolver.badges.some(
      userBadge => 
        userBadge.badge.tier === BadgeTier.ACHARYA || 
        userBadge.badge.tier === BadgeTier.GURU
    );

    if (!isAdmin && !hasRequiredBadge) {
      return createErrorResponse(res, 403, 'Not authorized to resolve disputes');
    }

    // Check if winner is a valid party
    if (winnerId !== dispute.raisedById && winnerId !== dispute.respondedById) {
      return createErrorResponse(res, 400, 'Invalid winner');
    }

    // Create resolution
    const resolution = await prisma.disputeResolution.create({
      data: {
        disputeId: id,
        winnerId,
        resolverId: userId
      }
    });

    // Update dispute status
    await prisma.dispute.update({
      where: { id },
      data: { status: 'RESOLVED' }
    });

    // Update contract status
    await prisma.contract.update({
      where: { id: dispute.contractId },
      data: { status: 'COMPLETED' }
    });

    // Distribute rewards
    const winner = await prisma.user.findUnique({
      where: { id: winnerId }
    });

    if (winner) {
      // Reward winner
      await prisma.tokenReward.create({
        data: {
          userId: winnerId,
          amount: 100,
          reason: 'Won dispute',
          disputeId: id
        }
      });

      // Update winner's token balance
      await prisma.user.update({
        where: { id: winnerId },
        data: { tokens: { increment: 100 } }
      });

      // Reward matching voters
      const matchingVotes = dispute.votes.filter(vote => vote.votedForId === winnerId);
      for (const vote of matchingVotes) {
        await prisma.tokenReward.create({
          data: {
            userId: vote.voterId,
            amount: 10,
            reason: 'Correct vote in dispute',
            disputeId: id
          }
        });

        await prisma.user.update({
          where: { id: vote.voterId },
          data: { tokens: { increment: 10 } }
        });
      }
    }

    return res.json({
      status: 'success',
      data: {
        resolution,
        rewards: {
          winner: 100,
          matchingVoters: matchingVotes.length * 10
        }
      }
    });
  } catch (error) {
    console.error('Error resolving dispute:', error);
    return createErrorResponse(res, 500, 'Failed to resolve dispute');
  }
};

// Get all disputes
export const getAllDisputes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const status = req.query.status as DisputeStatus | undefined;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    const where = status ? { status } : {};

    const disputes = await prisma.dispute.findMany({
      where,
      include: {
        contract: {
          include: {
            student: true,
            employer: true,
            job: true
          }
        },
        raisedBy: true,
        respondedBy: true,
        votes: true,
        resolution: {
          include: {
            winner: true,
            resolver: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      status: 'success',
      data: disputes
    });
  } catch (error) {
    console.error('Error fetching disputes:', error);
    return createErrorResponse(res, 500, 'Failed to fetch disputes');
  }
};

// Get dispute by ID
export const getDisputeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(id)) {
      return createErrorResponse(res, 400, 'Invalid dispute ID');
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            student: true,
            employer: true,
            job: true
          }
        },
        raisedBy: true,
        respondedBy: true,
        votes: {
          include: {
            voter: true,
            votedFor: true
          }
        },
        resolution: {
          include: {
            winner: true,
            resolver: true
          }
        }
      }
    });

    if (!dispute) {
      return createErrorResponse(res, 404, 'Dispute not found');
    }

    return res.json({
      status: 'success',
      data: dispute
    });
  } catch (error) {
    console.error('Error fetching dispute:', error);
    return createErrorResponse(res, 500, 'Failed to fetch dispute');
  }
};

// Get user's reward history
export const getUserRewards = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(userId)) {
      return createErrorResponse(res, 400, 'Invalid user ID');
    }

    // Check if user is requesting their own rewards or is an admin
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId }
    });

    if (!currentUser) {
      return createErrorResponse(res, 404, 'User not found');
    }

    if (currentUserId !== userId && currentUser.role !== 'ADMIN') {
      return createErrorResponse(res, 403, 'Not authorized to view these rewards');
    }

    const rewards = await prisma.tokenReward.findMany({
      where: { userId },
      include: {
        dispute: {
          include: {
            contract: {
              include: {
                job: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      status: 'success',
      data: rewards
    });
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    return createErrorResponse(res, 500, 'Failed to fetch user rewards');
  }
};

// Get user's voting power
export const getUserVotingPower = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(userId)) {
      return createErrorResponse(res, 400, 'Invalid user ID');
    }

    const weight = await calculateVoteWeight(userId);
    const canVote = await canUserVote(userId);

    return res.json({
      status: 'success',
      data: {
        weight,
        canVote
      }
    });
  } catch (error) {
    console.error('Error getting user voting power:', error);
    return createErrorResponse(res, 500, 'Failed to get user voting power');
  }
}; 