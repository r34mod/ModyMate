// ================================================
// LOGIN / REGISTER — GlicoHack v3
// ================================================

import { useState } from 'react';
import { Activity, Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar el registro.');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      const msg = err.message || 'Error inesperado';
      if (msg.includes('Invalid login')) setError('Email o contraseña incorrectos');
      else if (msg.includes('already registered')) setError('Este email ya está registrado');
      else if (msg.includes('Password should')) setError('La contraseña debe tener al menos 6 caracteres');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <Activity size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">GlicoHack</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Plan Nutricional MODY 2</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? 'bg-white dark:bg-gray-600 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-white dark:bg-gray-600 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error/Success */}
            {error && (
              <div className="px-3 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all duration-300 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={16} />
                  Iniciar Sesión
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 mt-6">
          GlicoHack v3.0 · Tus datos están protegidos con Supabase
        </p>
      </div>
    </div>
  );
}
