import { Request, Response } from 'express';
import { PrismaClient, ContractStatus, Contract } from '@prisma/client';
import { generateAgreementDocument, wrapAgreementDocument, getVerificationLink, storeDocumentOnChain, generateMockTransactionHash } from '../utils/blockchain';

const prisma = new PrismaClient();

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Helper function to create error response
function createErrorResponse(res: Response, status: number, message: string) {
  return res.status(status).json({
    status: 'error',
    message,
  });
}

// Get all contracts
export const getAllContracts = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    const where = {
      OR: [
        { studentId: userId },
        { employerId: userId },
      ],
      ...(status && { status: status as ContractStatus }),
    };

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        student: true,
        employer: true,
        job: true,
      },
    });

    return res.json({
      status: 'success',
      data: contracts,
    });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return createErrorResponse(res, 500, 'Failed to fetch contracts');
  }
};

// Get contract by ID
export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(id)) {
      return createErrorResponse(res, 400, 'Invalid contract ID');
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
      select: {
        id: true,
        student: true,
        studentId:true,
        employerId:true,
        employer: true,
        job: true,
        blockchainHash: true,
      },
    });

    if (!contract) {
      return createErrorResponse(res, 404, 'Contract not found');
    }

    if (contract.studentId !== userId && contract.employerId !== userId) {
      return createErrorResponse(res, 403, 'Not authorized to view this contract');
    }

    return res.json({
      status: 'success',
      data: contract,
    });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return createErrorResponse(res, 500, 'Failed to fetch contract');
  }
};

// Store contract on blockchain
export const storeContractOnChain = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(id)) {
      return createErrorResponse(res, 400, 'Invalid contract ID');
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        student: true,
        employer: true,
        job: true,
      },
    });

    if (!contract) {
      return createErrorResponse(res, 404, 'Contract not found');
    }

    if (contract.employerId !== userId) {
      return createErrorResponse(res, 403, 'Only the employer can store the contract on blockchain');
    }

    // Check if contract is already stored on blockchain
    if (contract.blockchainHash) {
      return createErrorResponse(res, 400, 'Contract is already stored on blockchain');
    }

    // Generate agreement document
    const agreementDocument = generateAgreementDocument(contract);

    // Store document on mock blockchain
    const { transactionHash } = await storeDocumentOnChain(agreementDocument);

    // Update contract with blockchain hash and transaction hash
    const updatedContract = await prisma.contract.update({
      where: { id },
      data: {
        blockchainHash: transactionHash,
        transactionHash: transactionHash,
      },
      include: {
        student: true,
        employer: true,
        job: true,
      },
    });

    // Generate verification link
    const verificationLink = getVerificationLink(transactionHash);

    return res.json({
      status: 'success',
      data: {
        contract: updatedContract,
        verificationLink,
      },
    });
  } catch (error) {
    console.error('Error storing contract on blockchain:', error);
    return createErrorResponse(res, 500, 'Failed to store contract on blockchain');
  }
};

// Update contract status
export const updateContractStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return createErrorResponse(res, 401, 'Unauthorized');
    }

    if (!isValidObjectId(id)) {
      return createErrorResponse(res, 400, 'Invalid contract ID');
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        job: true
      }
    });

    if (!contract) {
      return createErrorResponse(res, 404, 'Contract not found');
    }

    if (contract.studentId !== userId && contract.employerId !== userId) {
      return createErrorResponse(res, 403, 'Not authorized to update this contract');
    }

    // Allow status update to DISPUTED at any time
    if (status === 'DISPUTED') {
      const updatedContract = await prisma.contract.update({
        where: { id },
        data: {
          status: 'DISPUTED'
        },
        include: {
          student: true,
          employer: true,
          job: true
        }
      });

      return res.json({
        status: 'success',
        data: updatedContract
      });
    }

    // For other status updates, check if contract is not disputed
    if (contract.status === 'DISPUTED') {
      return createErrorResponse(res, 400, 'Cannot update status of a disputed contract');
    }

    const updatedContract = await prisma.contract.update({
      where: { id },
      data: {
        status: status as ContractStatus,
        ...(status === 'COMPLETED' && { completedAt: new Date() })
      },
      include: {
        student: true,
        employer: true,
        job: true
      }
    });

    return res.json({
      status: 'success',
      data: updatedContract
    });
  } catch (error) {
    console.error('Error updating contract status:', error);
    return createErrorResponse(res, 500, 'Failed to update contract status');
  }
};

// Verify contract
export const verifyContract = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return createErrorResponse(res, 400, 'Hash is required');
    }

    // Find contract by blockchain hash
    const contract = await prisma.contract.findFirst({
      where: {
        blockchainHash: hash
      },
      include: {
        student: true,
        employer: true,
        job: true,
      },
    });

    if (!contract) {
      return createErrorResponse(res, 404, 'Contract not found');
    }

    // Generate agreement document for verification
    const agreementDocument = generateAgreementDocument(contract);
    const documentHash = generateMockTransactionHash(agreementDocument);

    // Verify if the stored hash matches the generated hash
    const isValid = documentHash === hash;

    return res.json({
      status: 'success',
      data: {
        isValid,
        contract: {
          id: contract.id,
          student: {
            name: contract.student.name,
            email: contract.student.email,
          },
          employer: {
            name: contract.employer.name,
            email: contract.employer.email,
          },
          job: {
            title: contract.job.title,
            type: contract.job.type,
            location: contract.job.location,
          },
          status: contract.status,
          createdAt: contract.createdAt,
          completedAt: contract.completedAt,
        },
      },
    });
  } catch (error) {
    console.error('Error verifying contract:', error);
    return createErrorResponse(res, 500, 'Failed to verify contract');
  }
}; 