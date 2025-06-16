import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { calculateSimilarityScore, sortBySimilarity } from '../utils/recommendation';

// Add interfaces at the top of the file
interface JobWithScore {
  id: string;
  requiredSkills: string[];
  status: string;
  applications: { id: string; status: string }[];
  contracts: { id: string; status: string }[];
  employer: {
    id: string;
    name: string;
    profilePic: string | null;
    badges: { badge: { tier: string } }[];
  };
  similarity: { score: number; matchPercentage: number };
  debug: {
    userSkills: string[];
    jobSkills: string[];
    hasAppliedBefore: boolean;
    badgeCount: number;
    status: string;
    applications: number;
    activeContracts: number;
  };
}

interface StudentWithScore {
  id: string;
  name: string;
  profilePic: string | null;
  skills: string[];
  badges: { badge: { tier: string } }[];
  applications: { jobId: string; status: string }[];
  similarity: { score: number; matchPercentage: number };
  debug: {
    studentSkills: string[];
    jobSkills: string[];
    hasAppliedBefore: boolean;
    badgeCount: number;
  };
}

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Helper function for user-friendly error messages
const createError = (res: Response, message: string, code: string, status: number = 400) => {
  return res.status(status).json({
    status: 'error',
    code,
    message,
    timestamp: new Date().toISOString()
  });
};

// Get all jobs with optional filters
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { 
      skill, 
      employerId, 
      type,
      location,
      status = 'OPEN'
    } = req.query;
    
    const where: any = {
      status: status as string
    };
    
    if (skill) where.requiredSkills = { has: skill as string };
    if (employerId) where.employerId = employerId as string;
    if (type) where.type = type as string;
    if (location) where.location = location as string;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        },
        applications: {
          select: {
            id: true,
            status: true
          }
        },
        contracts: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: jobs
    });
  } catch (error) {
    createError(res, 'Failed to fetch jobs', 'FETCH_JOBS_ERROR', 500);
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            bio: true
          }
        },
        applications: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                skills: true,
                badges: {
                  include: {
                    badge: true
                  }
                }
              }
            }
          }
        },
        contracts: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                skills: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    createError(res, 'Failed to fetch job details', 'FETCH_JOB_ERROR', 500);
  }
};

// Create new job
export const createJob = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      subtitle,
      description, 
      requiredSkills, 
      tags, 
      type, 
      location,
      locationType,
      budget 
    } = req.body;
    const employerId = (req as any).user.id;

    // Input validation
    if (!title?.trim()) {
      return createError(res, 'Job title is required', 'MISSING_TITLE');
    }
    if (!description?.trim()) {
      return createError(res, 'Job description is required', 'MISSING_DESCRIPTION');
    }
    if (!requiredSkills?.length) {
      return createError(res, 'At least one required skill is needed', 'MISSING_SKILLS');
    }
    if (!tags?.length) {
      return createError(res, 'At least one tag is required', 'MISSING_TAGS');
    }
    if (!type) {
      return createError(res, 'Job type is required', 'MISSING_TYPE');
    }
    if (!location) {
      return createError(res, 'Job location is required', 'MISSING_LOCATION');
    }
    if (!locationType) {
      return createError(res, 'Location type is required', 'MISSING_LOCATION_TYPE');
    }

    const job = await prisma.job.create({
      data: {
        title,
        subtitle,
        description,
        requiredSkills,
        tags,
        type,
        location,
        locationType,
        budget,
        status: 'OPEN',
        employerId,
        postedTime: 'Just now',
        proposals: 0
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    createError(res, 'Failed to create job', 'CREATE_JOB_ERROR', 500);
  }
};

// Update job
export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      subtitle,
      description, 
      requiredSkills, 
      tags, 
      type, 
      location,
      locationType,
      budget,
      status 
    } = req.body;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Check if user is the employer
    const job = await prisma.job.findUnique({
      where: { id },
      select: { employerId: true, status: true }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.employerId !== userId) {
      return createError(res, 'You are not authorized to update this job', 'UNAUTHORIZED_EMPLOYER', 403);
    }

    // Validate status transition
    if (status && status !== job.status) {
      if (!['OPEN', 'CLOSED', 'DRAFT'].includes(status)) {
        return createError(res, 'Invalid job status', 'INVALID_STATUS');
      }
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        requiredSkills,
        tags,
        type,
        location,
        locationType,
        budget,
        status
      }
    });

    res.json({
      status: 'success',
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    createError(res, 'Failed to update job', 'UPDATE_JOB_ERROR', 500);
  }
};

