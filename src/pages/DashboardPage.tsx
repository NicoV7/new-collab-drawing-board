import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import RoomCard from '../components/room/RoomCard';
import CreateRoomForm from '../components/room/CreateRoomForm';
import JoinRoomForm from '../components/room/JoinRoomForm';
import { useAuth } from '../hooks/useAuth';
import { useRoomStore } from '../hooks/useRoomStore';

type ModalType = 'create' | 'join' | null;

const DashboardPage: React.FC = () => {
  const { user, isAnonymous } = useAuth();
  const { userRooms, recentRooms, loadUserRooms, loadRecentRooms, isLoading, error } = useRoomStore();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Load user's rooms on component mount
  useEffect(() => {
    if (user && !isAnonymous) {
      loadUserRooms(user.id);
      loadRecentRooms(user.id);
    }
  }, [user, isAnonymous, loadUserRooms, loadRecentRooms]);

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleRoomAction = (_roomCode: string) => {
    setActiveModal(null);
    // Navigation is handled by the forms
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              {isAnonymous
                ? "You're browsing as a guest. Create an account to save your drawings and access more features."
                : "Manage your rooms and collaborate with others."
              }
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveModal('create')}
                className="flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                disabled={isAnonymous}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Room
              </button>

              <button
                onClick={() => setActiveModal('join')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Join Room by Code
              </button>
            </div>
          </div>

          {/* My Rooms Section */}
          {!isAnonymous && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Rooms</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading rooms...</p>
                </div>
              ) : userRooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      showActions={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="mt-2 text-lg font-medium text-gray-900">No rooms yet</p>
                  <p className="text-gray-500">Create your first room to start drawing with others</p>
                  <button
                    onClick={() => setActiveModal('create')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Create Room
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Recent Rooms Section */}
          {!isAnonymous && recentRooms.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Rooms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    showActions={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Guest User Upgrade Prompt */}
          {isAnonymous && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 border border-blue-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-medium text-blue-900">
                    Unlock Full Features
                  </h3>
                  <p className="text-blue-700 mt-2">
                    Create an account to save your rooms, access room history, and unlock additional collaboration features.
                  </p>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'create' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCloseModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <CreateRoomForm onCancel={handleCloseModal} onSuccess={handleRoomAction} />
            </div>
          </div>
        </div>
      )}

      {activeModal === 'join' && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={handleCloseModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <JoinRoomForm onCancel={handleCloseModal} onSuccess={handleRoomAction} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;