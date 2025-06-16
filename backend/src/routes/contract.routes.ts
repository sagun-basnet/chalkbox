import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  getAllContracts,
  getContractById,
  storeContractOnChain,
  updateContractStatus,
  verifyContract
} from '../controllers/contract.controller';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all contracts
router.get('/', getAllContracts);

// Get contract by ID
router.get('/:id', getContractById);

// Store contract on blockchain
router.post('/:id/store-on-chain', storeContractOnChain);

// Update contract status
router.patch('/:id/status', updateContractStatus);

// Verify contract
router.get('/verify/:hash', verifyContract);

// Get contract reviews
router.get('/:id/reviews', async (req, res) => {
  // TODO: Implement controller
});

export default router; 