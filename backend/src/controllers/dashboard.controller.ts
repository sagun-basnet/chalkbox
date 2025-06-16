import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Get user dashboard data
export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get user profile with skills
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        workshopsHosted: {
          take: 3,
          orderBy: { createdAt: 'desc' }
        },
        applications: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: { job: true }
        }
      }
    });

    // Get matching jobs
    const matchingJobs = await prisma.job.findMany({
      where: {
        requiredSkills: {
          hasSome: userProfile?.skills || []
        }
      },
      take: 3,
      include: {
        employer: true
      }
    });

    return res.json({
      userProfile,
      matchingJobs,
      recentActivities: {
        workshops: userProfile?.workshopsHosted,
        applications: userProfile?.applications
      }
    });
  } catch (error) {
    console.error('Error in getUserDashboard:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get employer dashboard data
export const getEmployerDashboard = async (req: Request, res: Response) => {
  try {
    const employerId = req.user?.id;

    // Get employer profile
    const employerProfile = await prisma.user.findUnique({
      where: { id: employerId },
      include: {
        jobPosts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            applications: {
              include: {
                student: true
              }
            }
          }
        }
      }
    });

    // Get recent applications
    const recentApplications = await prisma.application.findMany({
      where: {
        job: {
          employerId
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: true,
        job: true
      }
    });

    // Get workshop statistics
    const workshopStats = await prisma.workshop.aggregate({
      where: {
        hostId: employerId
      },
      _count: true,
      _avg: {
        tokensEarned: true
      }
    });

    return res.json({
      employerProfile,
      recentApplications,
      workshopStats,
      postedJobs: employerProfile?.jobPosts
    });
  } catch (error) {
    console.error('Error in getEmployerDashboard:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get matching jobs for user
export const getMatchingJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    const jobs = await prisma.job.findMany({
      where: {
        requiredSkills: {
          hasSome: user?.skills || []
        }
      },
      include: {
        employer: true
      },
      take: 5
    });

    return res.json(jobs);
  } catch (error) {
    console.error('Error in getMatchingJobs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get recent activities
export const getRecentActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    const activities = await prisma.$transaction([
      prisma.workshop.findMany({
        where: { hostId: userId },
        take: 3,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.findMany({
        where: { studentId: userId },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { job: true }
      })
    ]);

    return res.json({
      workshops: activities[0],
      applications: activities[1]
    });
  } catch (error) {
    console.error('Error in getRecentActivities:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Get badges and achievements
export const getBadgesAndAchievements = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: {
            badge: true
          }
        },
        workshopsHosted: {
          where: {
            reviews: {
              some: {
                rating: {
                  gte: 4
                }
              }
            }
          }
        },
        applications: {
          where: {
            status: 'ACCEPTED'
          }
        }
      }
    });

    return res.json({
      badges: user?.badges.map(ub => ub.badge),
      achievements: {
        highRatedWorkshops: user?.workshopsHosted.length || 0,
        successfulApplications: user?.applications.length || 0
      }
    });
  } catch (error) {
    console.error('Error in getBadgesAndAchievements:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 