import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser } from '../utils/api';
import { setCookie, getCookie } from '../utils/cookies';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀🚀🚀 LOGIN FORM SUBMITTED 🚀🚀🚀');
    setError('');
    setIsLoading(true);

    console.log('🚀 ========== LOGIN STARTED ==========');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Calling loginUser API...');
    
    // Alert to ensure we see this
    console.warn('⚠️ LOGIN STARTING - CHECK CONSOLE FOR LOGS');

    try {
      console.log('⏳ Waiting for login response...');
      const { data, error: apiError, headers, token: responseToken } = await loginUser({
        email,
        password,
      });

      console.log('✅ Login API call completed');
      console.log('Response data:', data);
      console.log('Response error:', apiError);
      console.log('Response headers:', headers);
      console.log('Response token:', responseToken);

      if (apiError) {
        console.error('❌ Login API Error:', apiError);
        setError(apiError);
        setIsLoading(false);
        return;
      }

      // Store user info and check for token
      console.log('🔍 ========== LOGIN RESPONSE DEBUG ==========');
      console.log('Full API response data:', JSON.stringify(data, null, 2));
      console.log('Response headers:', headers);
      console.log('Token from apiRequest:', responseToken);
      console.log('All response keys:', Object.keys(data || {}));
      
      // Check if login was successful
      if (data?.success) {
        // Store user info if available (some APIs don't return user in login response)
        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('✅ User info saved to localStorage:', data.user);
        }
        localStorage.setItem('isLoggedIn', 'true');
        
        // Check for token in multiple places with detailed logging
        let token = null;
        
        // 1. Check responseToken from loginUser function (already extracted)
        if (responseToken) {
          token = responseToken;
          console.log('✅ Token found in loginUser return:', responseToken.substring(0, 20) + '...');
        }
        
        // 2. Check response body - various possible locations (backup check)
        if (!token && data?.token) {
          token = data.token;
          console.log('✅ Token found in data.token:', token.substring(0, 20) + '...');
        }
        if (!token && data?.data?.token) {
          token = data.data.token;
          console.log('✅ Token found in data.data.token:', token.substring(0, 20) + '...');
        }
        if (!token && data?.access_token) {
          token = data.access_token;
          console.log('✅ Token found in data.access_token:', token.substring(0, 20) + '...');
        }
        if (!token && data?.accessToken) {
          token = data.accessToken;
          console.log('✅ Token found in data.accessToken:', token.substring(0, 20) + '...');
        }
        if (!token && data?.auth?.token) {
          token = data.auth.token;
          console.log('✅ Token found in data.auth.token:', token.substring(0, 20) + '...');
        }
        if (!token && data?.user?.token) {
          token = data.user.token;
          console.log('✅ Token found in data.user.token:', token.substring(0, 20) + '...');
        }
        
        // 3. Check response headers
        if (!token && headers) {
          const headerKeys = Object.keys(headers);
          console.log('Available header keys:', headerKeys);
          
          for (const key of headerKeys) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('token') || lowerKey.includes('auth')) {
              console.log(`Checking header ${key}:`, headers[key]);
              if (headers[key] && !token) {
                token = headers[key].replace(/^Bearer\s+/i, '');
                console.log(`✅ Token found in header ${key}:`, token.substring(0, 20) + '...');
                break;
              }
            }
          }
        }
        
        // 4. Check cookie (set by backend via Set-Cookie header)
        if (!token) {
          // Wait a bit for cookie to be set by browser
          await new Promise(resolve => setTimeout(resolve, 500));
          const cookieToken = getCookie('token');
          console.log('Token from cookie (set by backend):', cookieToken ? 'exists' : 'null');
          console.log('All cookies:', document.cookie);
          
          // Also try manual extraction from document.cookie
          if (!cookieToken && document.cookie.includes('token=')) {
            const tokenMatch = document.cookie.match(/token=([^;]+)/);
            if (tokenMatch && tokenMatch[1]) {
              token = tokenMatch[1];
              console.log('✅ Token extracted manually from document.cookie:', token.substring(0, 20) + '...');
            }
          } else if (cookieToken) {
            token = cookieToken;
            console.log('✅ Token found in cookie:', token.substring(0, 20) + '...');
          }
        }
        
        // Store token in localStorage for API requests (backup and easier access)
        if (token) {
          localStorage.setItem('token', token);
          console.log('✅✅✅ Token stored in localStorage successfully!');
          console.log('Token preview:', token.substring(0, 30) + '...');
          console.log('Full token length:', token.length);
          
          // Verify it was stored
          const verify = localStorage.getItem('token');
          if (verify === token) {
            console.log('✅ Token storage verified!');
          } else {
            console.error('❌ Token storage verification failed!');
          }
        } else {
          console.error('❌❌❌ No token found anywhere!');
          console.error('Checked locations:', {
            responseToken: responseToken ? 'found' : 'null',
            'data.token': data?.token ? 'found' : 'null',
            'data.data.token': data?.data?.token ? 'found' : 'null',
            'data.access_token': data?.access_token ? 'found' : 'null',
            'data.accessToken': data?.accessToken ? 'found' : 'null',
            headers: headers ? 'exists' : 'null',
            cookie: getCookie('token') ? 'found' : 'null',
            allCookies: document.cookie,
            manualExtraction: document.cookie.includes('token=') ? 'possible' : 'not found'
          });
          console.error('Please check the Network tab in DevTools to see the actual login response!');
          
          // Last resort: try to extract from document.cookie manually
          if (document.cookie.includes('token=')) {
            const tokenMatch = document.cookie.match(/token=([^;]+)/);
            if (tokenMatch && tokenMatch[1]) {
              const lastResortToken = tokenMatch[1];
              localStorage.setItem('token', lastResortToken);
              console.log('✅✅✅ Last resort: Token extracted and stored from document.cookie!');
            }
          }
        }
        console.log('🔍 ==========================================');
      } else {
        console.error('❌ Invalid API response!', data);
        console.log('🔍 ==========================================');
      }

      // Notify parent component about successful login
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Close modal
      onClose();

      // Check user role and redirect
      // Get user role from response or stored user (fallback)
      const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      const userRole = (data?.user?.role || data?.role || storedUser?.role || '').toLowerCase();
      console.log('User role from API:', data?.user?.role || data?.role || storedUser?.role, 'Normalized:', userRole);
      
      // Final verification before redirect
      const finalCheck = getCookie('token');
      const finalCheckLocalStorage = localStorage.getItem('token');
      console.log('Final check before redirect - Cookie Token:', finalCheck ? 'exists' : 'null');
      console.log('Final check before redirect - LocalStorage Token:', finalCheckLocalStorage ? 'exists' : 'null');
      console.log('All cookies before redirect:', document.cookie);
      
      // Wait a moment to ensure all logs are visible
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (userRole === 'admin') {
        // Redirect to admin dashboard
        console.log('🔄 Redirecting to admin dashboard...');
        window.location.href = '/admin/dashboard';
      } else {
        // Redirect to home page
        console.log('🔄 Redirecting to home page...');
        window.location.href = '/';
      }
    } catch (err) {
      console.error('❌❌❌ LOGIN ERROR CAUGHT:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('Full error object:', err);
      setError(err.message || 'Login failed. Please try again.');
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

        {/* Heading */}
        <h2 className="text-center text-gray-600 mb-6 text-lg">
          Login with your email & password
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <a
                href="#"
                className="text-sm text-teal-600 hover:text-teal-700"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Implement forgot password
                }}
              >
                Forgot password?
              </a>
            </div>
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

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Create New Account Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="#"
              className="text-teal-600 hover:text-teal-700 font-medium"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToRegister();
              }}
            >
              Create new account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

