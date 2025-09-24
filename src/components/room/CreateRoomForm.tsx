import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoomStore } from '../../hooks/useRoomStore';
import { roomUtils } from '../../utils/room';
import type { CreateRoomRequest } from '../../types';

interface CreateRoomFormProps {
  onCancel?: () => void;
  onSuccess?: (roomCode: string) => void;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createRoom, isLoading, error } = useRoomStore();

  const [formData, setFormData] = useState<CreateRoomRequest>({
    name: '',
    description: '',
    maxParticipants: 10,
    isPublic: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));

    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));

    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = roomUtils.validateCreateRoomRequest(formData);

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach(error => {
        if (error.includes('name')) errorMap.name = error;
        else if (error.includes('description')) errorMap.description = error;
        else if (error.includes('capacity')) errorMap.maxParticipants = error;
      });
      setErrors(errorMap);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !isAuthenticated) {
      setErrors({ general: 'You must be logged in to create a room' });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const room = await createRoom(formData, user.id);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(room.code);
      } else {
        // Navigate to the new room
        navigate(`/room/${room.code}`);
      }
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to create room:', err);
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Room</h2>
          <p className="text-sm text-gray-600 mt-2">
            Set up a new collaborative drawing space
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || errors.general) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {errors.general || error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Room Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.name
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Enter room name"
              disabled={isSubmitting || isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 resize-none ${
                errors.description
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Describe what you'll be drawing together..."
              disabled={isSubmitting || isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
              Max Participants
            </label>
            <select
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleSelectChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-blue-500 focus:ring-blue-500"
              disabled={isSubmitting || isLoading}
            >
              <option value={2}>2 people</option>
              <option value={5}>5 people</option>
              <option value={10}>10 people</option>
              <option value={20}>20 people</option>
              <option value={50}>50 people</option>
            </select>
            {errors.maxParticipants && (
              <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Room Visibility
            </label>
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="isPublic-true"
                  name="isPublic"
                  type="radio"
                  checked={formData.isPublic === true}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSubmitting || isLoading}
                />
                <div className="ml-3">
                  <label htmlFor="isPublic-true" className="text-sm font-medium text-gray-700">
                    Public Room
                  </label>
                  <p className="text-sm text-gray-500">
                    Anyone with the room code can join. Room may appear in public discovery.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="isPublic-false"
                  name="isPublic"
                  type="radio"
                  checked={formData.isPublic === false}
                  onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  disabled={isSubmitting || isLoading}
                />
                <div className="ml-3">
                  <label htmlFor="isPublic-false" className="text-sm font-medium text-gray-700">
                    Private Room
                  </label>
                  <p className="text-sm text-gray-500">
                    Only people you share the room code with can join. More secure and private.
                  </p>
                </div>
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
              disabled={isSubmitting || isLoading || !isAuthenticated}
            >
              {isSubmitting || isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>

        {!isAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              You need to be logged in to create a room.
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

export default CreateRoomForm;