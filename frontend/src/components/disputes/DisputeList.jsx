import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { disputeService } from '../../services/disputeService';
import { AuthContext } from '../../context/authContext';

const DisputeList = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState('my-disputes'); // 'my-disputes' or 'all-disputes'
  const { currentUser } = useContext(AuthContext);

  const fetchDisputes = async () => {
    try {
      const response = await disputeService.getAllDisputes(filter);
      // Ensure we're accessing the data property from the response
      setDisputes(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch disputes');
      setDisputes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESPONDED':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isInvolvedInDispute = (dispute) => {
    return (
      dispute.contract.studentId === currentUser?.id ||
      dispute.contract.employerId === currentUser?.id
    );
  };

  const filteredDisputes = Array.isArray(disputes) ? disputes.filter(dispute => {
    if (activeTab === 'my-disputes') {
      return isInvolvedInDispute(dispute);
    } else {
      return !isInvolvedInDispute(dispute) && dispute.status === 'RESPONDED';
    }
  }) : [];

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!Array.isArray(disputes)) return <div className="text-red-500 p-4">Invalid data format received</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Disputes</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="RESPONDED">Responded</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <Link
            to="/dashboard/disputes/raise"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Raise Dispute
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('my-disputes')}
            className={`${
              activeTab === 'my-disputes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Disputes
          </button>
          <button
            onClick={() => setActiveTab('all-disputes')}
            className={`${
              activeTab === 'all-disputes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Available for Voting
          </button>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Raised By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    Contract #{dispute.contract.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {dispute.contract.job.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{dispute.raisedBy.name}</div>
                  <div className="text-sm text-gray-500">{dispute.raisedBy.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                    {dispute.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {dispute.votes.length} votes
                  </div>
                  {dispute.status === 'RESPONDED' && (
                    <div className="text-sm text-gray-500">
                      Weighted: {dispute.votes.reduce((sum, vote) => sum + (vote.weight || 1), 0)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(dispute.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/dashboard/disputes/${dispute.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {activeTab === 'all-disputes' ? 'View & Vote' : 'View Details'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDisputes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'my-disputes' 
              ? 'You have no disputes'
              : 'No disputes available for voting'}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeList;