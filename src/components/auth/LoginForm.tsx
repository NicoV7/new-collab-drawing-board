import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authUtils } from '../../utils/auth';
import { validateEmail } from '../../utils/validation';
import type { User } from '../../types';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const { login, loginAsGuest, setLoading, isLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
    }

    // Validate password - for login, we just check if it's provided
    // (we don't enforce complexity on login, only signup)
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Simulate API call - replace with actual authentication API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login response
      const mockUser: User = {
        id: crypto.randomUUID(),
        name: formData.email.split('@')[0],
        isAnonymous: false,
      };

      // Create proper mock token
      const mockToken = authUtils.createMockToken(mockUser);

      login(mockUser, mockToken);
    } catch {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    loginAsGuest();
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full space-y-8 p-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or continue as anonymous user
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter your email"
            disabled={isSubmitting || isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              errors.password
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="Enter your password"
            disabled={isSubmitting || isLoading}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onToggleMode}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;