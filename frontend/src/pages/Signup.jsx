import { useState, useContext } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [error, setError] = useState('');
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Please verify that you are not a robot');
      return;
    }
    try {
      await signup(name, email, password, captchaToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] rounded-full bg-cyan-100/40 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-3xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 glass-panel p-10 sm:p-12 rounded-3xl relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">
            Join us and start your premium shopping journey
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-200 bg-white/50 backdrop-blur-sm placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-300 sm:text-sm shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
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

          <div className="flex justify-center w-full py-2">
            <ReCAPTCHA
              sitekey="6Le78w8tAAAAAGEZUrQyqPiNxbUm2Fitwh75Lxsp"
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="premium-button w-full text-base py-3"
            >
              Sign Up
            </button>
          </div>
          
          <div className="text-center text-sm pt-4 border-t border-slate-100 mt-6">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors ml-1">
              Sign in instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
