import { Pill } from 'lucide-react';

const patternConfig = {
  carbs: { border: 'border-l-amber-400', badge: '🍚', label: 'Arroz/Pasta' },
  legumbres: { border: 'border-l-emerald-400', badge: '🫘', label: 'Legumbres' },
  verdura: { border: 'border-l-sky-400', badge: '🥗', label: 'Verdura' },
};

export default function DayCard({ day, onClick, index }) {
  const config = patternConfig[day.pattern] || patternConfig.verdura;

  return (
    <button
      onClick={() => onClick(day)}
      className={`w-full text-left rounded-2xl border border-gray-100 dark:border-gray-700 border-l-4 ${config.border} bg-white dark:bg-gray-800 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up cursor-pointer`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <p className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
            {day.dayNumber}
          </p>
          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider capitalize">
            {day.dayName}
          </p>
        </div>
        <span className="text-xl" title={config.label}>{config.badge}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px]">🍽️</span>
          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate flex-1">
            {day.meals.comida.nombre}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">🌙</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
            {day.meals.cena.nombre}
          </span>
          <Pill size={10} className="text-rose-400 shrink-0" />
        </div>
      </div>

      {day.comidaHasCarbs && (
        <div className="mt-2 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 rounded text-[9px] font-bold text-amber-600 dark:text-amber-400 inline-block">
          Cena Low Carb ↓
        </div>
      )}
    </button>
  );
}
