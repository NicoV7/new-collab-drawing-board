import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoomStore } from '../../hooks/useRoomStore';
import { useToast } from '../../hooks/useToast';
import { roomUtils } from '../../utils/room';
import type { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  showActions?: boolean;
  onDelete?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  showActions = true,
  onDelete
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { joinRoom, deleteRoom } = useRoomStore();
  const { showSuccess, showError } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCreator = user && roomUtils.isRoomCreator(room, user.id);
  const activeParticipants = roomUtils.getActiveParticipantCount(room);

  const handleJoinRoom = () => {
    joinRoom(room);
    navigate(`/room/${room.code}`);
  };

  const handleShareRoom = async () => {
    const roomUrl = roomUtils.generateRoomUrl(room.code);

    try {
      await navigator.clipboard.writeText(roomUrl);
      showSuccess('Room link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy room link:', err);
      showError('Failed to copy room link');
    }
  };

  const handleDeleteRoom = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteRoom(room.id, user.id);
      if (onDelete) {
        onDelete(room.id);
      }
    } catch (error) {
      console.error('Failed to delete room:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Room Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {room.name}
          </h3>
          <div className="flex items-center space-x-3 mt-1">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {room.code}
            </span>
            {isCreator && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Owner
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              room.isPublic
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {room.isPublic ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                )}
              </svg>
              {room.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      </div>

      {/* Room Description */}
      {room.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {room.description}
        </p>
      )}

      {/* Room Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            {activeParticipants} / {room.maxParticipants}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {roomUtils.formatCreatedDate(room.createdAt)}
          </span>
        </div>

        {room.isActive ? (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Inactive
          </span>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <button
            onClick={handleJoinRoom}
            className="flex-1 py-2 px-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Join Room
          </button>

          <button
            onClick={handleShareRoom}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            title="Copy room link"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>

          {isCreator && (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  title="Delete room"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              ) : (
                <div className="flex space-x-1">
                  <button
                    onClick={handleDeleteRoom}
                    disabled={isDeleting}
                    className="px-2 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none disabled:opacity-50"
                  >
                    {isDeleting ? '...' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-2 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none"
                  >
                    No
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomCard;