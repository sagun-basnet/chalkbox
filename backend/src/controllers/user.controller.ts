import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/errorHandler';

const client = prisma;

import { generateToken } from '../utils/jwt.util';
//register user
export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  // Generate token
  const token = generateToken({ id: user.id, role: user.role });

  // Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict',
    maxAge: 48 * 60 * 60 * 1000 // 24 hours
  });

  res.status(201).json({ user });
};
//login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken({ id: user.id, role: user.role });

  // Set token in cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.status(200).json({ token, user });
};

//get user profile
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        badges: {
          include: { badge: true },
        },
        reviewsReceived: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                profilePic: true,
              },
            },
            job: {
              select: {
                id: true,
                title: true,
              },
            },
            workshop: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        workshopsAttended: {
          include: {
            workshop: true,
          },
        },
        workshopsHosted: true,
        applications: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

//get all ther users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await client.user.findMany();
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
//get single user by id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await client.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

//update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await client.user.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
//delete user 
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await client.user.delete({
      where: { id: req.params.id },
    });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserHostedWorkshops = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workshops = await client.workshop.findMany({
      where: { hostId: req.params.id },
    });

    res.status(200).json({
      status: 'success',
      data: workshops,
    });
  } catch (error) {
    next(error);
  }
};
//get user attendance workshop
export const getUserAttendedWorkshops = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userWorkshops = await client.userWorkshop.findMany({
      where: { userId: req.params.id },
      include: { workshop: true },
    });

    res.status(200).json({
      status: 'success',
      data: userWorkshops.map((uw: any) => uw.workshop),
    });
  } catch (error) {
    next(error);
  }
};
//get user badge
export const getUserBadges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const badges = await client.userBadge.findMany({
      where: { userId: req.params.id },
      include: { badge: true },
    });

    res.status(200).json({
      status: 'success',
      data: badges,
    });
  } catch (error) {
    next(error);
  }
};
//get user job review 
export const getUserJobReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await client.review.findMany({
      where: {
        targetId: req.params.id,
        jobId: { not: null }, // ✅ Only job-related reviews
      },
      include: {
        reviewer: { select: { id: true, name: true, profilePic: true } },
        job: { select: { id: true, title: true } },
      },
    });

    res.status(200).json({ status: 'success', data: reviews });
  } catch (error) {
    next(error);
  }
};

//get user workshop review 
export const getUserWorkshopReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await client.review.findMany({
      where: {
        targetId: req.params.id,
        workshopId: { not: null }, // ✅ Only workshop-related reviews
      },
      include: {
        reviewer: { select: { id: true, name: true, profilePic: true } },
        workshop: { select: { id: true, title: true } },
      },
    });

    res.status(200).json({ status: 'success', data: reviews });
  } catch (error) {
    next(error);
  }
};

//create badge 
export const createBadge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, iconUrl, tier } = req.body;

    const badge = await client.badge.create({
      data: { name, description, iconUrl, tier },
    });

    res.status(201).json({ status: 'success', data: badge });
  } catch (error) {
    next(error);
  }
};

// assign badge admin 
export const assignBadgeToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, badgeId } = req.body;

    const userBadge = await client.userBadge.create({
      data: { userId, badgeId },
      include: {
        user: { select: { name: true, role: true } },
        badge: true,
      },
    });

    res.status(201).json({ status: 'success', data: userBadge });
  } catch (error) {
    next(error);
  }
};

