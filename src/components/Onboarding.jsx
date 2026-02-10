// ================================================
// ONBOARDING — GlicoHack v3
// Perfil inicial del usuario tras registro
// ================================================

import { useState } from 'react';
import { User, Weight, Target, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Onboarding() {
  const { updateProfile } = useAuth();
  const [nombre, setNombre] = useState('');
  const [peso, setPeso] = useState('');
  const [objetivoMin, setObjetivoMin] = useState('70');
  const [objetivoMax, setObjetivoMax] = useState('140');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateProfile({
        nombre: nombre.trim(),
        peso: peso ? parseFloat(peso) : null,
        objetivo_glucosa_min: parseFloat(objetivoMin),
        objetivo_glucosa_max: parseFloat(objetivoMax),
        onboarding_complete: true,
      });
    } catch (err) {
      setError(err.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">¡Bienvenid@!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configura tu perfil para personalizar GlicoHack
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Tu nombre
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Peso */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Peso (kg) — Opcional
              </label>
              <div className="relative">
                <Weight size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ej: 72.5"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Rango de glucosa */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                <Target size={12} className="inline mr-1" />
                Rango objetivo de glucosa (mg/dL)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Mínimo</span>
                  <input
                    type="number"
                    value={objetivoMin}
                    onChange={(e) => setObjetivoMin(e.target.value)}
                    min="50"
                    max="120"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Máximo</span>
                  <input
                    type="number"
                    value={objetivoMax}
                    onChange={(e) => setObjetivoMax(e.target.value)}
                    min="100"
                    max="250"
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                💊 Medicación configurada: <strong>Synjardy</strong> (desayuno y cena)
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="px-3 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
                {error}
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
              ) : (
                <>
                  Comenzar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
