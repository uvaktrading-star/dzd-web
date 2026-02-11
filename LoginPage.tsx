
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, Headphones, X } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export default function LoginPage({ onLogin, onClose, onSwitchToSignup }: { onLogin: (u: any) => void, onClose: () => void, onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      onLogin({ 
        uid: userCredential.user.uid, 
        email: userCredential.user.email, 
        ...(userDoc.exists() ? userDoc.data() : { name: email.split('@')[0] }) 
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      onLogin({ 
        uid: result.user.uid, 
        email: result.user.email, 
        ...(userDoc.exists() ? userDoc.data() : { name: result.user.displayName }) 
      });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotClick = () => {
    onClose();
    navigate('/forgot');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto no-scrollbar bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Background Overlay Click to Close */}
      <div className="fixed inset-0 cursor-pointer -z-10" onClick={onClose} />
      
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-3xl animate-scale-in border border-white/5 bg-[#050b1a] relative z-10 transition-all">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Left Side: Branding (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 p-16 flex-col justify-center overflow-hidden lg:rounded-l-[2rem] lg:md:rounded-l-[2.5rem]">
          <div className="absolute inset-0 opacity-10 mesh-bg">
            <div className="blob top-0 left-0 bg-white"></div>
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Next Gen Marketing</span>
            </div>
            <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none">
              DzD <br /><span className="text-blue-300">Marketing</span>
            </h1>
            <p className="text-blue-100 text-lg font-medium mb-12 opacity-80 max-w-sm">
              Empowering Your Social Growth with advanced SMM solutions and real-time analytics.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                <ShieldCheck className="text-blue-300 mb-3" size={24} />
                <h3 className="text-white text-xl font-black">99.9%</h3>
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest opacity-60">Uptime</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl">
                <Headphones className="text-blue-300 mb-3" size={24} />
                <h3 className="text-white text-xl font-black">24/7</h3>
                <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest opacity-60">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-[#050b1a] p-8 md:p-12 lg:p-20 flex flex-col justify-center lg:rounded-r-[2rem] lg:md:rounded-r-[2.5rem]">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h2>
              <p className="text-slate-400 font-medium text-sm">Log in to your command center.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account ID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    required 
                    type="text" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full bg-[#0a1121] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-blue-600 outline-none transition-all font-medium text-sm" 
                    placeholder="Username or Email" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</label>
                  <button 
                    type="button" 
                    onClick={handleForgotClick}
                    className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full bg-[#0a1121] border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:border-blue-600 outline-none transition-all font-medium text-sm" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 select-none group cursor-pointer" onClick={() => {}}>
                <div className="w-5 h-5 rounded border border-white/10 bg-slate-900 flex items-center justify-center transition-all group-hover:border-blue-600">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm opacity-0 group-active:opacity-100 transition-opacity"></div>
                </div>
                <label className="text-xs text-slate-400 font-medium cursor-pointer">Remember me for 30 days</label>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <span className="relative bg-[#050b1a] px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Connect with</span>
            </div>

            <button 
              onClick={handleGoogleLogin} 
              className="mt-6 w-full bg-[#0a1121] border border-white/5 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white hover:bg-[#0f172a] transition-all group text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <p className="mt-8 text-center text-slate-400 font-medium text-sm">
              New here? <button onClick={onSwitchToSignup} className="text-blue-500 font-black ml-1 hover:underline">Create Account</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
