import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Building2, Phone, Briefcase, CheckCircle2 } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', company: '', phone: '', role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) onLoginSuccess(data.user);
      else setError(data.message || 'Authentication failed');
    } catch (err) {
      setError('Connection failed. Please check your server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-100">
      
      {/* LEFT SIDE: AUTH FORM */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32">
        <div className="max-w-md w-full mx-auto">
          {/* Logo Area */}
          <div className="mb-10 flex items-center gap-2 group cursor-default">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <div className="w-5 h-5 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">SaaSly</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Get started for free'}
            </h1>
            <p className="text-slate-500 mt-2">
              {isLogin ? 'Enter your credentials to access your account.' : 'Join thousands of teams managing projects today.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-3 animate-shake">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="Aditya Bawankule" required={!isLogin} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Company</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all" placeholder="Acme Inc" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 ml-1">Role</label>
                  <input name="role" value={formData.role} onChange={handleInputChange} className="w-full mt-1.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all" placeholder="CEO" />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="name@company.com" required />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                {isLogin && <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</button>}
              </div>
              <div className="relative mt-1.5">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? 'Sign in to Dashboard' : 'Create your account'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="ml-2 font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all">
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: BRANDING PANEL */}
      
      <div className="hidden lg:flex flex-1 bg-[#0F172A] relative overflow-hidden items-center justify-center">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="relative z-10 px-16 xl:px-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              New Feature: Automation 2.0
            </div>
            
            <h2 className="text-5xl font-bold text-white leading-tight tracking-tight">
              Supercharge your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">workflow efficiency.</span>
            </h2>

            <ul className="space-y-4">
              {[
                'Real-time project tracking',
                'Advanced team collaboration',
                'Automated client reporting'
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-10 border-t border-slate-800">
              <p className="text-slate-400 italic text-lg leading-relaxed">
                "SaaSly has completely transformed how we handle our development cycles. It's clean, fast, and incredibly intuitive."
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-[2px]">
                   <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center font-bold text-white">RB</div>
                </div>
                <div>
                  <p className="text-white font-bold">Rohit Mehra</p>
                  <p className="text-slate-500 text-sm">Product Manager at FlowState</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}