// Delete job
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Check if user is the employer
    const job = await prisma.job.findUnique({
      where: { id },
      select: { employerId: true }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.employerId !== userId) {
      return createError(res, 'You are not authorized to delete this job', 'UNAUTHORIZED_EMPLOYER', 403);
    }

    // Use transaction to delete related records
    await prisma.$transaction([
      prisma.application.deleteMany({ where: { jobId: id } }),
      prisma.contract.deleteMany({ where: { jobId: id } }),
      prisma.job.delete({ where: { id } })
    ]);

    res.json({
      status: 'success',
      message: 'Job and related records deleted successfully'
    });
  } catch (error) {
    createError(res, 'Failed to delete job', 'DELETE_JOB_ERROR', 500);
  }
};

// Get job applications
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Check if user is the employer
    const job = await prisma.job.findUnique({
      where: { id },
      select: { employerId: true }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.employerId !== userId) {
      return createError(res, 'You are not authorized to view these applications', 'UNAUTHORIZED_EMPLOYER', 403);
    }

    const where: any = { jobId: id };
    if (status) where.status = status;

    const applications = await prisma.application.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            skills: true,
            bio: true,
            badges: {
              include: {
                badge: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: applications
    });
  } catch (error) {
    createError(res, 'Failed to fetch applications', 'FETCH_APPLICATIONS_ERROR', 500);
  }
};

// Get job contracts
export const getJobContracts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Check if user is the employer
    const job = await prisma.job.findUnique({
      where: { id },
      select: { employerId: true }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.employerId !== userId) {
      return createError(res, 'You are not authorized to view these contracts', 'UNAUTHORIZED_EMPLOYER', 403);
    }

    const where: any = { jobId: id };
    if (status) where.status = status;

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            skills: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: contracts
    });
  } catch (error) {
    createError(res, 'Failed to fetch contracts', 'FETCH_CONTRACTS_ERROR', 500);
  }
};

// Get personalized job suggestions
export const getJobSuggestions = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const minSimilarity = 0.01; // Lower threshold to 1% to ensure some recommendations

    // Get user with skills and badges
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        applications: {
          select: {
            jobId: true,
            status: true
          }
        }
      }
    });

    if (!user) {
      return createError(res, 'User not found', 'USER_NOT_FOUND', 404);
    }

    // Get all open jobs that haven't been completed or are in progress
    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        NOT: {
          OR: [
            {
              contracts: {
                some: {
                  OR: [
                    { status: 'ACTIVE' },
                    { status: 'COMPLETED' }
                  ]
                }
              }
            },
            {
              applications: {
                some: {
                  studentId: userId,
                  status: 'ACCEPTED'
                }
              }
            }
          ]
        }
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            badges: {
              include: {
                badge: true
              }
            }
          }
        },
        applications: {
          select: {
            id: true,
            status: true
          }
        },
        contracts: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    // Calculate similarity scores for each job
    const jobsWithScores = jobs.map((job) => {
      const hasAppliedBefore = user.applications.some((app: { jobId: string }) => app.jobId === job.id);
      const similarity = calculateSimilarityScore(
        user.skills,
        job.requiredSkills,
        user.badges,
        hasAppliedBefore
      );

      return {
        ...job,
        similarity,
        debug: {
          userSkills: user.skills,
          jobSkills: job.requiredSkills,
          hasAppliedBefore,
          badgeCount: user.badges.length,
          status: job.status,
          applications: job.applications.length,
          activeContracts: job.contracts.filter((c: { status: string }) => c.status === 'ACTIVE').length
        }
      } as unknown as JobWithScore;
    });

    // Filter out jobs with zero similarity and sort by similarity score
    const filteredJobs = jobsWithScores
      .filter((job) => job.similarity.score >= minSimilarity)
      .sort((a, b) => b.similarity.score - a.similarity.score)
      .slice(0, limit);

    res.json({
      status: 'success',
      data: filteredJobs,
      meta: {
        total: filteredJobs.length,
        minSimilarity,
        limit,
        totalJobs: jobs.length,
        userSkills: user.skills,
        userBadges: user.badges.map((b: { badge: { tier: string } }) => b.badge.tier)
      }
    });
  } catch (error) {
    createError(res, 'Failed to get job suggestions', 'GET_SUGGESTIONS_ERROR', 500);
  }
};

