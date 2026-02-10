// ================================================
// ONBOARDING WIZARD — GlicoHack v4
// 3 pasos: Datos Físicos → Tratamiento → Alergias
// ================================================

import { useState } from 'react';
import {
  User, Weight, Ruler, ArrowRight, ArrowLeft, Sparkles,
  Target, Pill, Syringe, Salad, Check,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

const ALLERGY_OPTIONS = [
  { key: 'gluten', label: 'Gluten', emoji: '🌾' },
  { key: 'lactosa', label: 'Lactosa', emoji: '🥛' },
  { key: 'frutos_secos', label: 'Frutos Secos', emoji: '🥜' },
  { key: 'marisco', label: 'Marisco', emoji: '🦐' },
  { key: 'huevo', label: 'Huevo', emoji: '🥚' },
];

const TREATMENT_OPTIONS = [
  { key: 'oral', label: 'Pastillas', emoji: '💊', Icon: Pill },
  { key: 'insulina', label: 'Insulina', emoji: '💉', Icon: Syringe },
  { key: 'dieta', label: 'Solo Dieta', emoji: '🥗', Icon: Salad },
];

export default function OnboardingWizard() {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Datos Físicos
  const [nombre, setNombre] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [tipoDiabetes, setTipoDiabetes] = useState('MODY 2');
  const [objetivoMin, setObjetivoMin] = useState('70');
  const [objetivoMax, setObjetivoMax] = useState('140');

  const isSinDiabetes = tipoDiabetes === 'sin_diabetes';

  // Step 2: Tratamiento
  const [tratamiento, setTratamiento] = useState('oral');
  const [nombreMedicacion, setNombreMedicacion] = useState('Synjardy');

  // Step 3: Alergias
  const [alergias, setAlergias] = useState([]);

  const toggleAlergia = (key) => {
    setAlergias((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const canProceed = () => {
    if (step === 1) return nombre.trim().length > 0;
    if (step === 2) return tratamiento !== '';
    return true;
  };

  const handleNext = () => {
    // Si es "sin diabetes", saltar paso 2 (tratamiento) e ir directo a alergias
    if (step === 1 && isSinDiabetes) {
      setTratamiento('sin_diabetes');
      setNombreMedicacion('');
      setStep(3);
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    // Si es "sin diabetes" y estamos en alergias, volver a paso 1
    if (step === 3 && isSinDiabetes) {
      setStep(1);
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await updateProfile({
        nombre: nombre.trim(),
        peso: peso ? parseFloat(peso) : null,
        altura: altura ? parseFloat(altura) : null,
        tipo_diabetes: tipoDiabetes,
        tratamiento,
        nombre_medicacion: (tratamiento === 'dieta' || tratamiento === 'sin_diabetes') ? null : nombreMedicacion.trim() || null,
        alergias,
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

  const inputClass =
    'w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all';

  // ---- Step 1: Datos Físicos ----
  const renderStep1 = () => (
    <div className="space-y-4">
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
            className={inputClass}
          />
        </div>
      </div>

      {/* Peso + Altura */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Peso (kg)
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
              placeholder="72.5"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            Altura (cm)
          </label>
          <div className="relative">
            <Ruler size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              step="0.1"
              min="100"
              max="250"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              placeholder="170"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Tipo diabetes */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          Perfil de Salud
        </label>
        <select
          value={tipoDiabetes}
          onChange={(e) => setTipoDiabetes(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        >
          <option value="sin_diabetes">🍏 Sin Diabetes (Vida Saludable)</option>
          <option value="MODY 2">MODY 2</option>
          <option value="MODY 1">MODY 1</option>
          <option value="MODY 3">MODY 3</option>
          <option value="Tipo 1">Tipo 1</option>
          <option value="Tipo 2">Tipo 2</option>
          <option value="Gestacional">Gestacional</option>
        </select>
      </div>

      {/* Rango glucosa — solo para diabéticos */}
      {!isSinDiabetes && (
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
          <Target size={12} className="inline mr-1" />
          Rango objetivo glucosa (mg/dL)
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
      )}

      {/* Info sin diabetes */}
      {isSinDiabetes && (
        <div className="px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            🍏 Tendrás acceso a todos los platos sin restricciones de azúcar. Solo filtraremos por alergias.
          </p>
        </div>
      )}
    </div>
  );

  // ---- Step 2: Tratamiento ----
  const renderStep2 = () => (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        ¿Cómo controlas tu diabetes?
      </p>

      <div className="grid grid-cols-3 gap-3">
        {TREATMENT_OPTIONS.map((opt) => {
          const isSelected = tratamiento === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setTratamiento(opt.key)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-lg shadow-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Nombre medicación (si no es "dieta") */}
      {tratamiento !== 'dieta' && (
        <div className="animate-fade-in-up">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
            {tratamiento === 'insulina' ? 'Nombre de tu insulina' : 'Nombre de tu medicación'}
          </label>
          <div className="relative">
            <Pill size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={nombreMedicacion}
              onChange={(e) => setNombreMedicacion(e.target.value)}
              placeholder={tratamiento === 'insulina' ? 'Ej: Lantus, NovoRapid...' : 'Ej: Synjardy, Metformina...'}
              className={inputClass}
            />
          </div>
        </div>
      )}

      {/* Mixto hint */}
      <div className="px-3 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
          💡 Si usas insulina + pastillas, selecciona &quot;Insulina&quot; y pondremos recordatorios para ambas.
        </p>
      </div>
    </div>
  );

  // ---- Step 3: Alergias ----
  const renderStep3 = () => (
    <div className="space-y-5">
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Selecciona tus alergias o intolerancias para filtrar el menú
      </p>

      <div className="grid grid-cols-2 gap-3">
        {ALLERGY_OPTIONS.map((opt) => {
          const isSelected = alergias.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => toggleAlergia(opt.key)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-red-400 bg-red-50 dark:bg-red-900/30 shadow-lg shadow-red-400/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className={`text-sm font-bold ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {opt.label}
              </span>
              {isSelected && (
                <Check size={16} className="ml-auto text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {alergias.length === 0 && (
        <div className="px-3 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            ✅ Sin alergias seleccionadas — se mostrarán todos los platos
          </p>
        </div>
      )}

      {alergias.length > 0 && (
        <div className="px-3 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-xs text-red-700 dark:text-red-400 font-medium">
            🚫 Se filtrarán platos con: {alergias.map((a) => ALLERGY_OPTIONS.find((o) => o.key === a)?.label).join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  const stepTitles = ['Datos Físicos', 'Tratamiento', 'Alergias'];
  const stepEmojis = ['📋', '💊', '🚫'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">¡Bienvenid@!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Paso {step} de 3 — {stepEmojis[step - 1]} {stepTitles[step - 1]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Error */}
          {error && (
            <div className="mt-4 px-3 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer"
              >
                <ArrowLeft size={16} />
                Atrás
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all duration-300 disabled:opacity-40 cursor-pointer"
              >
                Siguiente
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-xl transition-all duration-300 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Comenzar
                    <Sparkles size={16} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
