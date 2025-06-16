import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from '../../utils/api';
import { FileText, Clock, CheckCircle, AlertCircle, Scale, AlertTriangle } from 'lucide-react';

const ContractList = ({ status }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, [status]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await get(`/api/contracts${status ? `?status=${status.toUpperCase()}` : ''}`);
      setContracts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contracts');
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <div className="flex gap-4">
          <select
            value={status || ''}
            onChange={(e) => {
              const newStatus = e.target.value;
              window.location.href = `/dashboard/contracts${newStatus ? `/${newStatus}` : ''}`;
            }}
            className="border rounded p-2"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="block p-4 border rounded hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/dashboard/contracts/${contract.id}`} className="hover:text-blue-600">
                  <h2 className="text-lg font-semibold">
                    {contract.job.title}
                  </h2>
                </Link>
                <p className="text-gray-600 mt-1">
                  {contract.employer.name} - {contract.student.name}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                  Created: {new Date(contract.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusBadgeClass(
                    contract.status
                  )}`}
                >
                  {getStatusIcon(contract.status)}
                  {contract.status}
                </span>
                {contract.status === 'ACTIVE' && (
                  <Link
                    to={`/dashboard/disputes/raise?contractId=${contract.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Raise Issue
                  </Link>
                )}
              </div>
            </div>
            {contract.blockchainHash && (
              <div className="mt-2 text-sm text-gray-500">
                <span className="font-mono">{contract.blockchainHash}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractList; 