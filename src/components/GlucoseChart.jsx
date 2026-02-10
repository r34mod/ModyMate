// ================================================
// GLUCOSE CHART — GlicoHack v3
// Gráfica de lecturas de glucosa (últimos 7 días)
// ================================================

import { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, subDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, ArrowLeft, Droplet } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/useAuth';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const MOMENTO_LABELS = {
  ayunas: 'Ayunas',
  pre_comida: 'Pre comida',
  post_comida: 'Post comida',
  pre_cena: 'Pre cena',
  post_cena: 'Post cena',
  nocturno: 'Nocturno',
};

const MOMENTO_COLORS = {
  ayunas: '#f59e0b',
  pre_comida: '#3b82f6',
  post_comida: '#8b5cf6',
  pre_cena: '#06b6d4',
  post_cena: '#ec4899',
  nocturno: '#6b7280',
};

export default function GlucoseChart({ onBack }) {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    if (!user) return;

    const fetchLogs = async () => {
      setLoading(true);
      const since = subDays(new Date(), days).toISOString();

      const { data, error } = await supabase
        .from('glucose_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', since)
        .order('created_at', { ascending: true });

      if (!error && data) setLogs(data);
      setLoading(false);
    };

    fetchLogs();
  }, [user, days]);

  const minTarget = profile?.objetivo_glucosa_min ?? 70;
  const maxTarget = profile?.objetivo_glucosa_max ?? 140;

  // Stats
  const stats = useMemo(() => {
    if (logs.length === 0) return null;
    const values = logs.map((l) => l.valor);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const inRange = values.filter((v) => v >= minTarget && v <= maxTarget).length;
    return {
      avg: avg.toFixed(0),
      min,
      max,
      inRange: ((inRange / values.length) * 100).toFixed(0),
      total: values.length,
    };
  }, [logs, minTarget, maxTarget]);

  // Chart config
  const chartData = useMemo(() => {
    if (logs.length === 0) return null;

    const labels = logs.map((l) =>
      format(parseISO(l.created_at), 'dd MMM HH:mm', { locale: es })
    );

    return {
      labels,
      datasets: [
        {
          label: 'Glucosa (mg/dL)',
          data: logs.map((l) => l.valor),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          pointBackgroundColor: logs.map((l) => MOMENTO_COLORS[l.momento] || '#10b981'),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.3,
          borderWidth: 2.5,
        },
      ],
    };
  }, [logs]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          titleFont: { size: 11 },
          bodyFont: { size: 12, weight: 'bold' },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            afterBody: (items) => {
              const idx = items[0]?.dataIndex;
              if (idx !== undefined && logs[idx]) {
                const m = MOMENTO_LABELS[logs[idx].momento] || '';
                const n = logs[idx].notas || '';
                return [`${m}${n ? ` — ${n}` : ''}`];
              }
              return [];
            },
          },
        },
      },
      scales: {
        y: {
          min: 50,
          max: 250,
          ticks: {
            font: { size: 10 },
            color: '#9ca3af',
          },
          grid: { color: 'rgba(156,163,175,0.15)' },
        },
        x: {
          ticks: {
            font: { size: 9 },
            color: '#9ca3af',
            maxRotation: 45,
            maxTicksLimit: 10,
          },
          grid: { display: false },
        },
      },
      annotation: {
        annotations: {
          targetZone: {
            type: 'box',
            yMin: minTarget,
            yMax: maxTarget,
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            borderWidth: 1,
          },
        },
      },
    }),
    [logs, minTarget, maxTarget]
  );

  return (
    <div className="animate-fade-in-up">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp size={20} className="text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Mis Glucosas</h2>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                days === d
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {d} días
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <span className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin inline-block" />
        </div>
      )}

      {!loading && logs.length === 0 && (
        <div className="text-center py-16">
          <Droplet size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Sin registros aún</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Usa el botón <span className="text-rose-500 font-bold">+</span> para añadir tu primera medición
          </p>
        </div>
      )}

      {!loading && logs.length > 0 && (
        <>
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { label: 'Media', value: stats.avg, unit: 'mg/dL', color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Mín', value: stats.min, unit: 'mg/dL', color: 'text-sky-600 dark:text-sky-400' },
                { label: 'Máx', value: stats.max, unit: 'mg/dL', color: 'text-orange-600 dark:text-orange-400' },
                { label: 'En rango', value: `${stats.inRange}%`, unit: '', color: 'text-violet-600 dark:text-violet-400' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-center"
                >
                  <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-semibold uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
            {/* Target zone indicator */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Zona objetivo: {minTarget}–{maxTarget} mg/dL
              </span>
              <span className="text-[10px] text-gray-400">{stats?.total} mediciones</span>
            </div>
            <div className="h-64 sm:h-72">
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>
          </div>

          {/* Recent logs */}
          <div className="mt-5">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
              Últimas mediciones
            </h3>
            <div className="space-y-2">
              {logs
                .slice(-10)
                .reverse()
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3"
                  >
                    <div
                      className="w-2 h-8 rounded-full"
                      style={{ backgroundColor: MOMENTO_COLORS[log.momento] || '#10b981' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {log.valor} mg/dL
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {MOMENTO_LABELS[log.momento]}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {format(parseISO(log.created_at), "EEE d MMM · HH:mm", { locale: es })}
                      </p>
                    </div>
                    {log.valor >= minTarget && log.valor <= maxTarget ? (
                      <span className="text-emerald-500 text-xs font-bold">✓</span>
                    ) : (
                      <span className="text-orange-500 text-xs font-bold">!</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
