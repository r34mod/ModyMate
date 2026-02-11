// ================================================
// PROFILE — GlicoHack v4
// IMC · Gráfica Peso · Coach Virtual · Editar Datos
// ================================================

import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Scale,
  TrendingUp,
  HeartPulse,
  Save,
  Loader2,
  Ruler,
  User,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from 'recharts';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

// ─── Helpers ────────────────────────────────────────
function calcIMC(peso, alturaCm) {
  if (!peso || !alturaCm || alturaCm <= 0) return null;
  const alturaM = alturaCm / 100;
  return +(peso / (alturaM * alturaM)).toFixed(1);
}

function imcCategory(imc) {
  if (imc === null) return null;
  if (imc < 18.5) return { label: 'Bajo Peso', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-400', gradient: 'from-blue-500 to-blue-600', emoji: '🔵' };
  if (imc < 25)   return { label: 'Saludable', color: 'green', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-400', gradient: 'from-emerald-500 to-emerald-600', emoji: '🟢' };
  if (imc < 30)   return { label: 'Sobrepeso', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-400', gradient: 'from-orange-500 to-orange-600', emoji: '🟠' };
  return { label: 'Obesidad', color: 'red', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-400', gradient: 'from-red-500 to-red-600', emoji: '🔴' };
}

function getCoachTips(cat) {
  if (!cat) return [];
  const tips = {
    blue: [
      { icon: '🍚', tip: 'Añade una ración extra de carbohidratos complejos (arroz, pasta integral) a la comida.' },
      { icon: '🥜', tip: 'Incluye frutos secos como snack entre comidas para aportar calorías saludables.' },
      { icon: '🍌', tip: 'Consume batidos de frutas con avena y leche para ganar peso de forma equilibrada.' },
    ],
    green: [
      { icon: '✅', tip: '¡Enhorabuena! Tu peso está en rango saludable. Mantén la constancia.' },
      { icon: '💧', tip: 'Bebe al menos 2L de agua al día para mantener una buena hidratación.' },
      { icon: '🚶', tip: 'Camina 30 min diarios — es el ejercicio perfecto para tu metabolismo.' },
    ],
    orange: [
      { icon: '🍞', tip: 'Reduce el pan en las cenas y sustitúyelo por verdura de hoja verde.' },
      { icon: '🏃', tip: 'Aumenta la actividad física: 150 min/semana de ejercicio moderado.' },
      { icon: '🥗', tip: 'Empieza cada comida con una ensalada para reducir la ingesta calórica.' },
    ],
    red: [
      { icon: '⚠️', tip: 'Es importante consultar con tu médico para un plan personalizado.' },
      { icon: '🥦', tip: 'Prioriza proteínas magras y verduras en cada plato — reduce ultraprocesados.' },
      { icon: '📉', tip: 'Establece metas pequeñas: perder 0.5 kg/semana es un ritmo seguro y efectivo.' },
    ],
  };
  return tips[cat.color] || tips.green;
}

const DIABETES_OPTIONS = [
  'MODY 2', 'MODY 3', 'MODY 5', 'Tipo 1', 'Tipo 2', 'Gestacional', 'LADA', 'Sin diabetes',
];

// ─── Component ──────────────────────────────────────
export default function Profile({ onBack }) {
  const { user, profile, updateProfile } = useAuth();

  // Form state
  const [nombre, setNombre] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [tipoDiabetes, setTipoDiabetes] = useState('');

  // Weight history
  const [weightLogs, setWeightLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // UI
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Init form from profile ──
  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre || '');
      setPeso(profile.peso?.toString() || '');
      setAltura(profile.altura?.toString() || '');
      setTipoDiabetes(profile.tipo_diabetes || 'MODY 2');
    }
  }, [profile]);

  // ── Fetch weight history ──
  useEffect(() => {
    if (!user) return;
    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const { data, error } = await supabase
          .from('weight_logs')
          .select('weight, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (!error && data) setWeightLogs(data);
      } catch (err) {
        console.error('Error fetching weight logs:', err);
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [user]);

  // ── Save profile ──
  const handleSave = async () => {
    setSaving(true);
    try {
      const pesoNum = parseFloat(peso);
      const alturaNum = parseFloat(altura);
      const pesoChanged = profile?.peso !== pesoNum && !isNaN(pesoNum);

      // Update profiles table (trigger handles weight_logs insert)
      await updateProfile({
        nombre: nombre.trim(),
        peso: isNaN(pesoNum) ? profile?.peso : pesoNum,
        altura: isNaN(alturaNum) ? profile?.altura : alturaNum,
        tipo_diabetes: tipoDiabetes,
      });

      // If peso changed, also add to local state for instant UI update
      if (pesoChanged) {
        setWeightLogs((prev) => [
          ...prev,
          { weight: pesoNum, created_at: new Date().toISOString() },
        ]);
      }

      setToast('✅ Perfil actualizado correctamente');
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setToast('❌ Error al guardar');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ── Derived values ──
  const pesoNum = parseFloat(peso);
  const alturaNum = parseFloat(altura);
  const imc = calcIMC(pesoNum, alturaNum);
  const cat = imcCategory(imc);
  const tips = useMemo(() => getCoachTips(cat), [cat]);

  // Chart data
  const chartData = useMemo(() => {
    return weightLogs.map((log) => ({
      date: new Date(log.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      peso: parseFloat(log.weight),
      fullDate: new Date(log.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
    }));
  }, [weightLogs]);

  const weightMin = chartData.length ? Math.floor(Math.min(...chartData.map((d) => d.peso)) - 2) : 0;
  const weightMax = chartData.length ? Math.ceil(Math.max(...chartData.map((d) => d.peso)) + 2) : 100;

  // ── Render ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-800 dark:to-cyan-800 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Mi Perfil</h1>
            <p className="text-emerald-200 text-xs font-medium">Seguimiento y objetivos</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 pb-24 space-y-5">

        {/* ═══════════════════════════════════════════
            BLOQUE 1 — DIAGNÓSTICO IMC (SEMÁFORO)
        ═══════════════════════════════════════════ */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <Scale size={18} className="text-teal-600 dark:text-teal-400" />
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Diagnóstico IMC</h2>
          </div>

          {imc !== null && cat ? (
            <div className="px-5 pb-5">
              {/* Big indicator */}
              <div className={`mt-3 rounded-2xl p-6 ${cat.bg} dark:bg-opacity-20 text-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${cat.gradient}`} />
                </div>
                <p className="text-5xl font-black tabular-nums relative z-10">
                  <span className={cat.text}>{imc}</span>
                </p>
                <p className={`text-xs font-bold uppercase tracking-widest mt-2 ${cat.text} relative z-10`}>
                  {cat.emoji} {cat.label}
                </p>
              </div>

              {/* Scale bar */}
              <div className="mt-4 relative h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <div className="absolute inset-0 flex">
                  <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
                  <div className="h-full bg-emerald-400" style={{ width: '15%' }} />
                  <div className="h-full bg-orange-400" style={{ width: '20%' }} />
                  <div className="h-full bg-red-400" style={{ flex: 1 }} />
                </div>
                {/* Marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-800 dark:border-white transition-all duration-500"
                  style={{ left: `${Math.min(Math.max((imc / 40) * 100, 2), 98)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40+</span>
              </div>
            </div>
          ) : (
            <div className="px-5 pb-5">
              <div className="mt-3 rounded-2xl p-8 bg-gray-50 dark:bg-gray-700/50 text-center">
                <Scale size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Introduce tu peso y altura para calcular el IMC
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════
            BLOQUE 2 — GRÁFICA DE PROGRESO
        ═══════════════════════════════════════════ */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <TrendingUp size={18} className="text-teal-600 dark:text-teal-400" />
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Evolución del Peso</h2>
          </div>

          <div className="px-5 pb-5">
            {loadingLogs ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-teal-500" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <Scale size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Sin datos de peso registrados</p>
                <p className="text-xs mt-1">Guarda tu peso para ver tu progreso</p>
              </div>
            ) : chartData.length === 1 ? (
              /* Single data point */
              <div className="h-48 flex flex-col items-center justify-center">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-2xl px-8 py-5 text-center shadow-lg">
                  <p className="text-3xl font-black">{chartData[0].peso} kg</p>
                  <p className="text-xs mt-1 opacity-80">{chartData[0].fullDate}</p>
                </div>
                <p className="text-xs text-gray-400 mt-3">Actualiza tu peso para ver la evolución</p>
              </div>
            ) : (
              /* Chart */
              <div className="h-56 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                    <defs>
                      <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[weightMin, weightMax]}
                      tick={{ fontSize: 10, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      unit=" kg"
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#111827',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [`${value} kg`, 'Peso']}
                      labelFormatter={(label, payload) =>
                        payload?.[0]?.payload?.fullDate || label
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      stroke="#14b8a6"
                      strokeWidth={2.5}
                      dot={{ fill: '#14b8a6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                    />
                    {/* Highlight last point */}
                    <ReferenceDot
                      x={chartData[chartData.length - 1].date}
                      y={chartData[chartData.length - 1].peso}
                      r={7}
                      fill="#0d9488"
                      stroke="#fff"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weight summary */}
            {chartData.length >= 2 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Inicio</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{chartData[0].peso} kg</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Actual</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{chartData[chartData.length - 1].peso} kg</p>
                </div>
                <div className={`rounded-xl p-2.5 text-center ${
                  chartData[chartData.length - 1].peso - chartData[0].peso < 0
                    ? 'bg-emerald-50 dark:bg-emerald-900/20'
                    : chartData[chartData.length - 1].peso - chartData[0].peso > 0
                      ? 'bg-orange-50 dark:bg-orange-900/20'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                }`}>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Cambio</p>
                  <p className={`text-sm font-bold ${
                    chartData[chartData.length - 1].peso - chartData[0].peso < 0
                      ? 'text-emerald-600'
                      : chartData[chartData.length - 1].peso - chartData[0].peso > 0
                        ? 'text-orange-600'
                        : 'text-gray-600'
                  }`}>
                    {(chartData[chartData.length - 1].peso - chartData[0].peso) > 0 ? '+' : ''}
                    {(chartData[chartData.length - 1].peso - chartData[0].peso).toFixed(1)} kg
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BLOQUE 3 — COACH VIRTUAL
        ═══════════════════════════════════════════ */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-teal-600 dark:text-teal-400" />
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Tu Coach Virtual</h2>
            {cat && (
              <span className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>
                {cat.emoji} {cat.label}
              </span>
            )}
          </div>

          <div className="px-5 pb-5 space-y-2.5 mt-2">
            {tips.length > 0 ? (
              tips.map((t, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/60"
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{t.icon}</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{t.tip}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 dark:text-gray-500">
                <HeartPulse size={28} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Completa tus datos para recibir consejos personalizados</p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            BLOQUE 4 — EDITAR DATOS
        ═══════════════════════════════════════════ */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <User size={18} className="text-teal-600 dark:text-teal-400" />
            <h2 className="font-bold text-gray-900 dark:text-white text-sm">Editar Datos</h2>
          </div>

          <div className="px-5 pb-5 space-y-4 mt-2">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Peso & Altura */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  <Scale size={12} className="inline mr-1" />
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="70.0"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  <Ruler size={12} className="inline mr-1" />
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  placeholder="170"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Tipo Diabetes */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Tipo de Diabetes
              </label>
              <div className="relative">
                <select
                  value={tipoDiabetes}
                  onChange={(e) => setTipoDiabetes(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  {DIABETES_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
