import { Pill, Droplets, ArrowLeft, Check } from 'lucide-react';

const MEAL_CONFIG = {
  desayuno: { label: 'Desayuno', emoji: '🌅', time: '8:00', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' },
  mediaManana: { label: 'Media Mañana', emoji: '🍎', time: '11:00', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
  comida: { label: 'Comida', emoji: '🍽️', time: '14:00', bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  merienda: { label: 'Merienda', emoji: '🥜', time: '17:30', bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  cena: { label: 'Cena', emoji: '🌙', time: '21:00', bg: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' },
};

const patternLabels = {
  carbs: '🍚 Hidrato Blanco + Proteína',
  legumbres: '🫘 Legumbres',
  verdura: '🥗 Verdura + Proteína',
};

export default function DayDetail({ day, onBack, tracking, onToggleMeal, onToggleMed, profile = {} }) {
  if (!day) return null;

  const dayTracking = tracking[day.date] || {};
  const tratamiento = profile.tratamiento || 'oral';
  const medName = profile.nombre_medicacion || 'Medicación';
  const showMeds = tratamiento !== 'dieta';

  return (
    <div className="animate-fade-in-up">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      {/* Header card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white capitalize">
              {day.dayName} {day.dayNumber}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{day.dateFormatted}</p>
          </div>
          <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold">
            {patternLabels[day.pattern]}
          </span>
        </div>
        {day.comidaHasCarbs && (
          <div className="mt-3 px-3 py-2 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-medium">
            ⚡ Comida con carbohidratos → Cena obligatoria Low Carb
          </div>
        )}
      </div>

      {/* Medication */}
      {showMeds && (
      <div className="grid grid-cols-2 gap-3 mb-5">
        {['desayuno', 'cena'].map((slot) => {
          const taken = dayTracking[`med_${slot}`];
          return (
            <button
              key={slot}
              onClick={() => onToggleMed(day.date, slot)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                taken
                  ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-rose-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                taken ? 'bg-rose-500 text-white' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-500'
              }`}>
                {taken ? <Check size={14} /> : <Pill size={14} />}
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400 uppercase font-bold">{tratamiento === 'insulina' ? '💉 ' : '💊 '}{medName}</p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{slot}</p>
              </div>
            </button>
          );
        })}
      </div>
      )}

      {/* Meals */}
      <div className="space-y-3">
        {Object.entries(day.meals).map(([key, meal]) => {
          const config = MEAL_CONFIG[key];
          const done = dayTracking[key];

          return (
            <button
              key={key}
              onClick={() => onToggleMeal(day.date, key)}
              className={`w-full text-left rounded-xl border p-4 ${config.bg} transition-all hover:shadow-md cursor-pointer ${done ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  done ? 'bg-emerald-500 text-white' : 'bg-white/70 dark:bg-gray-700'
                }`}>
                  {done ? <Check size={18} /> : <span className="text-xl">{config.emoji}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{config.time}</span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{config.label}</span>
                    {meal.synjardy && <span className="text-xs">💊</span>}
                  </div>
                  <p className={`text-base font-medium ${done ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {meal.nombre}
                  </p>
                  {meal.ingredientes && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {meal.ingredientes.map((ing, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white/60 dark:bg-gray-600/50 rounded-full text-[10px] text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Water */}
      <div className="flex items-center justify-center gap-2 mt-5 py-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200 dark:border-sky-800">
        <Droplets size={16} className="text-sky-500" />
        <span className="text-xs font-medium text-sky-700 dark:text-sky-400">💧 Beber agua entre horas — mínimo 2L</span>
      </div>
    </div>
  );
}
