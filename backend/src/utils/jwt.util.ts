import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn:'3d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
