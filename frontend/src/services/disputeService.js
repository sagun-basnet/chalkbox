import { get, post } from '../utils/api';

export const disputeService = {
  // Get all disputes
  getAllDisputes: (status) => get(`/api/disputes${status ? `?status=${status}` : ''}`),
  
  // Get single dispute
  getDispute: (id) => get(`/api/disputes/${id}`),
  
  // Raise dispute
  raiseDispute: (data) => post('/api/disputes', data),
  
  // Respond to dispute
  respondToDispute: (id, data) => post(`/api/disputes/${id}/respond`, data),
  
  // Cast vote
  castVote: (data) => post('/api/disputes/vote', data),
  
  // Resolve dispute
  resolveDispute: (id, data) => post(`/api/disputes/${id}/resolve`, data),
  
  // Get user rewards
  getUserRewards: (userId) => get(`/api/disputes/rewards/${userId}`),

  // Get user's voting power
  getUserVotingPower: async (userId) => {
    try {
      const response = await get(`/api/disputes/voting-power/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch voting power:', error);
      return { weight: 1, canVote: false };
    }
  }
}; 