import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { disputeService } from '../../services/disputeService';
import { AuthContext } from '../../context/authContext';

const DisputeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');
  const [voteFor, setVoteFor] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [canResolve, setCanResolve] = useState(false);
  const [evidence, setEvidence] = useState('');
  const [canRespond, setCanRespond] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [isInvolvedParty, setIsInvolvedParty] = useState(false);

  // Get the base path from the current location
  const basePath = location.pathname.includes('employer-dashboard') 
    ? '/employer-dashboard/disputes'
    : '/dashboard/disputes';

  useEffect(() => {
    fetchDispute();
  }, [id]);

  useEffect(() => {
    if (currentUser && dispute) {
      // Check if user can resolve disputes
      const isAdmin = currentUser.role === 'ADMIN';
      const hasRequiredBadge = currentUser.badges?.some(
        badge => badge.tier === 'ACHARYA' || badge.tier === 'GURU'
      );
      setCanResolve(isAdmin || hasRequiredBadge);

      // Check if user is involved in the dispute
      const isInvolved = 
        dispute.contract.studentId === currentUser.id || 
        dispute.contract.employerId === currentUser.id;
      setIsInvolvedParty(isInvolved);

      // Check if user can respond to dispute
      const isOtherParty = 
        (dispute.contract.studentId === currentUser.id && dispute.raisedById === dispute.contract.employerId) ||
        (dispute.contract.employerId === currentUser.id && dispute.raisedById === dispute.contract.studentId);
      
      setCanRespond(
        dispute.status === 'OPEN' && 
        isOtherParty && 
        !dispute.respondedById
      );

      // Check if user has already voted
      const userVote = dispute.votes.find(vote => vote.voterId === currentUser.id);
      if (userVote) {
        setHasVoted(true);
        setUserVote(userVote);
      }
    }
  }, [currentUser, dispute]);

  const fetchDispute = async () => {
    try {
      setLoading(true);
      const response = await disputeService.getDispute(id);
      setDispute(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dispute details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (e) => {
    e.preventDefault();
    try {
      await disputeService.respondToDispute(id, {
        reason: response,
        evidence
      });
      fetchDispute();
      setResponse('');
      setEvidence('');
    } catch (err) {
      console.error('Failed to respond to dispute:', err);
    }
  };

  const handleVote = async () => {
    if (!voteFor) return;
    try {
      await disputeService.castVote({
        disputeId: id,
        votedForId: voteFor
      });
      fetchDispute();
      setVoteFor(null);
    } catch (err) {
      console.error('Failed to cast vote:', err);
    }
  };

  const handleResolve = async () => {
    if (!winnerId) return;
    try {
      await disputeService.resolveDispute(id, { winnerId });
      fetchDispute();
      setWinnerId(null);
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!dispute) return <div className="text-center p-4">Dispute not found</div>;

  const calculateVotePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const totalWeightedVotes = dispute.votes.reduce((sum, vote) => sum + (vote.weight || 1), 0);
  const raisedByVotes = dispute.votes
    .filter(vote => vote.votedForId === dispute.raisedById)
    .reduce((sum, vote) => sum + (vote.weight || 1), 0);
  const respondedByVotes = dispute.votes
    .filter(vote => vote.votedForId === dispute.respondedById)
    .reduce((sum, vote) => sum + (vote.weight || 1), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(basePath)}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Disputes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Dispute for Contract #{dispute.contract.id}
            </h1>
            <div className="text-gray-600">
              Status: <span className="font-semibold">{dispute.status}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Created: {new Date(dispute.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Dispute Details</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium">Raised By:</p>
              <p>{dispute.raisedBy.name}</p>
              <p className="text-gray-600">{dispute.reason}</p>
              <p className="text-sm text-gray-500">Evidence: {dispute.evidence}</p>
            </div>

            {dispute.respondedBy && (
              <div>
                <p className="font-medium">Response from {dispute.respondedBy.name}:</p>
                <p>{dispute.response}</p>
                <p className="text-sm text-gray-500">Evidence: {dispute.evidence}</p>
              </div>
            )}
          </div>
        </div>

        {canRespond && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Respond to Dispute</h2>
            <form onSubmit={handleRespond} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Response</label>
                <textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Evidence</label>
                <textarea
                  value={evidence}
                  onChange={(e) => setEvidence(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Response
              </button>
            </form>
          </div>
        )}

        {dispute.status === 'RESPONDED' && !isInvolvedParty && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Vote on Dispute</h2>
            {hasVoted ? (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-blue-800">
                  You have already voted for {userVote.votedFor.name}
                </p>
                <p className="text-sm text-blue-600">
                  Your vote weight: {userVote.weight}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setVoteFor(dispute.raisedById)}
                    className={`px-4 py-2 rounded ${
                      voteFor === dispute.raisedById
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    Vote for {dispute.raisedBy.name}
                  </button>
                  <button
                    onClick={() => setVoteFor(dispute.respondedById)}
                    className={`px-4 py-2 rounded ${
                      voteFor === dispute.respondedById
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    Vote for {dispute.respondedBy.name}
                  </button>
                </div>
                {voteFor && (
                  <button
                    onClick={handleVote}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Submit Vote
                  </button>
                )}
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Voting Progress</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">
                    {dispute.raisedBy.name}: {calculateVotePercentage(raisedByVotes, totalWeightedVotes)}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${calculateVotePercentage(raisedByVotes, totalWeightedVotes)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {dispute.respondedBy.name}: {calculateVotePercentage(respondedByVotes, totalWeightedVotes)}%
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${calculateVotePercentage(respondedByVotes, totalWeightedVotes)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Total Votes: {dispute.votes.length} (Weighted: {totalWeightedVotes})
              </p>
              {dispute.votes.length >= 5 && (
                <p className="text-sm text-blue-500 mt-2">
                  Auto-resolution will trigger when one party reaches 60% of weighted votes
                </p>
              )}
            </div>
          </div>
        )}

        {dispute.status === 'RESPONDED' && canResolve && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Resolve Dispute</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setWinnerId(dispute.raisedById)}
                  className={`px-4 py-2 rounded ${
                    winnerId === dispute.raisedById
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Select {dispute.raisedBy.name} as Winner
                </button>
                <button
                  onClick={() => setWinnerId(dispute.respondedById)}
                  className={`px-4 py-2 rounded ${
                    winnerId === dispute.respondedById
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Select {dispute.respondedBy.name} as Winner
                </button>
              </div>
              {winnerId && (
                <button
                  onClick={handleResolve}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Resolve Dispute
                </button>
              )}
            </div>
          </div>
        )}

        {dispute.status === 'RESOLVED' && dispute.resolution && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Resolution</h2>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                Dispute resolved in favor of{' '}
                {dispute.resolution.winner.name}
              </p>
              {dispute.resolution.resolver && (
                <p className="text-sm text-green-600">
                  Resolved by: {dispute.resolution.resolver.name}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeDetail; 