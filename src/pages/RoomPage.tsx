import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRoomStore } from '../hooks/useRoomStore';
import { useToast } from '../hooks/useToast';
import { roomUtils } from '../utils/room';

const RoomPage: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { currentRoom, joinRoomByCode, leaveRoom, isLoading, error } = useRoomStore();
  const { showSuccess, showError } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const initializeRoom = async () => {
      if (!roomCode || !user || !isAuthenticated) {
        navigate('/dashboard');
        return;
      }

      // If we don't have the current room or it doesn't match the URL code
      if (!currentRoom || currentRoom.code !== roomCode) {
        setIsJoining(true);
        try {
          await joinRoomByCode(roomCode, {
            code: roomCode,
            userId: user.id,
            username: user.name,
            isAnonymous: user.isAnonymous,
          });
        } catch (err) {
          console.error('Failed to join room:', err);
          // If room doesn't exist or can't join, redirect to dashboard
          navigate('/dashboard');
        } finally {
          setIsJoining(false);
        }
      }
    };

    initializeRoom();
  }, [roomCode, user, isAuthenticated, currentRoom, joinRoomByCode, navigate]);

  const handleShareRoom = async () => {
    if (!currentRoom) return;

    const roomUrl = roomUtils.generateRoomUrl(currentRoom.code);
    try {
      await navigator.clipboard.writeText(roomUrl);
      showSuccess('Room link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy room link:', err);
      showError('Failed to copy room link');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/dashboard');
  };

  // Loading state
  if (isJoining || isLoading || !currentRoom) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {isJoining ? 'Joining room...' : 'Loading room...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const activeParticipants = roomUtils.getActiveParticipantCount(currentRoom);
  const isCreator = user && roomUtils.isRoomCreator(currentRoom, user.id);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{currentRoom.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Room: {currentRoom.code}</span>
                  {isCreator && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Owner
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    currentRoom.isPublic
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-purple-50 text-purple-700 border border-purple-200'
                  }`}>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {currentRoom.isPublic ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      )}
                    </svg>
                    {currentRoom.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span>{activeParticipants} / {currentRoom.maxParticipants}</span>
              </div>

              <button
                onClick={handleShareRoom}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Share Room
              </button>

              <button
                onClick={handleLeaveRoom}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            {/* Tools */}
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-md bg-blue-100 text-blue-700 transition-colors">
                Pen Tool
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                Eraser
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
                Select Tool
              </button>
            </div>

            {/* Colors */}
            <h3 className="text-sm font-medium text-gray-900 mt-6 mb-3">Colors</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                { color: 'bg-black', name: 'Black' },
                { color: 'bg-red-500', name: 'Red' },
                { color: 'bg-blue-500', name: 'Blue' },
                { color: 'bg-green-500', name: 'Green' },
                { color: 'bg-yellow-500', name: 'Yellow' },
                { color: 'bg-purple-500', name: 'Purple' },
                { color: 'bg-orange-500', name: 'Orange' },
                { color: 'bg-pink-500', name: 'Pink' }
              ].map((colorOption) => (
                <button
                  key={colorOption.color}
                  className={`w-8 h-8 rounded-full ${colorOption.color} border-2 border-gray-300 hover:border-gray-400 transition-colors`}
                  title={colorOption.name}
                />
              ))}
            </div>

            {/* Connected Users */}
            <h3 className="text-sm font-medium text-gray-900 mt-6 mb-3">
              Connected Users ({activeParticipants})
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {currentRoom.participants
                .filter(p => p.isActive)
                .map((participant) => (
                  <div key={participant.userId} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>
                      {participant.username}
                      {participant.userId === user?.id && ' (You)'}
                      {roomUtils.isRoomCreator(currentRoom, participant.userId) && ' (Owner)'}
                    </span>
                  </div>
                ))}
            </div>

            {/* Room Info */}
            {currentRoom.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-xs text-gray-600">{currentRoom.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-3 3 3 7-7v3m0-3h-3m3 0l-4-4-4 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Canvas Ready</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start drawing to collaborate with {activeParticipants > 1 ? 'others' : 'room members'}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Drawing functionality will be implemented in Phase 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;