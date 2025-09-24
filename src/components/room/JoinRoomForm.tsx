import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoomStore } from '../../hooks/useRoomStore';
import { roomUtils } from '../../utils/room';
import type { JoinRoomRequest } from '../../types';

interface JoinRoomFormProps {
  onCancel?: () => void;
  onSuccess?: (roomCode: string) => void;
  initialRoomCode?: string;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({
  onCancel,
  onSuccess,
  initialRoomCode = ''
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { joinRoomByCode, isLoading, error } = useRoomStore();

  const [roomCode, setRoomCode] = useState(initialRoomCode.toUpperCase());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setRoomCode(value);
      if (errors.roomCode) {
        setErrors(prev => ({ ...prev, roomCode: '' }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!roomCode.trim()) {
      newErrors.roomCode = 'Room code is required';
    } else if (!roomUtils.isValidRoomCode(roomCode)) {
      newErrors.roomCode = 'Room code must be 6 characters (letters and numbers)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user) {
      setErrors({ general: 'Authentication required to join room' });
      return;
    }

    setIsSubmitting(true);

    try {
      const joinRequest: JoinRoomRequest = {
        code: roomCode,
        userId: user.id,
        username: user.name,
        isAnonymous: user.isAnonymous,
      };

      const room = await joinRoomByCode(roomCode, joinRequest);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(room.code);
      } else {
        // Navigate to the room
        navigate(`/room/${room.code}`);
      }
    } catch (err) {
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.message.includes('not found')) {
          setErrors({ roomCode: 'Room not found. Please check the code.' });
        } else if (err.message.includes('full')) {
          setErrors({ general: 'This room is full. Try again later.' });
        } else {
          setErrors({ general: err.message });
        }
      } else {
        setErrors({ general: 'Failed to join room. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Join Room</h2>
          <p className="text-sm text-gray-600 mt-2">
            Enter a room code to join a collaborative drawing session
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || errors.general) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general || error}
            </div>
          )}

          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700">
              Room Code
            </label>
            <div className="mt-1">
              <input
                id="roomCode"
                name="roomCode"
                type="text"
                value={roomCode}
                onChange={handleRoomCodeChange}
                className={`block w-full px-3 py-3 border rounded-md shadow-sm text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  errors.roomCode
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="ABC123"
                disabled={isSubmitting || isLoading}
                autoComplete="off"
              />
              <div className="mt-2 flex justify-center">
                <div className="flex space-x-1">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 border-2 rounded flex items-center justify-center text-sm font-mono ${
                        i < roomCode.length
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {roomCode[i] || ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {errors.roomCode && (
              <p className="mt-2 text-sm text-red-600">{errors.roomCode}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Room codes are 6 characters
                </h3>
                <p className="text-xs text-blue-700 mt-1">
                  Ask the room creator to share their room code with you
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || isLoading || !user || roomCode.length !== 6}
            >
              {isSubmitting || isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </form>

        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              You need to be logged in to join a room.
              <a href="/login" className="font-medium underline hover:text-yellow-800 ml-1">
                Sign in here
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinRoomForm;