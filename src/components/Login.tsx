// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { LogIn } from 'lucide-react';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { signIn, signUp } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (isSignUp) {
//         await signUp(email, password);
//       } else {
//         await signIn(email, password);
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         <div className="flex items-center justify-center mb-8">
//           <div className="bg-blue-600 p-3 rounded-full">
//             <LogIn className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
//           Welcome to Rideinfo
//         </h1>
//         <p className="text-gray-600 text-center mb-8">
//           {isSignUp ? 'Create your account' : 'Sign in to continue'}
//         </p>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//               placeholder="Enter your password"
//               required
//               minLength={6}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
//           </button>
//         </form>

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => {
//               setIsSignUp(!isSignUp);
//               setError('');
//             }}
//             className="text-blue-600 hover:text-blue-700 font-medium"
//           >
//             {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState } from 'react';
// import { LogIn } from 'lucide-react';
// import { login } from '../api/axiosInstance.js'; // import the login API method

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [userType, setUserType] = useState('ADMIN');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');
//     setLoading(true);

//     try {
//       const data = await login(username, password, userType);
//       console.log('Login success:', data);

//       if (data?.token) {
//         localStorage.setItem('token', data.token);
//       }

//       setMessage('Login successful ✅');
//     } catch (err) {
//       setError('Invalid credentials or server error ❌');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         <div className="flex items-center justify-center mb-8">
//           <div className="bg-blue-600 p-3 rounded-full">  
//             <LogIn className="w-8 h-8 text-white" />
//           </div>
//         </div>

//         <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
//           Welcome to Rideinfo
//         </h1>
//         <p className="text-gray-600 text-center mb-8">Sign in to continue</p>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//               placeholder="Enter your username"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="userType"
//               className="block text-sm font-medium text-gray-700 mb-2"
//             >
//               User Type
//             </label>
//             <select
//               id="userType"
//               value={userType}
//               onChange={(e) => setUserType(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//             >
//               <option value="ADMIN">ADMIN</option>
//               <option value="DRIVER">DRIVER</option>
//               <option value="INSTITUTE">INSTITUTE</option>
//             </select>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Processing...' : 'Sign In'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';

export default function Login() {
  const { login } = useAuth(); // from AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('ADMIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call your login API
      const response = await axiosInstance.post('/auth/login/', {
        username,
        password,
        user_type: userType,
      });

      const data = response.data;
      console.log('Login success:', data);

      if (data.access && data.refresh) {
        // Save tokens in localStorage
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);

        // Save user info in context
        login({
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          user_type: data.user_type,
        });
      } else {
        setError('No token received from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Invalid credentials or server error ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome to Rideinfo
        </h1>
        <p className="text-gray-600 text-center mb-8">Sign in to continue</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="DRIVER">DRIVER</option>
              <option value="INSTITUTE">INSTITUTE</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
