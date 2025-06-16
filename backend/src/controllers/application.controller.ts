import { Request, Response } from 'express';
import prisma from '../utils/prisma';

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

// Get all applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { status } = req.query;

    const where: any = {};
    if (status) where.status = status;

    // Get applications where user is either the student or employer
    const applications = await prisma.application.findMany({
      where: {
        OR: [
          { studentId: userId },
          { job: { employerId: userId } }
        ],
        ...where
      },
      include: {
        job: {
          select: {
            title: true,
            employer: {
              select: {
                id: true,
                name: true,
                profilePic: true
              }
            }
          }
        },
        student: {
          select: {
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
      data: applications
    });
  } catch (error) {
    createError(res, 'Failed to fetch applications', 'FETCH_APPLICATIONS_ERROR', 500);
  }
};

// Get application by ID
export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid application ID format', 'INVALID_APPLICATION_ID');
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            title: true,
            description: true,
            requiredSkills: true,
            employer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
                bio: true
              }
            }
          }
        },
        student: {
          select: {
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
      }
    });

    if (!application) {
      return createError(res, 'Application not found', 'APPLICATION_NOT_FOUND', 404);
    }

    // Check if user is authorized to view this application
    if (application.studentId !== userId && application.job.employer.id !== userId) {
      return createError(res, 'You are not authorized to view this application', 'UNAUTHORIZED', 403);
    }

    res.json({
      status: 'success',
      data: application
    });
  } catch (error) {
    createError(res, 'Failed to fetch application', 'FETCH_APPLICATION_ERROR', 500);
  }
};

// Update application status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid application ID format', 'INVALID_APPLICATION_ID');
    }

    if (!status || !['PENDING', 'ACCEPTED', 'REJECTED'].includes(status)) {
      return createError(res, 'Invalid status value', 'INVALID_STATUS');
    }

    // Check if application exists and user is the employer
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            employerId: true
          }
        }
      }
    });

    if (!application) {
      return createError(res, 'Application not found', 'APPLICATION_NOT_FOUND', 404);
    }

    if (application.job.employerId !== userId) {
      return createError(res, 'Only the employer can update application status', 'UNAUTHORIZED', 403);
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: {
          select: {
            title: true,
            employer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        student: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    res.json({
      status: 'success',
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    createError(res, 'Failed to update application status', 'UPDATE_STATUS_ERROR', 500);
  }
};

// Delete application
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    if (!isValidObjectId(id)) {
      return createError(res, 'Invalid application ID format', 'INVALID_APPLICATION_ID');
    }

    // Check if application exists and user is the student
    const application = await prisma.application.findUnique({
      where: { id },
      select: { studentId: true }
    });

    if (!application) {
      return createError(res, 'Application not found', 'APPLICATION_NOT_FOUND', 404);
    }

    if (application.studentId !== userId) {
      return createError(res, 'Only the applicant can delete their application', 'UNAUTHORIZED', 403);
    }

    await prisma.application.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      message: 'Application deleted successfully'
    });
  } catch (error) {
    createError(res, 'Failed to delete application', 'DELETE_APPLICATION_ERROR', 500);
  }
}; 