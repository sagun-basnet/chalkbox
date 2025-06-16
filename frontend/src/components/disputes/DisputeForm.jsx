import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { disputeService } from '../../services/disputeService';

const DisputeForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    contractId: '',
    reason: '',
    evidence: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const contractId = searchParams.get('contractId');
    if (contractId) {
      setFormData(prev => ({
        ...prev,
        contractId
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await disputeService.raiseDispute(formData);
      navigate('/dashboard/disputes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to raise dispute');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/disputes')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Disputes
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Raise a Dispute</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="contractId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contract ID
            </label>
            <input
              type="text"
              id="contractId"
              name="contractId"
              value={formData.contractId}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              readOnly={!!searchParams.get('contractId')}
            />
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Reason for Dispute
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide a detailed reason for raising this dispute..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="evidence"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Evidence
            </label>
            <textarea
              id="evidence"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide evidence to support your dispute..."
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/dashboard/disputes')}
              className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading ? 'Submitting...' : 'Raise Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DisputeForm; 