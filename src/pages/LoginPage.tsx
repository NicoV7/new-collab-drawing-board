import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const LoginPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => {
    setIsSignup(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {isSignup ? (
        <SignupForm onToggleMode={toggleMode} />
      ) : (
        <LoginForm onToggleMode={toggleMode} />
      )}
    </div>
  );
};

export default LoginPage;