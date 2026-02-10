// ================================================
// MOTOR DE PLANIFICACIÓN — GlicoHack v4
// Rolling Window de 15 días · Supabase · Auto-generación
// Regla de Compensación: Comida con carbs → Cena Low Carb
// Filtrado de alérgenos por perfil
// Modo "sin_diabetes": variedad completa sin restricciones de IG
// ================================================

import { v4 as uuidv4 } from 'uuid';
import { format, addDays, startOfDay, isBefore, subDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '../lib/supabaseClient';

import {
  DESAYUNOS,
  MEDIA_MANANA,
  COMIDAS_CARBS,
  COMIDAS_LEGUMBRES,
  COMIDAS_VERDURA,
  MERIENDAS,
  CENAS_LOW_CARB,
  CENAS_FLEXIBLES,
} from '../data/meals';

const WINDOW_SIZE = 15;

// ---- Filtrado de alérgenos ----

function filterByAllergens(meals, userAllergens = []) {
  if (!userAllergens || userAllergens.length === 0) return meals;
  const filtered = meals.filter(
    (m) => !m.allergens || !m.allergens.some((a) => userAllergens.includes(a))
  );
  // Fallback: si filtramos todo, devolver original para no romper la app
  return filtered.length > 0 ? filtered : meals;
}

// ---- Helpers ----

function pickRandom(arr, recentIds = [], avoidLast = 3) {
  const recent = recentIds.slice(-avoidLast);
  const available = arr.filter((item) => !recent.includes(item.id));
  const pool = available.length > 0 ? available : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getComidaPattern(dayIndex) {
  // Ciclo: Carbs → Legumbres → Verdura+Proteína
  const patterns = ['carbs', 'legumbres', 'verdura'];
  return patterns[dayIndex % 3];
}

function pickComida(pattern, recentIds, filteredMeals) {
  switch (pattern) {
    case 'carbs':
      return pickRandom(filteredMeals.carbs, recentIds);
    case 'legumbres':
      return pickRandom(filteredMeals.legumbres, recentIds);
    case 'verdura':
      return pickRandom(filteredMeals.verdura, recentIds);
    default:
      return pickRandom(filteredMeals.verdura, recentIds);
  }
}

function pickCena(comidaHasCarbs, recentCenaIds, filteredMeals, sinDiabetes = false) {
  // Sin diabetes: siempre puede elegir de todas las cenas
  if (sinDiabetes) {
    return pickRandom(filteredMeals.cenasFlex, recentCenaIds);
  }
  // Con diabetes: compensación estricta
  if (comidaHasCarbs) {
    return pickRandom(filteredMeals.cenasLow, recentCenaIds);
  }
  return pickRandom(filteredMeals.cenasFlex, recentCenaIds);
}

/**
 * Pre-filtra todas las categorías según alérgenos del perfil.
 */
function buildFilteredMeals(userAllergens) {
  return {
    desayunos: filterByAllergens(DESAYUNOS, userAllergens),
    mediaManana: filterByAllergens(MEDIA_MANANA, userAllergens),
    carbs: filterByAllergens(COMIDAS_CARBS, userAllergens),
    legumbres: filterByAllergens(COMIDAS_LEGUMBRES, userAllergens),
    verdura: filterByAllergens(COMIDAS_VERDURA, userAllergens),
    meriendas: filterByAllergens(MERIENDAS, userAllergens),
    cenasLow: filterByAllergens(CENAS_LOW_CARB, userAllergens),
    cenasFlex: filterByAllergens(CENAS_FLEXIBLES, userAllergens),
  };
}

// ---- Generador de un solo día ----

function generateSingleDay(dateObj, dayIndex, recentMeals, filteredMeals, sinDiabetes = false) {
  const pattern = getComidaPattern(dayIndex);

  const desayuno = pickRandom(filteredMeals.desayunos, recentMeals.desayunos);
  const mediaManana = pickRandom(filteredMeals.mediaManana, recentMeals.mediaManana);
  const comida = pickComida(pattern, recentMeals.comidas, filteredMeals);
  const merienda = pickRandom(filteredMeals.meriendas, recentMeals.meriendas);
  const cena = pickCena(comida.hasCarbs, recentMeals.cenas, filteredMeals, sinDiabetes);

  // Actualizar recientes
  recentMeals.desayunos.push(desayuno.id);
  recentMeals.mediaManana.push(mediaManana.id);
  recentMeals.comidas.push(comida.id);
  recentMeals.meriendas.push(merienda.id);
  recentMeals.cenas.push(cena.id);

  const dateStr = format(dateObj, 'yyyy-MM-dd');

  return {
    id: uuidv4(),
    date: dateStr,
    dateFormatted: format(dateObj, "EEE d MMM", { locale: es }),
    dayName: format(dateObj, 'EEEE', { locale: es }),
    dayNumber: dateObj.getDate(),
    monthShort: format(dateObj, 'MMM', { locale: es }),
    pattern,
    comidaHasCarbs: !!comida.hasCarbs,
    meals: {
      desayuno: { ...desayuno, synjardy: !sinDiabetes },
      mediaManana,
      comida,
      merienda,
      cena: { ...cena, synjardy: !sinDiabetes },
    },
  };
}

// ---- API pública ----

/**
 * Genera un plan completo de N días desde una fecha.
 * @param {Date} fromDate
 * @param {object} profile - Perfil del usuario (con .alergias)
 */
export function generateInitialPlan(fromDate = new Date(), profile = {}) {
  const start = startOfDay(fromDate);
  const plan = [];
  const recentMeals = {
    desayunos: [],
    mediaManana: [],
    comidas: [],
    meriendas: [],
    cenas: [],
  };
  const filteredMeals = buildFilteredMeals(profile.alergias || []);
  const sinDiabetes = profile.tipo_diabetes === 'sin_diabetes';

  for (let i = 0; i < WINDOW_SIZE; i++) {
    const date = addDays(start, i);
    plan.push(generateSingleDay(date, i, recentMeals, filteredMeals, sinDiabetes));
  }

  return plan;
}

/**
 * Rolling Window: Extiende el plan para cubrir hoy + 14 días.
 * Limpia los días anteriores a ayer.
 * @param {Array} existingPlan
 * @param {object} profile - Perfil del usuario (con .alergias)
 */
export function syncPlan(existingPlan, profile = {}) {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  // 1. Limpiar días anteriores a ayer
  let plan = existingPlan.filter((day) => {
    const dayDate = startOfDay(parseISO(day.date));
    return !isBefore(dayDate, yesterday);
  });

  // 2. Encontrar la última fecha del plan
  let lastDate = today;
  if (plan.length > 0) {
    const dates = plan.map((d) => parseISO(d.date));
    lastDate = dates.reduce((max, d) => (d > max ? d : max), dates[0]);
  }

  // 3. Calcular hasta qué fecha necesitamos
  const targetEnd = addDays(today, WINDOW_SIZE - 1);

  // 4. Generar los días que falten
  if (lastDate < targetEnd) {
    const recentMeals = buildRecentFromPlan(plan);
    const filteredMeals = buildFilteredMeals(profile.alergias || []);
    const sinDiabetes = profile.tipo_diabetes === 'sin_diabetes';
    let dayIndex = plan.length;
    let nextDate = addDays(lastDate, 1);

    while (nextDate <= targetEnd) {
      plan.push(generateSingleDay(nextDate, dayIndex, recentMeals, filteredMeals, sinDiabetes));
      nextDate = addDays(nextDate, 1);
      dayIndex++;
    }
  }

  // 5. Ordenar por fecha
  plan.sort((a, b) => a.date.localeCompare(b.date));

  return plan;
}

/**
 * Construye el estado de "recientes" a partir de un plan existente
 * para evitar repeticiones al añadir nuevos días.
 */
function buildRecentFromPlan(plan) {
  const last5 = plan.slice(-5);
  return {
    desayunos: last5.map((d) => d.meals.desayuno.id).filter(Boolean),
    mediaManana: last5.map((d) => d.meals.mediaManana.id).filter(Boolean),
    comidas: last5.map((d) => d.meals.comida.id).filter(Boolean),
    meriendas: last5.map((d) => d.meals.merienda.id).filter(Boolean),
    cenas: last5.map((d) => d.meals.cena.id).filter(Boolean),
  };
}

// ---- Supabase: Menús ----

export async function savePlanToSupabase(userId, plan) {
  // Upsert each day (user_id + fecha = unique)
  const rows = plan.map((day) => ({
    user_id: userId,
    fecha: day.date,
    menu_data: day,
  }));

  const { error } = await supabase
    .from('daily_menus')
    .upsert(rows, { onConflict: 'user_id,fecha' });

  if (error) console.error('Error saving plan:', error.message);
}

export async function loadPlanFromSupabase(userId) {
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('daily_menus')
    .select('menu_data')
    .eq('user_id', userId)
    .gte('fecha', yesterday)
    .order('fecha', { ascending: true });

  if (error) {
    console.error('Error loading plan:', error.message);
    return null;
  }
  if (!data || data.length === 0) return null;

  return data.map((row) => row.menu_data);
}

export async function clearPlanFromSupabase(userId) {
  const { error } = await supabase
    .from('daily_menus')
    .delete()
    .eq('user_id', userId);

  if (error) console.error('Error clearing plan:', error.message);

  // Also clear tracking
  await supabase.from('tracking').delete().eq('user_id', userId);
}

// ---- Supabase: Tracking ----

export async function loadTrackingFromSupabase(userId) {
  const { data, error } = await supabase
    .from('tracking')
    .select('fecha, tracking_data')
    .eq('user_id', userId);

  if (error) {
    console.error('Error loading tracking:', error.message);
    return {};
  }

  const result = {};
  (data || []).forEach((row) => {
    result[row.fecha] = row.tracking_data;
  });
  return result;
}

export async function saveTrackingDayToSupabase(userId, fecha, dayTracking) {
  const { error } = await supabase
    .from('tracking')
    .upsert(
      {
        user_id: userId,
        fecha,
        tracking_data: dayTracking,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,fecha' }
    );

  if (error) console.error('Error saving tracking:', error.message);
}

// ---- Cambiar plato (Swap Meal) ----

/**
 * Devuelve un plato alternativo del mismo tipo, respetando alergias y diabetes.
 * @param {string} mealKey - Clave del slot: 'desayuno','mediaManana','comida','merienda','cena'
 * @param {object} currentMeal - El plato actual que queremos cambiar
 * @param {object} profile - Perfil del usuario (alergias, tipo_diabetes)
 * @param {string[]} blacklistedIds - IDs a evitar (el actual + otros recientes)
 * @param {object} dayContext - Contexto del día { pattern, comidaHasCarbs }
 * @returns {object|null} Nuevo plato o null si no hay alternativa
 */
export function getAlternativeMeal(mealKey, currentMeal, profile = {}, blacklistedIds = [], dayContext = {}) {
  const userAllergens = profile.alergias || [];
  const sinDiabetes = profile.tipo_diabetes === 'sin_diabetes';
  const filtered = buildFilteredMeals(userAllergens);

  // Determinar el pool de platos según el slot
  let pool;
  switch (mealKey) {
    case 'desayuno':
      pool = filtered.desayunos;
      break;
    case 'mediaManana':
      pool = filtered.mediaManana;
      break;
    case 'comida': {
      // Respetar el patrón del día
      const pattern = dayContext.pattern || 'verdura';
      if (pattern === 'carbs') pool = filtered.carbs;
      else if (pattern === 'legumbres') pool = filtered.legumbres;
      else pool = filtered.verdura;
      break;
    }
    case 'merienda':
      pool = filtered.meriendas;
      break;
    case 'cena': {
      // Respetar regla de compensación (solo diabéticos)
      if (!sinDiabetes && dayContext.comidaHasCarbs) {
        pool = filtered.cenasLow;
      } else {
        pool = filtered.cenasFlex;
      }
      break;
    }
    default:
      return null;
  }

  // Filtrar el plato actual y blacklisted
  const allBlacklisted = [currentMeal.id, ...blacklistedIds];
  const candidates = pool.filter((m) => !allBlacklisted.includes(m.id));

  if (candidates.length === 0) return null;

  // Elegir al azar
  const newMeal = candidates[Math.floor(Math.random() * candidates.length)];

  // Mantener synjardy flag si el plato original lo tenía
  if (currentMeal.synjardy) {
    return { ...newMeal, synjardy: !sinDiabetes };
  }
  return newMeal;
}

// ---- localStorage fallback (eliminados — todo en Supabase) ----

export function savePlan() { /* no-op: migrado a Supabase */ }
export function loadPlan() { return null; }
export function clearPlan() { /* no-op */ }
export function loadTracking() { return {}; }
export function saveTracking() { /* no-op */ }

/**
 * Genera la lista de la compra agrupada a partir de un plan.
 */
export function generateShoppingList(plan) {
  const ingredientMap = {};

  plan.forEach((day) => {
    Object.values(day.meals).forEach((meal) => {
      if (meal.ingredientes) {
        meal.ingredientes.forEach((ing) => {
          const key = ing.toLowerCase().trim();
          if (ingredientMap[key]) {
            ingredientMap[key].count += 1;
          } else {
            ingredientMap[key] = { name: ing, count: 1 };
          }
        });
      }
    });
  });

  const categories = {
    '🥩 Proteínas': ['pollo', 'pavo', 'ternera', 'cerdo', 'chorizo', 'jamón', 'salmón', 'merluza', 'lubina', 'dorada', 'emperador', 'gambas', 'almejas', 'atún', 'huevo', 'calamar', 'mejillones'],
    '🧀 Lácteos': ['yogur', 'queso', 'leche', 'mantequilla', 'crema', 'nata', 'mozzarella', 'parmesano'],
    '🥬 Frutas y Verduras': ['lechuga', 'tomate', 'pepino', 'cebolla', 'ajo', 'pimiento', 'calabacín', 'berenjena', 'zanahoria', 'espárrago', 'espinaca', 'brócoli', 'champiñon', 'manzana', 'plátano', 'limón', 'fresa', 'aguacate', 'apio', 'romana'],
    '🌾 Legumbres y Cereales': ['lenteja', 'garbanzo', 'alubia', 'arroz', 'pasta', 'macarrones', 'fideo', 'avena', 'pan', 'masa', 'galleta'],
    '🥜 Frutos Secos': ['nuez', 'almendra', 'anacardo', 'cacahuete'],
    '🫒 Despensa': ['aceite', 'vinagre', 'sal', 'pimienta', 'orégano', 'comino', 'pimentón', 'canela', 'romero', 'perejil', 'eneldo', 'laurel', 'jengibre', 'guindilla', 'soja', 'vino', 'hummus', 'membrillo', 'picos', 'caldo', 'alioli', 'café'],
  };

  const grouped = {};
  const uncategorized = [];

  Object.values(ingredientMap).forEach((item) => {
    let placed = false;
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((kw) => item.name.toLowerCase().includes(kw))) {
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(item);
        placed = true;
        break;
      }
    }
    if (!placed) uncategorized.push(item);
  });

  if (uncategorized.length > 0) grouped['📦 Otros'] = uncategorized;

  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => a.name.localeCompare(b.name, 'es'));
  });

  return grouped;
}
