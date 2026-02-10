import { Sparkles, Heart, Shield } from 'lucide-react';

export default function Welcome({ onStart, loading }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in-up text-center px-4">
      {/* Logo */}
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
        <span className="text-4xl">🩺</span>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
        Bienvenida a GlicoHack
      </h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
        Tu plan nutricional personalizado para diabetes MODY 2.
        Menús automáticos de 15 días con rotación inteligente.
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 gap-3 mb-8 w-full max-w-xs">
        {[
          { icon: Sparkles, text: 'Menús auto-generados', color: 'text-amber-500' },
          { icon: Heart, text: 'Adaptado a MODY 2', color: 'text-rose-500' },
          { icon: Shield, text: 'Control de HbA1c', color: 'text-emerald-500' },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700"
          >
            <item.icon size={18} className={item.color} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={loading}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generando...
          </span>
        ) : (
          'Comenzar Planificación'
        )}
      </button>

      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4">
        Synjardy · Desayuno y Cena · No integral
      </p>
    </div>
  );
}
