import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { calculateSimilarityScore, sortBySimilarity } from '../utils/recommendation';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all workshops with optional filters
export const getAllWorkshops = async (req: Request, res: Response) => {
  try {
    const { skill, hostId, priceRange, minRating } = req.query;
    
    const where: any = {};
    if (skill) where.skillsTaught = { has: skill as string };
    if (hostId) where.hostId = hostId as string;
    if (priceRange) {
      const [min, max] = (priceRange as string).split('-');
      where.price = {
        gte: parseFloat(min),
        lte: parseFloat(max)
      };
    }

    const workshops = await prisma.workshop.findMany({
      where,
      include: {
        host: {
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
        attendees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        },
        reviews: true
      }
    });

    // Filter by minimum rating if provided
    let filteredWorkshops = workshops;
    if (minRating) {
      filteredWorkshops = workshops.filter(workshop => {
        const avgRating = workshop.reviews.reduce((sum, review) => sum + review.rating, 0) / workshop.reviews.length;
        return avgRating >= parseInt(minRating as string);
      });
    }

    res.json(filteredWorkshops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workshops', error });
  }
};

// Get workshop by ID
export const getWorkshopById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    const workshop = await prisma.workshop.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            bio: true,
            badges: {
              include: {
                badge: true
              }
            }
          }
        },
        attendees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        }
      }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Calculate average rating
    const avgRating = workshop.reviews.length > 0 
      ? workshop.reviews.reduce((sum, review) => sum + review.rating, 0) / workshop.reviews.length
      : 0;

    res.json({ ...workshop, avgRating });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workshop', error });
  }
};

// Create new workshop
export const createWorkshop = async (req: Request, res: Response) => {
  try {
    const { 
      title, 
      description, 
      zoomLink, 
      price, 
      skillsTaught, 
      startDate, 
      endDate,
      totalSeats,
      outcomes,
      rules,
      zoomStatus 
    } = req.body;
    const hostId = (req as any).user.id; // From auth middleware

    // Required fields validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!zoomLink) {
      return res.status(400).json({ message: 'Zoom link is required' });
    }
    if (!price || isNaN(parseFloat(price))) {
      return res.status(400).json({ message: 'Valid price is required' });
    }
    if (!skillsTaught || !Array.isArray(skillsTaught) || skillsTaught.length === 0) {
      return res.status(400).json({ message: 'At least one skill is required' });
    }
    if (!startDate) {
      return res.status(400).json({ message: 'Start date is required' });
    }
    if (!endDate) {
      return res.status(400).json({ message: 'End date is required' });
    }
    if (!totalSeats || isNaN(parseInt(totalSeats)) || parseInt(totalSeats) <= 0) {
      return res.status(400).json({ message: 'Valid total seats is required' });
    }
    if (!outcomes || !Array.isArray(outcomes) || outcomes.length === 0) {
      return res.status(400).json({ message: 'At least one outcome is required' });
    }
    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ message: 'At least one rule is required' });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: 'Invalid start date format' });
    }
    if (isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid end date format' });
    }
    if (start < now) {
      return res.status(400).json({ message: 'Start date must be in the future' });
    }
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Validate price
    const parsedPrice = parseFloat(price);
    if (parsedPrice < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    // Validate total seats
    const parsedTotalSeats = parseInt(totalSeats);
    if (parsedTotalSeats <= 0) {
      return res.status(400).json({ message: 'Total seats must be greater than 0' });
    }

    const workshop = await prisma.workshop.create({
      data: {
        title,
        description,
        zoomLink,
        price: parsedPrice,
        skillsTaught,
        hostId,
        startDate: start,
        endDate: end,
        status: 'UPCOMING',
        totalSeats: parsedTotalSeats,
        outcomes,
        rules,
         tokensEarned: parseInt(req.body.tokensEarned) || 0,
        zoomStatus: zoomStatus || 'Link will be active 30 minutes before event'
      },
      include: {
        host: {
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
        }
      }
    });

    res.status(201).json(workshop);
  } catch (error :any) {
    console.error('Error creating workshop:', error);
    res.status(500).json({ message: 'Error creating workshop', error: error.message });
  }
};

// Update workshop
export const updateWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, zoomLink, price, skillsTaught, startDate, endDate, status } = req.body;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    // Check if user is the host
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      select: { hostId: true, status: true }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    if (workshop.hostId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this workshop' });
    }

    // Validate status transition
    if (status && status !== workshop.status) {
      if (!['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid workshop status' });
      }
    }

    // Validate dates if provided
    let start, end;
    if (startDate) {
      start = new Date(startDate);
      if (start < new Date()) {
        return res.status(400).json({ message: 'Start date must be in the future' });
      }
    }
    if (endDate) {
      end = new Date(endDate);
      if (start && end <= start) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }

    const updatedWorkshop = await prisma.workshop.update({
      where: { id },
      data: {
        title,
        description,
        zoomLink,
        price: price ? parseFloat(price) : undefined,
        skillsTaught,
        startDate: start,
        endDate: end,
        status
      }
    });

    res.json(updatedWorkshop);
  } catch (error) {
    res.status(500).json({ message: 'Error updating workshop', error });
  }
};

// Delete workshop
export const deleteWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    // Check if user is the host
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    if (workshop.hostId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this workshop' });
    }

    // Use transaction to delete related records
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { workshopId: id } }),
      prisma.userWorkshop.deleteMany({ where: { workshopId: id } }),
      prisma.workshop.delete({ where: { id } })
    ]);

    res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workshop', error });
  }
};

