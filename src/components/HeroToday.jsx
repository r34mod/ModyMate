import { Pill, Check, Droplets, ChevronRight, Flame } from 'lucide-react';

const MEAL_SLOTS = [
  { key: 'desayuno', label: 'Desayuno', emoji: '🌅', time: '8:00' },
  { key: 'mediaManana', label: 'Media Mañana', emoji: '🍎', time: '11:00' },
  { key: 'comida', label: 'Comida', emoji: '🍽️', time: '14:00' },
  { key: 'merienda', label: 'Merienda', emoji: '🥜', time: '17:30' },
  { key: 'cena', label: 'Cena', emoji: '🌙', time: '21:00' },
];

export default function HeroToday({ day, tracking, onToggleMeal, onToggleMed }) {
  if (!day) return null;

  const todayTracking = tracking[day.date] || {};
  const completedMeals = MEAL_SLOTS.filter((s) => todayTracking[s.key]).length;
  const progress = (completedMeals / MEAL_SLOTS.length) * 100;

  return (
    <div className="animate-fade-in-up">
      {/* Date header */}
      <div className="text-center mb-4 pt-2">
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Hoy</p>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize">
          {day.dayName}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{day.dateFormatted}</p>
      </div>

      {/* Progress bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Progreso del día</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{completedMeals}/{MEAL_SLOTS.length}</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Medication reminders */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {['desayuno', 'cena'].map((slot) => {
          const taken = todayTracking[`med_${slot}`];
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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                taken ? 'bg-rose-500 text-white' : 'bg-rose-100 dark:bg-rose-900/50 text-rose-500'
              }`}>
                {taken ? <Check size={16} /> : <Pill size={16} />}
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-semibold">Synjardy</p>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200 capitalize">{slot}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Meals list */}
      <div className="space-y-2.5">
        {MEAL_SLOTS.map((slot) => {
          const meal = day.meals[slot.key];
          const done = todayTracking[slot.key];

          return (
            <button
              key={slot.key}
              onClick={() => onToggleMeal(day.date, slot.key)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                done
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-emerald-200 hover:shadow-md'
              }`}
            >
              {/* Check circle */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                done
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                {done ? <Check size={16} /> : <span className="text-lg">{slot.emoji}</span>}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{slot.time}</span>
                  <span className={`text-xs font-semibold ${
                    done ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
                  }`}>{slot.label}</span>
                  {meal.synjardy && (
                    <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded text-[9px] font-bold">💊</span>
                  )}
                </div>
                <p className={`text-sm font-medium truncate mt-0.5 ${
                  done ? 'text-emerald-800 dark:text-emerald-300 line-through opacity-70' : 'text-gray-800 dark:text-gray-200'
                }`}>
                  {meal.nombre}
                </p>
              </div>

              <ChevronRight size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Water reminder */}
      <div className="flex items-center justify-center gap-2 mt-4 py-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-200 dark:border-sky-800">
        <Droplets size={16} className="text-sky-500" />
        <span className="text-xs font-medium text-sky-700 dark:text-sky-400">
          Recuerda beber agua entre horas — mínimo 2L/día
        </span>
      </div>
    </div>
  );
}