// Apply for a job
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Check if job exists and is open
    const job = await prisma.job.findUnique({
      where: { id },
      select: { 
        id: true,
        status: true,
        employerId: true
      }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.status !== 'OPEN') {
      return createError(res, 'This job is no longer accepting applications', 'JOB_CLOSED');
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: id,
        studentId: userId
      }
    });

    if (existingApplication) {
      return createError(res, 'You have already applied for this job', 'DUPLICATE_APPLICATION');
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: id,
        studentId: userId,
        status: 'PENDING',
        proposal: req.body.proposal || 'No proposal provided'
      },
      include: {
        job: {
          select: {
            title: true,
            employer: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    createError(res, 'Failed to submit application', 'APPLICATION_ERROR', 500);
  }
};

// Invite student to job
export const inviteStudentToJob = async (req: Request, res: Response) => {
  try {
    const { jobId, studentId } = req.params;
    const employerId = (req as any).user.id;

    if (!isValidObjectId(jobId) || !isValidObjectId(studentId)) {
      return createError(res, 'Invalid ID format', 'INVALID_ID');
    }

    // Check if job exists and belongs to employer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { employerId: true, status: true }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.employerId !== employerId) {
      return createError(res, 'Not authorized to invite for this job', 'UNAUTHORIZED', 403);
    }

    if (job.status !== 'OPEN') {
      return createError(res, 'Cannot invite for closed job', 'JOB_CLOSED');
    }

    // Check if student exists
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: 'STUDENT' }
    });

    if (!student) {
      return createError(res, 'Student not found', 'STUDENT_NOT_FOUND', 404);
    }

    // Check if invite already exists
    const existingInvite = await prisma.jobInvite.findUnique({
      where: {
        jobId_studentId: {
          jobId,
          studentId
        }
      }
    });

    if (existingInvite) {
      return createError(res, 'Student already invited', 'DUPLICATE_INVITE');
    }

    // Create invite
    const invite = await prisma.jobInvite.create({
      data: {
        jobId,
        studentId,
        employerId,
        status: 'PENDING'
      },
      include: {
        job: true,
        student: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            skills: true
          }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Invite sent successfully',
      data: invite
    });
  } catch (error) {
    createError(res, 'Failed to send invite', 'INVITE_ERROR', 500);
  }
};

// Get job invites for student
export const getStudentInvites = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user.id;

    const invites = await prisma.jobInvite.findMany({
      where: {
        studentId,
        status: 'PENDING'
      },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      status: 'success',
      data: invites
    });
  } catch (error) {
    createError(res, 'Failed to fetch invites', 'FETCH_INVITES_ERROR', 500);
  }
};

// Accept job invite
export const acceptJobInvite = async (req: Request, res: Response) => {
  try {
    const { inviteId } = req.params;
    const studentId = (req as any).user.id;

    if (!isValidObjectId(inviteId)) {
      return createError(res, 'Invalid invite ID', 'INVALID_INVITE_ID');
    }

    const invite = await prisma.jobInvite.findUnique({
      where: { id: inviteId },
      include: { job: true }
    });

    if (!invite) {
      return createError(res, 'Invite not found', 'INVITE_NOT_FOUND', 404);
    }

    if (invite.studentId !== studentId) {
      return createError(res, 'Not authorized to accept this invite', 'UNAUTHORIZED', 403);
    }

    if (invite.status !== 'PENDING') {
      return createError(res, 'Invite is no longer pending', 'INVITE_EXPIRED');
    }

    // Update invite status
    await prisma.jobInvite.update({
      where: { id: inviteId },
      data: { status: 'ACCEPTED' }
    });

    // Create contract
    const contract = await prisma.contract.create({
      data: {
        studentId,
        employerId: invite.job.employerId,
        jobId: invite.job.id,
        agreementHash: 'pending', // Will be updated when stored on blockchain
        status: 'PENDING'
      },
      include: {
        student: true,
        employer: true,
        job: true
      }
    });

    res.json({
      status: 'success',
      message: 'Invite accepted and contract created',
      data: contract
    });
  } catch (error) {
    createError(res, 'Failed to accept invite', 'ACCEPT_INVITE_ERROR', 500);
  }
};

// Reject job invite
export const rejectJobInvite = async (req: Request, res: Response) => {
  try {
    const { inviteId } = req.params;
    const studentId = (req as any).user.id;

    if (!isValidObjectId(inviteId)) {
      return createError(res, 'Invalid invite ID', 'INVALID_INVITE_ID');
    }

    const invite = await prisma.jobInvite.findUnique({
      where: { id: inviteId }
    });

    if (!invite) {
      return createError(res, 'Invite not found', 'INVITE_NOT_FOUND', 404);
    }

    if (invite.studentId !== studentId) {
      return createError(res, 'Not authorized to reject this invite', 'UNAUTHORIZED', 403);
    }

    if (invite.status !== 'PENDING') {
      return createError(res, 'Invite is no longer pending', 'INVITE_EXPIRED');
    }

    await prisma.jobInvite.update({
      where: { id: inviteId },
      data: { status: 'REJECTED' }
    });

    res.json({
      status: 'success',
      message: 'Invite rejected successfully'
    });
  } catch (error) {
    createError(res, 'Failed to reject invite', 'REJECT_INVITE_ERROR', 500);
  }
};