// Register for workshop
export const registerForWorkshop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    // Check if workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check if already registered
    const existingRegistration = await prisma.userWorkshop.findFirst({
      where: {
        userId,
        workshopId: id
      }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this workshop' });
    }

    // Register user
    await prisma.userWorkshop.create({
      data: {
        userId,
        workshopId: id
      }
    });

    res.json({ message: 'Successfully registered for workshop' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering for workshop', error });
  }
};

// Get workshop attendees
export const getWorkshopAttendees = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    // Check if user is the host or admin
    const workshop = await prisma.workshop.findUnique({
      where: { id },
      select: { hostId: true }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (workshop.hostId !== userId && user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to view attendees' });
    }

    const attendees = await prisma.userWorkshop.findMany({
      where: { workshopId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            email: true,
            skills: true
          }
        }
      }
    });

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendees', error });
  }
};

// Get workshop reviews
export const getWorkshopReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    // Check if workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const reviews = await prisma.review.findMany({
      where: { 
        workshopId: id
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// Add workshop review
export const addWorkshopReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid workshop ID format' });
    }

    // Check if workshop exists
    const workshop = await prisma.workshop.findUnique({
      where: { id }
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Check if workshop is upcoming
    if (workshop.status === 'UPCOMING') {
      return res.status(400).json({ message: 'Cannot review upcoming workshops' });
    }

    // Check if user has attended the workshop
    const attendance = await prisma.userWorkshop.findFirst({
      where: {
        userId,
        workshopId: id
      }
    });

    if (!attendance) {
      return res.status(403).json({ message: 'Must attend workshop to review' });
    }

    // Check if already reviewed
    const existingReview = await prisma.review.findFirst({
      where: {
        workshopId: id,
        reviewerId: userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Already reviewed this workshop' });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        workshopId: id,
        reviewerId: userId
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    // Check if host qualifies for a badge
    const hostReviews = await prisma.review.count({
      where: {
        workshop: {
          hostId: workshop.hostId
        },
        rating: 5
      }
    });

    if (hostReviews >= 10) {
      const guruBadge = await prisma.badge.findFirst({
        where: { name: 'GURU' }
      });

      if (guruBadge) {
        await prisma.userBadge.upsert({
          where: {
            userId_badgeId: {
              userId: workshop.hostId,
              badgeId: guruBadge.id
            }
          },
          create: {
            userId: workshop.hostId,
            badgeId: guruBadge.id
          },
          update: {}
        });
      }
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error });
  }
};

// Get personalized workshop suggestions
export const getWorkshopSuggestions = async (req: Request, res: Response) => {
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
        workshopsAttended: {
          select: {
            workshopId: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all upcoming and ongoing workshops
    const workshops = await prisma.workshop.findMany({
      where: {
        status: {
          in: ['UPCOMING', 'ONGOING']
        },
        endDate: {
          gt: new Date() // Only get workshops that haven't ended
        }
      },
      include: {
        host: {
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
        attendees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
        }
      },
        reviews: true
      }
    });

    // Calculate similarity scores for each workshop
    const workshopsWithScores = workshops.map(workshop => {
      const hasAttendedBefore = user.workshopsAttended.some(
        attended => attended.workshopId === workshop.id
      );
      
      const similarity = calculateSimilarityScore(
        user.skills,
        workshop.skillsTaught,
        user.badges,
        hasAttendedBefore
      );

      // Calculate average rating
      const avgRating = workshop.reviews.length > 0
        ? workshop.reviews.reduce((sum, review) => sum + review.rating, 0) / workshop.reviews.length
        : 0;

      return {
        ...workshop,
        avgRating,
        similarity,
        debug: {
          userSkills: user.skills,
          workshopSkills: workshop.skillsTaught,
          hasAttendedBefore,
          badgeCount: user.badges.length,
          status: workshop.status,
          startDate: workshop.startDate,
          endDate: workshop.endDate
        }
      };
    });

    // Filter out workshops with zero similarity and sort by similarity score
    const filteredWorkshops = workshopsWithScores
      .filter(workshop => workshop.similarity.score >= minSimilarity)
      .sort((a, b) => b.similarity.score - a.similarity.score)
      .slice(0, limit);

    res.json({
      status: 'success',
      data: filteredWorkshops,
      meta: {
        total: filteredWorkshops.length,
        minSimilarity,
        limit,
        totalWorkshops: workshops.length,
        userSkills: user.skills,
        userBadges: user.badges.map(b => b.badge.tier)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting workshop suggestions', error });
  }
};

// Get workshops organized by the user
export const getMyOrganizedWorkshops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const workshops = await prisma.workshop.findMany({
      where: {
        hostId: userId
      },
      include: {
        attendees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            attendees: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average ratings
    const workshopsWithRatings = workshops.map(workshop => {
      const avgRating = workshop.reviews.length > 0
        ? workshop.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / workshop.reviews.length
        : 0;
      return {
        ...workshop,
        avgRating,
        attendeesCount: workshop._count.attendees
      };
    });

    res.json(workshopsWithRatings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organized workshops', error });
  }
};

// Get workshops joined by the user
export const getMyJoinedWorkshops = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const userWorkshops = await prisma.userWorkshop.findMany({
      where: {
        userId: userId
      },
      include: {
        workshop: {
          include: {
            host: {
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
            reviews: {
              select: {
                rating: true
              }
            },
            _count: {
              select: {
                attendees: true
              }
            }
          }
        }
      },
      orderBy: {
        attendedAt: 'desc'
      }
    });

    // Transform the data and calculate average ratings
    const workshops = userWorkshops.map(uw => {
      const workshop = uw.workshop;
      const avgRating = workshop.reviews.length > 0
        ? workshop.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0) / workshop.reviews.length
        : 0;
      return {
        ...workshop,
        avgRating,
        attendeesCount: workshop._count.attendees,
        joinedAt: uw.attendedAt
      };
    });

    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching joined workshops', error });
  }
};