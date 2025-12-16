import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { registerUser } from '../utils/api';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const { data, error: apiError } = await registerUser({
        name,
        email,
        password,
      });

      if (apiError) {
        setError(apiError);
        setIsLoading(false);
        return;
      }

      // Registration successful
      setSuccess(true);
      setIsLoading(false);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');

      // Optionally switch to login after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-teal-600"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm-1 2v8h4v-2h-2V6h-2z" />
            </svg>
            <span className="text-2xl font-bold text-gray-900">PickBazar</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">Registration successful! Redirecting to login...</p>
          </div>
        )}

        {/* Terms and Policy Text */}
        <p className="text-center text-sm text-gray-600 mb-6">
          By signing up, you agree to our{' '}
          <a
            href="#"
            className="text-teal-600 hover:text-teal-700 underline"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement terms link
            }}
          >
            terms
          </a>
          {' '}and{' '}
          <a
            href="#"
            className="text-teal-600 hover:text-teal-700 underline"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implement policy link
            }}
          >
            policy
          </a>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="#"
              className="text-teal-600 hover:text-teal-700 font-medium"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;

