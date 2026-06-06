import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-100/40 blur-3xl"></div>
        <div className="absolute -bottom-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-cyan-100/40 blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 glass-panel p-10 sm:p-12 rounded-3xl relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">
            Sign in to continue your premium shopping experience
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl text-sm text-center shadow-sm">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-300 sm:text-sm shadow-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-300 sm:text-sm shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-end text-sm">
            <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Forgot your password?
            </Link>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="premium-button w-full text-base py-3"
            >
             Sign In
            </button>
          </div>
          
          <div className="text-center text-sm pt-4 border-t border-slate-100 mt-6">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors ml-1">
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
