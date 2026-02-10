// ================================================
// GLUCOSE MODAL — GlicoHack v3
// Registro rápido de mediciones de glucosa
// ================================================

import { useState } from 'react';
import { X, Droplet, Clock, StickyNote } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

const MOMENTOS = [
  { value: 'ayunas', label: 'En ayunas', emoji: '🌅', time: '~7:00' },
  { value: 'pre_comida', label: 'Pre comida', emoji: '🍽️', time: '~13:30' },
  { value: 'post_comida', label: 'Post comida', emoji: '⏰', time: '~15:30' },
  { value: 'pre_cena', label: 'Pre cena', emoji: '🌙', time: '~20:30' },
  { value: 'post_cena', label: 'Post cena', emoji: '🌜', time: '~22:30' },
  { value: 'nocturno', label: 'Nocturno', emoji: '😴', time: '~3:00' },
];

export default function GlucoseModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [valor, setValor] = useState('');
  const [momento, setMomento] = useState('ayunas');
  const [notas, setNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('glucose_logs')
        .insert({
          user_id: user.id,
          valor: parseFloat(valor),
          momento,
          notas: notas.trim() || null,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setValor('');
        setNotas('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const valorNum = parseFloat(valor);
  const getValorColor = () => {
    if (!valor || isNaN(valorNum)) return '';
    if (valorNum < 70) return 'text-amber-600 dark:text-amber-400';
    if (valorNum <= 140) return 'text-emerald-600 dark:text-emerald-400';
    if (valorNum <= 180) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getValorLabel = () => {
    if (!valor || isNaN(valorNum)) return '';
    if (valorNum < 70) return 'Hipoglucemia';
    if (valorNum <= 140) return 'En rango ✓';
    if (valorNum <= 180) return 'Elevada';
    return 'Alta ⚠️';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 mb-4 sm:mb-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up overflow-hidden">
        {/* Success overlay */}
        {success && (
          <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center text-white">
              <span className="text-5xl block mb-2">✓</span>
              <p className="font-bold text-lg">¡Registrado!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Droplet size={18} className="text-rose-500" />
            <h3 className="font-bold text-gray-900 dark:text-white">Registro de Glucosa</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Valor */}
          <div className="text-center">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Glucosa (mg/dL)
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="120"
              min="20"
              max="600"
              required
              className={`text-center text-4xl font-extrabold w-full py-3 bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 ${getValorColor() || 'text-gray-900 dark:text-white'}`}
              autoFocus
            />
            {valor && (
              <p className={`text-xs font-semibold mt-1 ${getValorColor()}`}>
                {getValorLabel()}
              </p>
            )}
          </div>

          {/* Momento */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              <Clock size={12} />
              Momento
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MOMENTOS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMomento(m.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    momento === m.value
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              <StickyNote size={12} />
              Notas (opcional)
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Ej: Después de ejercicio..."
              rows={2}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !valor}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto block" />
            ) : (
              'Guardar Medición'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