// Get suggested freelancers for a job
export const getSuggestedFreelancers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employerId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 10;
    const minSimilarity = 0.01; // Lower threshold to 1% to ensure some recommendations

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Check if job exists and belongs to employer
    const job = await prisma.job.findUnique({
      where: { id },
      select: { 
        id: true,
        employerId: true,
        requiredSkills: true,
        status: true
      }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    if (job.employerId !== employerId) {
      return createError(res, 'Not authorized to view suggestions for this job', 'UNAUTHORIZED', 403);
    }

    if (job.status !== 'OPEN') {
      return createError(res, 'Cannot get suggestions for closed job', 'JOB_CLOSED');
    }

    // Get all students with matching skills
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        skills: {
          hasSome: job.requiredSkills
        },
        NOT: {
          OR: [
            {
              applications: {
                some: {
                  jobId: id,
                  status: 'ACCEPTED'
                }
              }
            },
            {
              userContracts: {
                some: {
                  jobId: id,
                  status: 'ACTIVE'
                }
              }
            }
          ]
        }
      },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        applications: {
          select: {
            jobId: true,
            status: true
          }
        },
        userContracts: {
          select: {
            jobId: true,
            status: true
          }
        }
      }
    });

    // Calculate similarity scores for each student
    const studentsWithScores = students.map(student => {
      const hasAppliedBefore = student.applications.some(app => app.jobId === id);
      const similarity = calculateSimilarityScore(
        student.skills,
        job.requiredSkills,
        student.badges,
        hasAppliedBefore
      );

      return {
        ...student,
        similarity,
        debug: {
          studentSkills: student.skills,
          jobSkills: job.requiredSkills,
          hasAppliedBefore,
          badgeCount: student.badges.length
        }
      } as unknown as StudentWithScore;
    });

    // Filter out students with zero similarity and sort by similarity score
    const filteredStudents = studentsWithScores
      .filter((student) => student.similarity.score >= minSimilarity)
      .sort((a, b) => b.similarity.score - a.similarity.score)
      .slice(0, limit);

    res.json({
      status: 'success',
      data: filteredStudents,
      meta: {
        total: filteredStudents.length,
        minSimilarity,
        limit,
        totalStudents: students.length,
        jobSkills: job.requiredSkills
      }
    });
  } catch (error) {
    createError(res, 'Failed to get freelancer suggestions', 'GET_SUGGESTIONS_ERROR', 500);
  }
};

// Mark job as completed
export const markJobAsCompleted = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const { completionNote } = req.body;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid job ID format', 'INVALID_JOB_ID');
    }

    // Get job with its contracts
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        contracts: {
          where: {
            status: 'ACTIVE'
          }
        }
      }
    });

    if (!job) {
      return createError(res, 'Job not found', 'JOB_NOT_FOUND', 404);
    }

    // Check if user is either employer or student
    const isEmployer = job.employerId === userId;
    const isStudent = job.contracts.some((contract: { studentId: string }) => contract.studentId === userId);

    if (!isEmployer && !isStudent) {
      return createError(res, 'You are not authorized to mark this job as completed', 'UNAUTHORIZED', 403);
    }

    // Get the active contract
    const activeContract = job.contracts[0];
    if (!activeContract) {
      return createError(res, 'No active contract found for this job', 'NO_ACTIVE_CONTRACT');
    }

    // Update contract status based on who is marking it complete
    const updateData: any = {
      completionNote: completionNote || null
    };

    if (isEmployer) {
      updateData.employerCompleted = true;
    } else {
      updateData.studentCompleted = true;
    }

    // Update contract
    const updatedContract = await prisma.contract.update({
      where: { id: activeContract.id },
      data: updateData
    });

    // If both parties have marked as complete, update job and contract status
    if (updatedContract.employerCompleted && updatedContract.studentCompleted) {
      await prisma.$transaction([
        prisma.job.update({
          where: { id },
          data: { status: 'CLOSED' }
        }),
        prisma.contract.update({
          where: { id: activeContract.id },
          data: { 
            status: 'COMPLETED',
            completedAt: new Date()
          }
        })
      ]);
    }

    res.json({
      status: 'success',
      message: isEmployer ? 
        'Job marked as completed by employer. Waiting for student confirmation.' :
        'Job marked as completed by student. Waiting for employer confirmation.',
      data: updatedContract
    });
  } catch (error) {
    createError(res, 'Failed to mark job as completed', 'COMPLETE_JOB_ERROR', 500);
  }
}; 