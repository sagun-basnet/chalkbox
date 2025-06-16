import React, { useState, useEffect } from 'react';
import { disputeService } from '../../services/disputeService';

const TokenRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRewards, setTotalRewards] = useState(0);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      // Get current user's ID from localStorage or context
      const userId = localStorage.getItem('userId');
      const response = await disputeService.getUserRewards(userId);
      setRewards(response.data);
      
      // Calculate total rewards
      const total = response.data.reduce((sum, reward) => sum + reward.amount, 0);
      setTotalRewards(total);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch rewards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Token Rewards</h1>
          <div className="text-lg text-gray-600">
            Total Rewards: <span className="font-semibold">{totalRewards} tokens</span>
          </div>
        </div>

        <div className="space-y-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="border rounded p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{reward.reason}</h3>
                  {reward.dispute && (
                    <p className="text-sm text-gray-600 mt-1">
                      Dispute ID: {reward.dispute.id}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    +{reward.amount} tokens
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(reward.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rewards.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No rewards earned yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenRewards; 