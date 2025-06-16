import { createHash } from 'crypto';
import { Contract, Job, User } from '@prisma/client';
import { wrapDocument, WrappedDocument } from '@govtechsg/open-attestation';

// Interface for the agreement document structure (OpenAttestation v2)
interface AgreementDocument {
  version: string;
  data: {
    id: string;
    name: string;
    validFrom: string;
    template?: {
      name: string;
      type: string;
      url?: string;
    };
    recipient: {
      name: string;
      email: string;
    };
    issuer: {
      name: string;
      url?: string;
    };
    // Custom fields for job agreement
    student: {
      id: string;
      name: string;
      email: string;
    };
    employer: {
      id: string;
      name: string;
      email: string;
    };
    job: {
      id: string;
      title: string;
      type: string;
      location: string;
    };
    agreementDate: string;
    status: string;
  };
  issuers: {
    name: string;
    documentStore: string;
    identityProof: {
      type: 'DNS-TXT' | 'DNS-DID' | 'DID' | 'DOCUMENT_STORE';
      location: string;
    };
  }[];
}

/**
 * Generates a standardized agreement document from contract data
 */
export function generateAgreementDocument(
  contract: Contract & {
    student: User;
    employer: User;
    job: Job;
  }
): AgreementDocument {
  const documentId = `job-agreement-${contract.id}`;
  
  return {
    version: 'https://schema.openattestation.com/2.0/schema.json',
    data: {
      id: documentId,
      name: `Job Agreement - ${contract.job.title}`,
      validFrom: contract.createdAt.toISOString(),
      template: {
        name: 'Job Agreement Template',
        type: 'EMBEDDED_RENDERER',
      },
      recipient: {
        name: contract.student.name,
        email: contract.student.email,
      },
      issuer: {
        name: contract.employer.name,
      },
      // Custom fields for job agreement
      student: {
        id: contract.student.id,
        name: contract.student.name,
        email: contract.student.email,
      },
      employer: {
        id: contract.employer.id,
        name: contract.employer.name,
        email: contract.employer.email,
      },
      job: {
        id: contract.job.id,
        title: contract.job.title,
        type: contract.job.type,
        location: contract.job.location,
      },
      agreementDate: contract.createdAt.toISOString(),
      status: contract.status,
    },
    issuers: [
      {
        name: contract.employer.name,
        documentStore: process.env.DOCUMENT_STORE_ADDRESS || '0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3',
        identityProof: {
          type: 'DOCUMENT_STORE',
          location: process.env.DOCUMENT_STORE_ADDRESS || '0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3',
        },
      },
    ],
  };
}

/**
 * Alternative: Generate a minimal document that focuses on core OpenAttestation requirements
 */
export function generateMinimalAgreementDocument(
  contract: Contract & {
    student: User;
    employer: User;
    job: Job;
  }
): AgreementDocument {
  return {
    version: 'https://schema.openattestation.com/2.0/schema.json',
    data: {
      id: `agreement-${contract.id}`,
      name: `Employment Agreement`,
      validFrom: contract.createdAt.toISOString(),
      recipient: {
        name: contract.student.name,
        email: contract.student.email,
      },
      issuer: {
        name: contract.employer.name,
      },
      student: {
        id: contract.student.id,
        name: contract.student.name,
        email: contract.student.email,
      },
      employer: {
        id: contract.employer.id,
        name: contract.employer.name,
        email: contract.employer.email,
      },
      job: {
        id: contract.job.id,
        title: contract.job.title,
        type: contract.job.type,
        location: contract.job.location,
      },
      agreementDate: contract.createdAt.toISOString(),
      status: contract.status,
    },
    issuers: [
      {
        name: contract.employer.name,
        documentStore: process.env.DOCUMENT_STORE_ADDRESS || '0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3',
        identityProof: {
          type: 'DOCUMENT_STORE',
          location: process.env.DOCUMENT_STORE_ADDRESS || '0x8Fc57204c35fb9317D91285eF52D6b892EC08cD3',
        },
      },
    ],
  };
}

/**
 * Wraps the agreement document using OpenAttestation and returns the wrapped document and merkle root
 */
export function wrapAgreementDocument(document: AgreementDocument): { wrapped: WrappedDocument<any>, merkleRoot: string } {
  try {
    console.log('Wrapping document:', JSON.stringify(document, null, 2));
    const wrapped = wrapDocument(document as any);
    const merkleRoot = wrapped.signature.merkleRoot;
    console.log('Document wrapped successfully, merkle root:', merkleRoot);
    return { wrapped, merkleRoot };
  } catch (error) {
    console.error('Error wrapping document:', error);
    console.error('Document that failed:', JSON.stringify(document, null, 2));
    throw error;
  }
}

/**
 * Validates the document structure before wrapping
 */
export function validateDocumentStructure(document: AgreementDocument): boolean {
  // Basic validation
  if (!document.version || !document.data || !document.issuers) {
    throw new Error('Missing required top-level fields');
  }

  if (!Array.isArray(document.issuers) || document.issuers.length === 0) {
    throw new Error('Issuers must be a non-empty array');
  }

  for (const issuer of document.issuers) {
    if (!issuer.name || !issuer.documentStore || !issuer.identityProof) {
      throw new Error('Issuer missing required fields');
    }

    if (!issuer.identityProof.type || !issuer.identityProof.location) {
      throw new Error('Identity proof missing required fields');
    }
  }

  if (!document.data.id || !document.data.name) {
    throw new Error('Document data missing required fields');
  }

  return true;
}

/**
 * Hashes a document using SHA-256 (for internal use, not for OA)
 */
export function hashDocument(document: AgreementDocument): string {
  const documentString = JSON.stringify(document);
  return createHash('sha256').update(documentString).digest('hex');
}

/**
 * Generates a verification link for the document
 */
export function getVerificationLink(hash: string): string {
  return `/verify/${hash}`;
}

/**
 * Mock function to store a document on the blockchain
 */
export async function storeDocumentOnChain(
  document: AgreementDocument
): Promise<{ transactionHash: string }> {
  try {
    // Generate a mock transaction hash
    const transactionHash = generateMockTransactionHash(document);
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      transactionHash,
    };
  } catch (error) {
    console.error('Error in mock blockchain storage:', error);
    throw new Error('Failed to store document on mock blockchain');
  }
}

/**
 * Generates a mock transaction hash for the document
 */
export function generateMockTransactionHash(document: AgreementDocument): string {
  const documentString = JSON.stringify(document);
  const hash = createHash('sha256').update(documentString).digest('hex');
  return `0x${hash}`;
}