import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

// Helper function for user-friendly error messages
const createError = (res: Response, message: string, code: string, status: number = 400) => {
  return res.status(status).json({
    status: 'error',
    code,
    message,
    timestamp: new Date().toISOString()
  });
};

// Get all open source projects with optional filters
export const getAllOpenSourceProjects = async (req: Request, res: Response) => {
  try {
    const { 
      tech, 
      employerId, 
      difficulty,
      status = 'OPEN'
    } = req.query;
    
    const where: any = {
      status: status as string
    };
    
    if (tech) where.techStack = { has: tech as string };
    if (employerId) where.employerId = employerId as string;
    if (difficulty) where.difficulty = difficulty as string;

    const projects = await prisma.openSourceProject.findMany({
      where,
      include: {
        employer: {
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

    res.json({
      status: 'success',
      data: projects
    });
  } catch (error) {
    createError(res, 'Failed to fetch open source projects', 'FETCH_PROJECTS_ERROR', 500);
  }
};

// Get a single open source project by ID
export const getOpenSourceProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Since we're using Prisma, we don't need mongoose's isValidObjectId
    const project = await prisma.openSourceProject.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            profilePic: true
          }
        }
      }
    });

    if (!project) {
      return createError(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
    }

    res.json({
      status: 'success',
      data: project
    });
  } catch (error) {
    createError(res, 'Failed to fetch project', 'FETCH_PROJECT_ERROR', 500);
  }
};

// Create a new open source project
export const createOpenSourceProject = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      fullDescription,
      techStack,
      difficulty,
      goals,
      githubUrl,
      hiringLabel,
      contributionGuidelines,
      goodFirstIssues
    } = req.body;

    const employerId = (req as any).user.id;

    // Input validation
    if (!title?.trim()) {
      return createError(res, 'Project title is required', 'MISSING_TITLE');
    }
    if (!description?.trim()) {
      return createError(res, 'Project description is required', 'MISSING_DESCRIPTION');
    }
    if (!fullDescription?.trim()) {
      return createError(res, 'Full description is required', 'MISSING_FULL_DESCRIPTION');
    }
    if (!techStack?.length) {
      return createError(res, 'At least one technology is required', 'MISSING_TECH_STACK');
    }
    if (!difficulty) {
      return createError(res, 'Difficulty level is required', 'MISSING_DIFFICULTY');
    }
    if (!goals?.length) {
      return createError(res, 'At least one project goal is required', 'MISSING_GOALS');
    }
    if (!githubUrl?.trim()) {
      return createError(res, 'GitHub URL is required', 'MISSING_GITHUB_URL');
    }
    if (!contributionGuidelines?.trim()) {
      return createError(res, 'Contribution guidelines are required', 'MISSING_GUIDELINES');
    }
    if (!goodFirstIssues?.length) {
      return createError(res, 'At least one good first issue is required', 'MISSING_GOOD_FIRST_ISSUES');
    }

    const project = await prisma.openSourceProject.create({
      data: {
        title,
        description,
        fullDescription,
        techStack,
        difficulty,
        goals,
        githubUrl,
        hiringLabel,
        contributionGuidelines,
        goodFirstIssues,
        employerId,
        status: 'OPEN'
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Open source project created successfully',
      data: project
    });
  } catch (error) {
    createError(res, 'Failed to create project', 'CREATE_PROJECT_ERROR', 500);
  }
};

// Update an open source project
export const updateOpenSourceProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      fullDescription,
      techStack,
      difficulty,
      goals,
      githubUrl,
      hiringLabel,
      contributionGuidelines,
      goodFirstIssues,
      status
    } = req.body;
    const userId = (req as any).user.id;

    // Check if user is the employer
    const project = await prisma.openSourceProject.findUnique({
      where: { id },
      select: { employerId: true, status: true }
    });

    if (!project) {
      return createError(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
    }

    if (project.employerId !== userId) {
      return createError(res, 'You are not authorized to update this project', 'UNAUTHORIZED_EMPLOYER', 403);
    }

    // Validate status transition
    if (status && status !== project.status) {
      if (!['OPEN', 'CLOSED', 'DRAFT'].includes(status)) {
        return createError(res, 'Invalid project status', 'INVALID_STATUS');
      }
    }

    const updatedProject = await prisma.openSourceProject.update({
      where: { id },
      data: {
        title,
        description,
        fullDescription,
        techStack,
        difficulty,
        goals,
        githubUrl,
        hiringLabel,
        contributionGuidelines,
        goodFirstIssues,
        status
      }
    });

    res.json({
      status: 'success',
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    createError(res, 'Failed to update project', 'UPDATE_PROJECT_ERROR', 500);
  }
};

// Delete an open source project
export const deleteOpenSourceProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    // Check if user is the employer
    const project = await prisma.openSourceProject.findUnique({
      where: { id },
      select: { employerId: true }
    });

    if (!project) {
      return createError(res, 'Project not found', 'PROJECT_NOT_FOUND', 404);
    }

    if (project.employerId !== userId) {
      return createError(res, 'You are not authorized to delete this project', 'UNAUTHORIZED_EMPLOYER', 403);
    }

    await prisma.openSourceProject.delete({
      where: { id }
    });

    res.json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    createError(res, 'Failed to delete project', 'DELETE_PROJECT_ERROR', 500);
  }
}; 