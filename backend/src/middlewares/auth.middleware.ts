import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check for token in cookies first
  const tokenFromCookie = req.cookies?.token;
  
  // Then check authorization header
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  // Use token from cookie if available, otherwise use token from header
  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded; // Add custom typing for Request below
    next(); 
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};


export const employerOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'EMPLOYER') {
    return res.status(403).json({ error: 'Employer access required' });
  }
  next();
};
