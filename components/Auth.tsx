import React, { useState } from 'react';
import { User } from '../types';
import { login, signup } from '../services/db';
import { ArrowRight, BookOpen, Mail, Lock, User as UserIcon } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user;
      if (isLogin) {
        user = await login(formData.email, formData.password);
      } else {
        if (!formData.name) throw new Error("Please tell us your name!");
        user = await signup(formData.name, formData.email, formData.password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 animate-fade-in relative">
        {/* Shine effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        
      <div className="bg-gradient-to-br from-kid-blue to-cyan-400 p-8 text-center relative overflow-hidden">
        <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-md w-16 h-16 rounded-2xl rotate-3 flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/30">
                <BookOpen className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-comic font-bold text-white mb-1 shadow-sm">
            {isLogin ? 'Welcome Back!' : 'Join the Club!'}
            </h2>
            <p className="text-blue-50 font-medium text-sm opacity-90">
            {isLogin ? 'Ready to learn something new today?' : 'Create your free student account'}
            </p>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center border border-red-100 flex items-center justify-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {!isLogin && (
          <div className="group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">My Name</label>
            <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-kid-blue transition-colors" />
                <input
                type="text"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-kid-blue focus:outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                placeholder="e.g. Alex"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
          </div>
        )}

        <div className="group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
            <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-kid-blue transition-colors" />
                <input
                type="email"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-kid-blue focus:outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                placeholder="alex@school.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>
        </div>

        <div className="group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Password</label>
            <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-kid-blue transition-colors" />
                <input
                type="password"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-kid-blue focus:outline-none transition-all font-medium text-gray-700 placeholder-gray-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-kid-yellow to-yellow-400 text-yellow-900 font-bold font-comic text-xl py-3.5 rounded-xl shadow-lg shadow-yellow-200 hover:shadow-xl hover:shadow-yellow-200/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-4 active:translate-y-0 active:shadow-md"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-900"></span>
          ) : (
            <>
              {isLogin ? 'Log In' : 'Sign Up'} <ArrowRight size={20} />
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-gray-500 hover:text-kid-purple font-semibold text-sm transition-colors hover:underline decoration-2 underline-offset-4"
          >
            {isLogin ? "New here? Create Account" : "Already have an account? Log In"}
          </button>
        </div>
      </form>
    </div>
  );
};