import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useAuth } from './context/useAuth';
import AuthScreen from './components/AuthScreen';
import OnboardingWizard from './components/OnboardingWizard';
import Header from './components/Header';
import Welcome from './components/Welcome';
import HeroToday from './components/HeroToday';
import DayCard from './components/DayCard';
import DayDetail from './components/DayDetail';
import ShoppingList from './components/ShoppingList';
import GlucoseModal from './components/GlucoseModal';
import GlucoseChart from './components/GlucoseChart';
import {
  generateInitialPlan,
  syncPlan,
  savePlanToSupabase,
  loadPlanFromSupabase,
  clearPlanFromSupabase,
  loadTrackingFromSupabase,
  saveTrackingDayToSupabase,
} from './utils/menuGenerator';

function App() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [plan, setPlan] = useState(null);
  const [tracking, setTracking] = useState({});
  const [view, setView] = useState('home'); // 'home' | 'detail' | 'shopping' | 'glucose'
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [glucoseModalOpen, setGlucoseModalOpen] = useState(false);

  // ---- Boot: Cargar plan de Supabase + Auto-sync Rolling Window ----
  useEffect(() => {
    if (!user || !profile?.onboarding_complete) return;

    const boot = async () => {
      setLoading(true);
      try {
        const saved = await loadPlanFromSupabase(user.id);
        const savedTracking = await loadTrackingFromSupabase(user.id);
        setTracking(savedTracking);

        if (saved && saved.length > 0) {
          const synced = syncPlan(saved, profile);
          setPlan(synced);
          await savePlanToSupabase(user.id, synced);
        }
      } catch (err) {
        console.error('Boot error:', err);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [user, profile?.onboarding_complete]);

  // ---- Acciones ----

  const handleStart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const newPlan = generateInitialPlan(new Date(), profile);
      setPlan(newPlan);
      setTracking({});
      setView('home');
      await savePlanToSupabase(user.id, newPlan);
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  const handleReset = useCallback(async () => {
    if (!user) return;
    if (window.confirm('¿Regenerar todo el plan de 15 días? Se perderá el actual.')) {
      await clearPlanFromSupabase(user.id);
      setPlan(null);
      setTracking({});
      setView('home');
    }
  }, [user]);

  const handleToggleMeal = useCallback(
    async (date, mealKey) => {
      if (!user) return;
      setTracking((prev) => {
        const dayTrack = prev[date] || {};
        const updated = { ...prev, [date]: { ...dayTrack, [mealKey]: !dayTrack[mealKey] } };
        // Save this day's tracking to Supabase
        saveTrackingDayToSupabase(user.id, date, updated[date]);
        return updated;
      });
    },
    [user]
  );

  const handleToggleMed = useCallback(
    async (date, slot) => {
      if (!user) return;
      setTracking((prev) => {
        const dayTrack = prev[date] || {};
        const key = `med_${slot}`;
        const updated = { ...prev, [date]: { ...dayTrack, [key]: !dayTrack[key] } };
        saveTrackingDayToSupabase(user.id, date, updated[date]);
        return updated;
      });
    },
    [user]
  );

  const handleDayClick = useCallback((day) => {
    setSelectedDay(day);
    setView('detail');
  }, []);

  const goHome = useCallback(() => {
    setSelectedDay(null);
    setView('home');
  }, []);

  // ---- Auth Loading ----
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <span className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin inline-block" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  // ---- No Auth → Login Screen ----
  if (!user) {
    return <AuthScreen />;
  }

  // ---- No Profile / Onboarding ----
  if (!profile?.onboarding_complete) {
    return <OnboardingWizard />;
  }

  // ---- Main App ----
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayPlan = plan?.find((d) => d.date === todayStr) || null;
  const upcomingDays = plan?.filter((d) => d.date > todayStr) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header
        hasPlan={!!plan}
        profile={profile}
        onShoppingList={() => setView('shopping')}
        onGlucose={() => setView('glucose')}
        onReset={handleReset}
        onSignOut={signOut}
      />

      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {/* ---- Loading inicial ---- */}
        {loading && !plan && (
          <div className="text-center py-20">
            <span className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin inline-block" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Cargando tu plan...</p>
          </div>
        )}

        {/* ---- ESTADO INICIAL: Sin plan ---- */}
        {!loading && !plan && (
          <Welcome onStart={handleStart} loading={loading} />
        )}

        {/* ---- VISTA: Home (Hoy + Calendario) ---- */}
        {plan && view === 'home' && (
          <>
            {todayPlan && (
              <HeroToday
                day={todayPlan}
                tracking={tracking}
                onToggleMeal={handleToggleMeal}
                onToggleMed={handleToggleMed}
                profile={profile}
              />
            )}

            {upcomingDays.length > 0 && (
              <div className="mt-8 mb-4">
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Próximos Días
                </h3>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {upcomingDays.map((day, i) => (
                <DayCard key={day.id} day={day} onClick={handleDayClick} index={i} />
              ))}
            </div>
          </>
        )}

        {/* ---- VISTA: Detalle ---- */}
        {plan && view === 'detail' && selectedDay && (
          <DayDetail
            day={selectedDay}
            onBack={goHome}
            tracking={tracking}
            onToggleMeal={handleToggleMeal}
            onToggleMed={handleToggleMed}
            profile={profile}
          />
        )}

        {/* ---- VISTA: Lista de la compra ---- */}
        {plan && view === 'shopping' && (
          <ShoppingList plan={plan} onBack={goHome} />
        )}

        {/* ---- VISTA: Glucosa ---- */}
        {view === 'glucose' && (
          <GlucoseChart onBack={goHome} />
        )}
      </main>

      {/* FAB: Registrar glucosa */}
      {user && view !== 'glucose' && (
        <button
          onClick={() => setGlucoseModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-full shadow-xl shadow-rose-500/40 flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 z-40 cursor-pointer"
          title="Registrar glucosa"
        >
          +
        </button>
      )}

      {/* Modal glucosa */}
      <GlucoseModal
        isOpen={glucoseModalOpen}
        onClose={() => setGlucoseModalOpen(false)}
      />

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] text-gray-400 dark:text-gray-600">
        GlicoHack v4.0 — Plan nutricional MODY 2 · Supabase · No sustituye el consejo médico
      </footer>
    </div>
  );
}

export default App;
