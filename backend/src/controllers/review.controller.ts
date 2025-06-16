import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Get all reviews (optionally filter by jobId, workshopId, reviewerId, targetId)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { jobId, workshopId, reviewerId, targetId } = req.query;
    const where: any = {};
    if (jobId && isValidObjectId(String(jobId))) where.jobId = jobId;
    if (workshopId && isValidObjectId(String(workshopId))) where.workshopId = workshopId;
    if (reviewerId && isValidObjectId(String(reviewerId))) where.reviewerId = reviewerId;
    if (targetId && isValidObjectId(String(targetId))) where.targetId = targetId;
    const reviews = await prisma.review.findMany({
      where,
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
        target: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
        workshop: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ status: 'success', data: reviews });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch reviews', error });
  }
};

// Get review by ID
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ status: 'error', message: 'Invalid review ID' });
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        reviewer: { select: { id: true, name: true, email: true } },
        target: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true } },
        workshop: { select: { id: true, title: true } }
      }
    });
    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
    res.json({ status: 'success', data: review });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch review', error });
  }
};

// Create new review (for job or workshop)
export const createReview = async (req: Request, res: Response) => {
  try {
    const { reviewerId, targetId, jobId, workshopId, rating, comment } = req.body;
    if (!isValidObjectId(reviewerId)) return res.status(400).json({ status: 'error', message: 'Invalid reviewer ID' });
    if (jobId && !isValidObjectId(jobId)) return res.status(400).json({ status: 'error', message: 'Invalid job ID' });
    if (workshopId && !isValidObjectId(workshopId)) return res.status(400).json({ status: 'error', message: 'Invalid workshop ID' });
    if (targetId && !isValidObjectId(targetId)) return res.status(400).json({ status: 'error', message: 'Invalid target ID' });
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) return res.status(400).json({ status: 'error', message: 'Rating must be 1-5' });
    // Only one of jobId or workshopId should be set
    if ((jobId && workshopId) || (!jobId && !workshopId)) return res.status(400).json({ status: 'error', message: 'Specify either jobId or workshopId' });
    // Enforce unique constraint
    const existing = await prisma.review.findFirst({
      where: {
        reviewerId,
        ...(jobId ? { jobId } : { workshopId })
      }
    });
    if (existing) return res.status(409).json({ status: 'error', message: 'You have already reviewed this job/workshop' });
    const review = await prisma.review.create({
      data: {
        reviewerId,
        targetId,
        jobId,
        workshopId,
        rating,
        comment
      }
    });
    res.status(201).json({ status: 'success', data: review });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to create review', error });
  }
};

// Update review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ status: 'error', message: 'Invalid review ID' });
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
    const updated = await prisma.review.update({
      where: { id },
      data: { rating, comment }
    });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update review', error });
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ status: 'error', message: 'Invalid review ID' });
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ status: 'error', message: 'Review not found' });
    await prisma.review.delete({ where: { id } });
    res.json({ status: 'success', message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete review', error });
  }
}; 