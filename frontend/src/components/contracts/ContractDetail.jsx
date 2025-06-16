import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { get, post } from '../../utils/api';
import { Scale, CheckCircle, AlertCircle, Clock, ExternalLink, FileText, XCircle } from 'lucide-react';

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completionNote, setCompletionNote] = useState('');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await get(`/api/contracts/${id}`);
      setContract(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contract details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreOnChain = async () => {
    try {
      await post(`api/contracts/${id}/store-on-chain`);
      fetchContract();
    } catch (err) {
      console.error('Failed to store contract on chain:', err);
    }
  };

  const handleCompleteContract = async () => {
    try {
      await post(`api/contracts/${id}/status`, {
        status: 'COMPLETED',
        completionNote
      });
      fetchContract();
      setCompletionNote('');
    } catch (err) {
      console.error('Failed to complete contract:', err);
    }
  };

  const handleVerifyContract = async () => {
    if (!contract?.blockchainHash) return;
    
    try {
      setVerifying(true);
      const response = await get(`/api/contracts/verify/${contract.blockchainHash}`);
      setVerificationStatus(response.data);
    } catch (err) {
      console.error('Failed to verify contract:', err);
      setVerificationStatus({ isValid: false });
    } finally {
      setVerifying(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'DISPUTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'ACTIVE':
        return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />;
      case 'DISPUTED':
        return <Scale className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!contract) return <div className="text-center p-4">Contract not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/contracts')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Contracts
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {contract.job.title}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusBadgeClass(
                  contract.status
                )}`}
              >
                {getStatusIcon(contract.status)}
                {contract.status}
              </span>
              {contract.blockchainHash && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVerifyContract}
                    disabled={verifying}
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {verifying ? 'Verifying...' : 'Verify Contract'}
                  </button>
                  {verificationStatus && (
                    <span className={`flex items-center gap-1 text-sm ${
                      verificationStatus.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationStatus.isValid ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {verificationStatus.isValid ? 'Valid Contract' : 'Invalid Contract'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Created: {new Date(contract.createdAt).toLocaleDateString()}
            {contract.completedAt && (
              <div>
                Completed: {new Date(contract.completedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Employer Details</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium">{contract.employer.name}</p>
              <p className="text-gray-600">{contract.employer.email}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Student Details</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium">{contract.student.name}</p>
              <p className="text-gray-600">{contract.student.email}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Job Details</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="mb-2"><strong>Description:</strong> {contract.job.description}</p>
            <p className="mb-2"><strong>Required Skills:</strong> {contract.job.requiredSkills.join(', ')}</p>
            <p><strong>Location:</strong> {contract.job.location}</p>
          </div>
        </div>

        {contract.blockchainHash && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Blockchain Details</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p className="mb-2">
                <strong>Transaction Hash:</strong>{' '}
                <span className="font-mono text-sm">{contract.transactionHash}</span>
              </p>
              <p>
                <strong>Blockchain Hash:</strong>{' '}
                <span className="font-mono text-sm">{contract.blockchainHash}</span>
              </p>
            </div>
          </div>
        )}

        {contract.status === 'ACTIVE' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Complete Contract</h2>
            <div className="space-y-4">
              <textarea
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
                placeholder="Add a completion note..."
              />
              <button
                onClick={handleCompleteContract}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        )}

        {contract.status === 'ACTIVE' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="flex gap-4">
              {!contract.blockchainHash && (
                <button
                  onClick={handleStoreOnChain}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Store on Blockchain
                </button>
              )}
              <Link
                to={`/dashboard/disputes/raise?contractId=${contract.id}`}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Raise Dispute
              </Link>
            </div>
          </div>
        )}

        {contract.status === 'DISPUTED' && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Dispute Information</h2>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-red-700">
                This contract is currently under dispute. Please check the dispute details for more information.
              </p>
              <Link
                to={`/dashboard/disputes/${contract.disputes[0]?.id}`}
                className="text-red-600 hover:text-red-800 mt-2 inline-block"
              >
                View Dispute Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractDetail; 