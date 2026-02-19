#!/usr/bin/env node
// ================================================
// seedMeals.js — GlicoHack
// Generador algorítmico de 1.500 recetas únicas
// Macros reales · Precios España · IG ponderado
// Ejecutar: node seedMeals.js
// ================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import process from 'node:process';

// ─── Configuración ──────────────────────────────────
// Usa service_role key para poder escribir en la tabla meals
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en variables de entorno.');
  console.error('   Uso: SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=ey... node seedMeals.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BATCH_SIZE = 50;
const TARGET_PER_TYPE = 300;

// ═══════════════════════════════════════════════════════
// LA DESPENSA — Ingredientes con macros/100g y precio €
// ═══════════════════════════════════════════════════════

// --- BREAKFAST BASES ---
const BREAKFAST_BASES = [
  { item: 'Copos de avena',        qty: 50,  unit: 'g', category: 'Despensa',   price: 0.12, cal: 189, carbs: 33.5, protein: 6.5,  fat: 3.5,  gi: 55, tags: [] },
  { item: 'Tostada integral',      qty: 60,  unit: 'g', category: 'Panadería',  price: 0.15, cal: 147, carbs: 26.0, protein: 5.4,  fat: 1.5,  gi: 50, tags: [] },
  { item: 'Tostada pan blanco',    qty: 60,  unit: 'g', category: 'Panadería',  price: 0.12, cal: 159, carbs: 30.0, protein: 5.0,  fat: 1.8,  gi: 75, tags: [] },
  { item: 'Yogur griego natural',  qty: 150, unit: 'g', category: 'Lácteos',    price: 0.55, cal: 147, carbs: 6.0,  protein: 9.0,  fat: 10.0, gi: 20, tags: [] },
  { item: 'Yogur natural desnatado', qty: 150, unit: 'g', category: 'Lácteos',  price: 0.40, cal: 84,  carbs: 9.0,  protein: 7.5,  fat: 1.5,  gi: 25, tags: [] },
  { item: 'Requesón',              qty: 100, unit: 'g', category: 'Lácteos',    price: 0.65, cal: 98,  carbs: 3.5,  protein: 11.0, fat: 4.5,  gi: 15, tags: [] },
  { item: 'Tortilla francesa',     qty: 120, unit: 'g', category: 'Proteína',   price: 0.35, cal: 219, carbs: 0.8,  protein: 14.4, fat: 17.4, gi: 0,  tags: ['gluten_free'] },
  { item: 'Porridge de avena con leche', qty: 250, unit: 'ml', category: 'Despensa', price: 0.30, cal: 220, carbs: 36.0, protein: 8.0, fat: 5.0, gi: 55, tags: [] },
  { item: 'Crepe de avena',        qty: 100, unit: 'g', category: 'Despensa',   price: 0.25, cal: 185, carbs: 22.0, protein: 8.5,  fat: 6.0,  gi: 50, tags: [] },
  { item: 'Bol de queso fresco',   qty: 120, unit: 'g', category: 'Lácteos',    price: 0.55, cal: 108, carbs: 3.0,  protein: 10.0, fat: 6.0,  gi: 15, tags: ['gluten_free'] },
  { item: 'Gachas de avena con canela', qty: 200, unit: 'ml', category: 'Despensa', price: 0.20, cal: 180, carbs: 30.0, protein: 6.0, fat: 4.0, gi: 55, tags: [] },
  { item: 'Smoothie bowl',         qty: 250, unit: 'ml', category: 'Frutas',    price: 0.80, cal: 195, carbs: 32.0, protein: 5.0,  fat: 5.5,  gi: 45, tags: ['gluten_free'] },
];

// --- BREAKFAST TOPPINGS ---
const BREAKFAST_TOPPINGS = [
  { item: 'Frutos rojos',              qty: 60,  unit: 'g', category: 'Frutas',    price: 0.60, cal: 28,  carbs: 5.5,  protein: 0.5, fat: 0.2, gi: 25, tags: ['gluten_free', 'vegan'] },
  { item: 'Pavo en lonchas',           qty: 40,  unit: 'g', category: 'Embutidos', price: 0.35, cal: 42,  carbs: 0.5,  protein: 8.4, fat: 0.8, gi: 0,  tags: ['gluten_free'] },
  { item: 'Aguacate',                  qty: 50,  unit: 'g', category: 'Frutas',    price: 0.45, cal: 80,  carbs: 1.7,  protein: 1.0, fat: 7.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Nueces',                    qty: 20,  unit: 'g', category: 'Frutos secos', price: 0.30, cal: 131, carbs: 1.4, protein: 3.1, fat: 13.1, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Almendras',                 qty: 20,  unit: 'g', category: 'Frutos secos', price: 0.30, cal: 116, carbs: 1.6, protein: 4.2, fat: 10.0, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Plátano en rodajas',        qty: 80,  unit: 'g', category: 'Frutas',    price: 0.15, cal: 71,  carbs: 17.6, protein: 0.9, fat: 0.2, gi: 55, tags: ['gluten_free', 'vegan'] },
  { item: 'Jamón serrano',             qty: 30,  unit: 'g', category: 'Embutidos', price: 0.55, cal: 54,  carbs: 0.0,  protein: 9.0, fat: 2.0, gi: 0,  tags: ['gluten_free'] },
  { item: 'Queso crema',               qty: 30,  unit: 'g', category: 'Lácteos',   price: 0.25, cal: 75,  carbs: 1.0,  protein: 1.8, fat: 7.2, gi: 10, tags: ['gluten_free'] },
  { item: 'Salmón ahumado',            qty: 40,  unit: 'g', category: 'Pescado',   price: 0.95, cal: 58,  carbs: 0.0,  protein: 7.2, fat: 3.2, gi: 0,  tags: ['gluten_free'] },
  { item: 'Tomate natural triturado',  qty: 50,  unit: 'g', category: 'Verduras',  price: 0.10, cal: 9,   carbs: 1.6,  protein: 0.4, fat: 0.1, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Huevo revuelto',            qty: 60,  unit: 'g', category: 'Proteína',  price: 0.20, cal: 93,  carbs: 0.4,  protein: 6.3, fat: 7.2, gi: 0,  tags: ['gluten_free'] },
  { item: 'Canela y miel (pizca)',     qty: 10,  unit: 'g', category: 'Despensa',  price: 0.08, cal: 30,  carbs: 7.5,  protein: 0.0, fat: 0.0, gi: 55, tags: ['gluten_free', 'vegan'] },
  { item: 'Semillas de chía',          qty: 10,  unit: 'g', category: 'Despensa',  price: 0.15, cal: 49,  carbs: 0.7,  protein: 1.7, fat: 3.1, gi: 5,  tags: ['gluten_free', 'vegan'] },
  { item: 'Mantequilla de cacahuete',  qty: 15,  unit: 'g', category: 'Despensa',  price: 0.18, cal: 88,  carbs: 2.1,  protein: 3.8, fat: 7.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Mermelada sin azúcar',      qty: 20,  unit: 'g', category: 'Despensa',  price: 0.15, cal: 18,  carbs: 4.0,  protein: 0.1, fat: 0.0, gi: 30, tags: ['gluten_free', 'vegan'] },
  { item: 'Queso fresco en lonchas',   qty: 40,  unit: 'g', category: 'Lácteos',   price: 0.30, cal: 36,  carbs: 1.0,  protein: 4.0, fat: 2.0, gi: 10, tags: ['gluten_free'] },
];

// --- SNACK ITEMS ---
const SNACK_ITEMS = [
  { item: 'Manzana',                    qty: 150, unit: 'g', category: 'Frutas',       price: 0.30, cal: 78,  carbs: 17.0, protein: 0.5, fat: 0.3, gi: 36, tags: ['gluten_free', 'vegan'] },
  { item: 'Almendras tostadas (30g)',    qty: 30,  unit: 'g', category: 'Frutos secos', price: 0.45, cal: 174, carbs: 2.4,  protein: 6.3, fat: 15.0, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Kéfir natural',              qty: 200, unit: 'ml', category: 'Lácteos',     price: 0.55, cal: 112, carbs: 8.0,  protein: 6.0, fat: 6.0, gi: 20, tags: ['gluten_free'] },
  { item: 'Hummus con palitos de zanahoria', qty: 100, unit: 'g', category: 'Verduras', price: 0.60, cal: 126, carbs: 10.0, protein: 4.0, fat: 7.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Huevo duro',                 qty: 60,  unit: 'g', category: 'Proteína',    price: 0.18, cal: 78,  carbs: 0.6,  protein: 6.3, fat: 5.3, gi: 0,  tags: ['gluten_free'] },
  { item: 'Yogur natural sin azúcar',   qty: 125, unit: 'g', category: 'Lácteos',     price: 0.30, cal: 70,  carbs: 5.0,  protein: 5.5, fat: 3.5, gi: 25, tags: ['gluten_free'] },
  { item: 'Nueces (puñado 30g)',         qty: 30,  unit: 'g', category: 'Frutos secos', price: 0.45, cal: 196, carbs: 2.1,  protein: 4.6, fat: 19.6, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Queso fresco con membrillo s/a', qty: 80, unit: 'g', category: 'Lácteos',   price: 0.50, cal: 92,  carbs: 8.0,  protein: 5.0, fat: 4.5, gi: 25, tags: ['gluten_free'] },
  { item: 'Jamón serrano (50g)',         qty: 50,  unit: 'g', category: 'Embutidos',   price: 0.85, cal: 90,  carbs: 0.0,  protein: 15.0, fat: 3.5, gi: 0, tags: ['gluten_free'] },
  { item: 'Plátano',                    qty: 120, unit: 'g', category: 'Frutas',       price: 0.15, cal: 107, carbs: 26.4, protein: 1.3, fat: 0.3, gi: 55, tags: ['gluten_free', 'vegan'] },
  { item: 'Pepino con queso crema',      qty: 120, unit: 'g', category: 'Verduras',    price: 0.35, cal: 75,  carbs: 3.0,  protein: 3.0, fat: 5.5, gi: 10, tags: ['gluten_free'] },
  { item: 'Mix de frutos secos (30g)',   qty: 30,  unit: 'g', category: 'Frutos secos', price: 0.50, cal: 178, carbs: 3.0,  protein: 5.0, fat: 16.0, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Pavo con queso en rollito',   qty: 60,  unit: 'g', category: 'Embutidos',   price: 0.45, cal: 68,  carbs: 0.8,  protein: 10.0, fat: 2.8, gi: 0, tags: ['gluten_free'] },
  { item: 'Palitos de apio con hummus',  qty: 100, unit: 'g', category: 'Verduras',    price: 0.50, cal: 95,  carbs: 8.0,  protein: 3.0, fat: 5.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Naranja',                     qty: 180, unit: 'g', category: 'Frutas',       price: 0.25, cal: 81,  carbs: 17.0, protein: 1.5, fat: 0.2, gi: 35, tags: ['gluten_free', 'vegan'] },
  { item: 'Pera',                        qty: 160, unit: 'g', category: 'Frutas',       price: 0.30, cal: 91,  carbs: 20.0, protein: 0.5, fat: 0.2, gi: 30, tags: ['gluten_free', 'vegan'] },
  { item: 'Anacardos (30g)',             qty: 30,  unit: 'g', category: 'Frutos secos', price: 0.55, cal: 166, carbs: 8.4,  protein: 5.4, fat: 12.6, gi: 20, tags: ['gluten_free', 'vegan'] },
  { item: 'Tomates cherry con AOVE',     qty: 100, unit: 'g', category: 'Verduras',    price: 0.35, cal: 55,  carbs: 3.5,  protein: 0.9, fat: 3.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Tortitas de arroz con pavo',  qty: 50,  unit: 'g', category: 'Despensa',    price: 0.35, cal: 82,  carbs: 10.0, protein: 6.0, fat: 1.5, gi: 65, tags: ['gluten_free'] },
  { item: 'Batido de proteínas natural', qty: 250, unit: 'ml', category: 'Lácteos',    price: 0.70, cal: 150, carbs: 8.0,  protein: 20.0, fat: 4.0, gi: 20, tags: ['gluten_free'] },
];

// --- SNACK COMBOS (frutas + fruto seco) ---
const SNACK_COMBOS = [
  { items: ['Manzana', 'Almendras (15g)'],      mainIdx: [0, 1] },
  { items: ['Plátano', 'Nueces (15g)'],          mainIdx: [9, 6] },
  { items: ['Naranja', 'Anacardos (15g)'],       mainIdx: [14, 16] },
  { items: ['Pera', 'Almendras (15g)'],          mainIdx: [15, 1] },
];

// --- MAIN BASES (Lunch) ---
const MAIN_BASES = [
  { item: 'Arroz integral',     qty: 80,  unit: 'g', category: 'Despensa',  price: 0.15, cal: 282, carbs: 58.0, protein: 5.8,  fat: 2.2,  gi: 50, tags: ['gluten_free', 'vegan'] },
  { item: 'Arroz blanco',       qty: 80,  unit: 'g', category: 'Despensa',  price: 0.10, cal: 290, carbs: 63.0, protein: 5.3,  fat: 0.5,  gi: 73, tags: ['gluten_free', 'vegan'] },
  { item: 'Quinoa',             qty: 70,  unit: 'g', category: 'Despensa',  price: 0.35, cal: 255, carbs: 42.0, protein: 10.0, fat: 4.2,  gi: 35, tags: ['gluten_free', 'vegan'] },
  { item: 'Pasta integral',     qty: 80,  unit: 'g', category: 'Despensa',  price: 0.18, cal: 280, carbs: 54.0, protein: 10.4, fat: 2.0,  gi: 42, tags: ['vegan'] },
  { item: 'Lentejas cocidas',   qty: 150, unit: 'g', category: 'Legumbres', price: 0.25, cal: 172, carbs: 21.0, protein: 13.5, fat: 0.6,  gi: 30, tags: ['gluten_free', 'vegan'] },
  { item: 'Garbanzos cocidos',  qty: 150, unit: 'g', category: 'Legumbres', price: 0.25, cal: 245, carbs: 30.0, protein: 13.2, fat: 4.2,  gi: 28, tags: ['gluten_free', 'vegan'] },
  { item: 'Patata asada',       qty: 200, unit: 'g', category: 'Verduras',  price: 0.20, cal: 172, carbs: 38.0, protein: 4.0,  fat: 0.2,  gi: 65, tags: ['gluten_free', 'vegan'] },
  { item: 'Cuscús integral',    qty: 70,  unit: 'g', category: 'Despensa',  price: 0.15, cal: 242, carbs: 48.0, protein: 8.4,  fat: 1.0,  gi: 45, tags: ['vegan'] },
  { item: 'Alubias blancas cocidas', qty: 150, unit: 'g', category: 'Legumbres', price: 0.22, cal: 157, carbs: 19.5, protein: 10.5, fat: 0.6, gi: 25, tags: ['gluten_free', 'vegan'] },
  { item: 'Pasta de legumbres', qty: 80,  unit: 'g', category: 'Despensa',  price: 0.40, cal: 260, carbs: 38.0, protein: 18.0, fat: 2.5,  gi: 30, tags: ['gluten_free', 'vegan'] },
  { item: 'Macarrones',         qty: 80,  unit: 'g', category: 'Despensa',  price: 0.12, cal: 296, carbs: 58.0, protein: 10.0, fat: 1.5,  gi: 50, tags: ['vegan'] },
  { item: 'Fideos',             qty: 80,  unit: 'g', category: 'Despensa',  price: 0.12, cal: 290, carbs: 57.0, protein: 9.6,  fat: 1.4,  gi: 50, tags: [] },
  { item: 'Boniato asado',      qty: 200, unit: 'g', category: 'Verduras',  price: 0.35, cal: 180, carbs: 40.0, protein: 2.8,  fat: 0.2,  gi: 44, tags: ['gluten_free', 'vegan'] },
];

// --- MAIN PROTEINS (Lunch & Dinner) ---
const MAIN_PROTEINS = [
  { item: 'Pechuga de pollo a la plancha', qty: 150, unit: 'g', category: 'Proteína', price: 0.95, cal: 165, carbs: 0.0,  protein: 31.0, fat: 3.6, gi: 0, tags: ['gluten_free'] },
  { item: 'Merluza al horno',              qty: 150, unit: 'g', category: 'Pescado',  price: 1.20, cal: 120, carbs: 0.0,  protein: 23.0, fat: 2.4, gi: 0, tags: ['gluten_free'] },
  { item: 'Salmón a la plancha',            qty: 150, unit: 'g', category: 'Pescado',  price: 1.85, cal: 270, carbs: 0.0,  protein: 27.0, fat: 18.0, gi: 0, tags: ['gluten_free'] },
  { item: 'Tofu salteado',                  qty: 150, unit: 'g', category: 'Proteína', price: 0.75, cal: 135, carbs: 2.7,  protein: 12.0, fat: 8.1, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Ternera magra a la plancha',     qty: 150, unit: 'g', category: 'Proteína', price: 1.65, cal: 210, carbs: 0.0,  protein: 30.0, fat: 9.0, gi: 0, tags: ['gluten_free'] },
  { item: 'Muslo de pollo al horno',        qty: 150, unit: 'g', category: 'Proteína', price: 0.80, cal: 225, carbs: 0.0,  protein: 26.0, fat: 13.5, gi: 0, tags: ['gluten_free'] },
  { item: 'Atún a la plancha',              qty: 130, unit: 'g', category: 'Pescado',  price: 1.50, cal: 163, carbs: 0.0,  protein: 29.0, fat: 5.0, gi: 0, tags: ['gluten_free'] },
  { item: 'Lubina al horno',                qty: 150, unit: 'g', category: 'Pescado',  price: 1.75, cal: 142, carbs: 0.0,  protein: 24.0, fat: 4.8, gi: 0, tags: ['gluten_free'] },
  { item: 'Huevos revueltos (2 uds)',       qty: 120, unit: 'g', category: 'Proteína', price: 0.36, cal: 186, carbs: 0.8,  protein: 12.6, fat: 14.4, gi: 0, tags: ['gluten_free'] },
  { item: 'Pavo a la plancha',              qty: 150, unit: 'g', category: 'Proteína', price: 0.90, cal: 155, carbs: 0.0,  protein: 30.0, fat: 3.5, gi: 0, tags: ['gluten_free'] },
  { item: 'Gambas salteadas',               qty: 120, unit: 'g', category: 'Marisco',  price: 1.60, cal: 112, carbs: 0.5,  protein: 22.0, fat: 1.8, gi: 0, tags: ['gluten_free'] },
  { item: 'Seitan a la plancha',            qty: 120, unit: 'g', category: 'Proteína', price: 0.85, cal: 150, carbs: 4.0,  protein: 25.0, fat: 2.0, gi: 15, tags: ['vegan'] },
  { item: 'Lomo de cerdo al horno',         qty: 150, unit: 'g', category: 'Proteína', price: 1.10, cal: 240, carbs: 0.0,  protein: 28.0, fat: 14.0, gi: 0, tags: ['gluten_free'] },
  { item: 'Dorada al horno',                qty: 150, unit: 'g', category: 'Pescado',  price: 1.55, cal: 130, carbs: 0.0,  protein: 22.5, fat: 4.2, gi: 0, tags: ['gluten_free'] },
  { item: 'Emperador a la plancha',         qty: 150, unit: 'g', category: 'Pescado',  price: 1.90, cal: 160, carbs: 0.0,  protein: 28.0, fat: 5.0, gi: 0, tags: ['gluten_free'] },
  { item: 'Tortilla de espinacas',          qty: 150, unit: 'g', category: 'Proteína', price: 0.45, cal: 170, carbs: 2.0,  protein: 11.0, fat: 12.5, gi: 10, tags: ['gluten_free'] },
];

// --- VEGGIES (side for Lunch) ---
const VEGGIES = [
  { item: 'Ensalada mixta',               qty: 100, unit: 'g', category: 'Verduras', price: 0.35, cal: 18, carbs: 2.5, protein: 1.0, fat: 0.3, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Brócoli al vapor',             qty: 120, unit: 'g', category: 'Verduras', price: 0.30, cal: 41, carbs: 4.0, protein: 3.4, fat: 0.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Espinacas salteadas',           qty: 100, unit: 'g', category: 'Verduras', price: 0.35, cal: 30, carbs: 1.6, protein: 3.0, fat: 1.0, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Judías verdes rehogadas',       qty: 120, unit: 'g', category: 'Verduras', price: 0.30, cal: 37, carbs: 4.2, protein: 2.2, fat: 0.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Calabacín a la plancha',        qty: 120, unit: 'g', category: 'Verduras', price: 0.25, cal: 22, carbs: 2.4, protein: 1.4, fat: 0.4, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Pimientos asados',              qty: 100, unit: 'g', category: 'Verduras', price: 0.30, cal: 35, carbs: 5.5, protein: 1.0, fat: 0.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Champiñones salteados',         qty: 100, unit: 'g', category: 'Verduras', price: 0.35, cal: 32, carbs: 1.5, protein: 3.0, fat: 1.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Espárragos trigueros',          qty: 100, unit: 'g', category: 'Verduras', price: 0.50, cal: 25, carbs: 2.0, protein: 2.5, fat: 0.3, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Berenjena asada',               qty: 120, unit: 'g', category: 'Verduras', price: 0.25, cal: 30, carbs: 3.6, protein: 1.0, fat: 0.4, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Tomate aliñado con AOVE',       qty: 100, unit: 'g', category: 'Verduras', price: 0.25, cal: 50, carbs: 3.9, protein: 0.9, fat: 3.0, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Zanahoria rallada',             qty: 80,  unit: 'g', category: 'Verduras', price: 0.10, cal: 33, carbs: 6.0, protein: 0.7, fat: 0.2, gi: 35, tags: ['gluten_free', 'vegan'] },
  { item: 'Coliflor gratinada',            qty: 120, unit: 'g', category: 'Verduras', price: 0.40, cal: 55, carbs: 4.0, protein: 3.5, fat: 2.5, gi: 15, tags: ['gluten_free'] },
  { item: 'Acelgas rehogadas con ajo',     qty: 100, unit: 'g', category: 'Verduras', price: 0.25, cal: 22, carbs: 2.0, protein: 2.0, fat: 0.5, gi: 10, tags: ['gluten_free', 'vegan'] },
];

// --- LIGHT SIDES (Dinner — low carb) ---
const LIGHT_SIDES = [
  { item: 'Crema de calabacín',          qty: 250, unit: 'ml', category: 'Verduras', price: 0.40, cal: 65,  carbs: 6.0,  protein: 2.5, fat: 3.0, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Ensalada verde con AOVE',     qty: 120, unit: 'g',  category: 'Verduras', price: 0.30, cal: 55,  carbs: 2.0,  protein: 1.0, fat: 4.0, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Verduras al vapor',           qty: 200, unit: 'g',  category: 'Verduras', price: 0.45, cal: 50,  carbs: 6.5,  protein: 3.0, fat: 0.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Gazpacho casero',             qty: 250, unit: 'ml', category: 'Verduras', price: 0.35, cal: 55,  carbs: 5.5,  protein: 1.0, fat: 2.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Ensalada de tomate y pepino', qty: 150, unit: 'g',  category: 'Verduras', price: 0.30, cal: 40,  carbs: 4.5,  protein: 1.0, fat: 1.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Crema de champiñones',        qty: 250, unit: 'ml', category: 'Verduras', price: 0.50, cal: 80,  carbs: 5.0,  protein: 3.0, fat: 4.5, gi: 15, tags: ['gluten_free'] },
  { item: 'Pimientos del piquillo',      qty: 100, unit: 'g',  category: 'Verduras', price: 0.40, cal: 32,  carbs: 4.5,  protein: 1.0, fat: 0.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Ensalada templada de espinacas', qty: 120, unit: 'g', category: 'Verduras', price: 0.40, cal: 45, carbs: 2.5, protein: 2.5, fat: 2.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Crema de puerros',            qty: 250, unit: 'ml', category: 'Verduras', price: 0.40, cal: 70,  carbs: 7.0,  protein: 2.0, fat: 3.0, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Calabacín relleno de verduras', qty: 200, unit: 'g', category: 'Verduras', price: 0.50, cal: 60, carbs: 5.0, protein: 2.5, fat: 2.5, gi: 10, tags: ['gluten_free', 'vegan'] },
  { item: 'Sopa de verduras',            qty: 250, unit: 'ml', category: 'Verduras', price: 0.35, cal: 55,  carbs: 6.0,  protein: 2.0, fat: 1.5, gi: 15, tags: ['gluten_free', 'vegan'] },
  { item: 'Ensalada César (sin picatostes)', qty: 150, unit: 'g', category: 'Verduras', price: 0.55, cal: 70, carbs: 3.0, protein: 4.0, fat: 4.5, gi: 10, tags: ['gluten_free'] },
];

// --- CONDIMENTS / COOKING EXTRAS (added to every main meal) ---
const AOVE = { item: 'Aceite de oliva virgen extra', qty: 10, unit: 'ml', category: 'Despensa', price: 0.08, cal: 88, carbs: 0, protein: 0, fat: 10, gi: 0, tags: ['gluten_free', 'vegan'] };

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/** Calcula IG ponderado por carbohidratos de cada ingrediente */
function weightedGI(ingredients) {
  let totalCarbs = 0;
  let giSum = 0;
  for (const ing of ingredients) {
    totalCarbs += ing.carbs;
    giSum += ing.gi * ing.carbs;
  }
  if (totalCarbs === 0) return 15; // Pure protein meal → very low GI
  return Math.round(giSum / totalCarbs);
}

/** Suma macros y precio de un array de ingredientes */
function sumNutrition(ingredients) {
  let cal = 0, carbs = 0, protein = 0, fat = 0, price = 0;
  for (const i of ingredients) {
    cal += i.cal;
    carbs += i.carbs;
    protein += i.protein;
    fat += i.fat;
    price += i.price;
  }
  return {
    calories: Math.round(cal),
    carbs: +carbs.toFixed(1),
    protein: +protein.toFixed(1),
    fat: +fat.toFixed(1),
    total_price_estimate: +price.toFixed(2),
  };
}

/** Genera suitable_for basado en macros y GI */
function computeSuitableFor(carbs, gi) {
  const suitable = ['sin_diabetes'];

  // Siempre apto para MODY (monitorean pero no restringen tanto)
  if (carbs <= 80 && gi <= 75) suitable.push('mody');

  // Type 2 — evita IG muy alto y carbs excesivos
  if (carbs <= 60 && gi <= 65) suitable.push('type_2');
  else if (carbs <= 70 && gi <= 55) suitable.push('type_2');

  // Gestational — más estricto
  if (carbs <= 50 && gi <= 55) suitable.push('gestational');

  // Type 1 — con insulina pueden comer más, pero alertar si extremo
  if (carbs <= 70) suitable.push('type_1');

  // LADA — similar a Type 1
  if (carbs <= 65) suitable.push('lada');

  return suitable;
}

/** Genera tags dietéticos analizando ingredientes */
function computeTags(ingredients, nutrition) {
  const tags = new Set();

  // Negatives: check if ALL ingredients have the tag
  const hasGlutenFree = ingredients.every(i => (i.tags || []).includes('gluten_free'));
  const hasVegan = ingredients.every(i => (i.tags || []).includes('vegan'));

  if (hasGlutenFree) tags.add('gluten_free');
  if (hasVegan) {
    tags.add('vegan');
    tags.add('vegetarian');
  }

  // Check for specific allergens absence
  const allItems = ingredients.map(i => i.item.toLowerCase()).join(' ');
  if (!allItems.match(/leche|yogur|queso|lácteo|nata|kéfir|requesón|crema/)) tags.add('dairy_free');
  if (!allItems.match(/huevo|tortilla/)) tags.add('egg_free');
  if (!allItems.match(/nuez|almendra|cacahuete|anacardo|frutos secos|avellana/)) tags.add('nut_free');
  if (!allItems.match(/gamba|marisco|mejillón|calamar|langostino|almeja/)) tags.add('seafood_free');

  // Positives
  if (nutrition.protein >= 25) tags.add('high_protein');
  if (nutrition.carbs <= 15) tags.add('low_carb');
  if (nutrition.calories <= 250) tags.add('light');
  if (nutrition.fat <= 8) tags.add('low_fat');

  return [...tags];
}

/** Formatea ingrediente para JSONB (sin macros internos) */
function toJSONBIngredient(ing) {
  return {
    item: ing.item,
    qty: ing.qty,
    unit: ing.unit,
    category: ing.category,
    price: ing.price,
  };
}

// ═══════════════════════════════════════════════════════
// GENERATORS — Un generador por tipo de comida
// ═══════════════════════════════════════════════════════

function generateBreakfast() {
  const base = pick(BREAKFAST_BASES);
  const numToppings = Math.random() > 0.4 ? 2 : 1;
  const toppings = pickN(BREAKFAST_TOPPINGS, numToppings);
  const all = [base, ...toppings];

  const nutrition = sumNutrition(all);
  const gi = weightedGI(all);
  const toppingNames = toppings.map(t => t.item.toLowerCase()).join(' y ');
  const name = `${base.item} con ${toppingNames}`;

  return {
    name,
    type: 'breakfast',
    ...nutrition,
    glycemic_index: gi,
    suitable_for: computeSuitableFor(nutrition.carbs, gi),
    ingredients: all.map(toJSONBIngredient),
    tags: computeTags(all, nutrition),
  };
}

function generateSnack(type) {
  // 60% single item, 40% combo
  let all, name;

  if (Math.random() < 0.6) {
    const item = pick(SNACK_ITEMS);
    all = [item];
    name = item.item;
  } else {
    // Combo: fruit + nut or similar
    const fruit = pick(SNACK_ITEMS.filter(s => s.category === 'Frutas'));
    const nut = pick(SNACK_ITEMS.filter(s => s.category === 'Frutos secos'));
    if (fruit && nut) {
      all = [
        { ...fruit, qty: Math.round(fruit.qty * 0.7), cal: Math.round(fruit.cal * 0.7), carbs: +(fruit.carbs * 0.7).toFixed(1), protein: +(fruit.protein * 0.7).toFixed(1), fat: +(fruit.fat * 0.7).toFixed(1), price: +(fruit.price * 0.7).toFixed(2) },
        { ...nut, qty: Math.round(nut.qty * 0.5), cal: Math.round(nut.cal * 0.5), carbs: +(nut.carbs * 0.5).toFixed(1), protein: +(nut.protein * 0.5).toFixed(1), fat: +(nut.fat * 0.5).toFixed(1), price: +(nut.price * 0.5).toFixed(2) },
      ];
      name = `${fruit.item} con ${nut.item.toLowerCase().replace(/ \(\d+g\)/g, '')}`;
    } else {
      const item = pick(SNACK_ITEMS);
      all = [item];
      name = item.item;
    }
  }

  const nutrition = sumNutrition(all);
  const gi = weightedGI(all);

  return {
    name,
    type,
    ...nutrition,
    glycemic_index: gi,
    suitable_for: computeSuitableFor(nutrition.carbs, gi),
    ingredients: all.map(toJSONBIngredient),
    tags: computeTags(all, nutrition),
  };
}

function generateLunch() {
  const base = pick(MAIN_BASES);
  const protein = pick(MAIN_PROTEINS);
  const veggie = pick(VEGGIES);
  const all = [base, protein, veggie, AOVE];

  const nutrition = sumNutrition(all);
  const gi = weightedGI(all);

  // Dynamic name: "Protein con Base y Veggie"
  const protName = protein.item.replace(/ a la plancha| al horno| salteado[as]?| cocid[ao]s?/g, '');
  const baseName = base.item.replace(/ cocid[ao]s?| asad[ao]s?/g, '');
  const vegName = veggie.item.replace(/ al vapor| salteadas| rehogad[ao]s?| asad[ao]s?| con AOVE| rallada| aliñado con AOVE| gratinada| con ajo/g, '');
  const name = `${protName} con ${baseName.toLowerCase()} y ${vegName.toLowerCase()}`;

  return {
    name,
    type: 'lunch',
    ...nutrition,
    glycemic_index: gi,
    suitable_for: computeSuitableFor(nutrition.carbs, gi),
    ingredients: all.map(toJSONBIngredient),
    tags: computeTags(all, nutrition),
  };
}

function generateDinner() {
  const protein = pick(MAIN_PROTEINS);
  const side = pick(LIGHT_SIDES);
  const all = [protein, side, AOVE];

  const nutrition = sumNutrition(all);
  const gi = weightedGI(all);

  const protName = protein.item.replace(/ a la plancha| al horno| salteado[as]?| cocid[ao]s?/g, '');
  const sideName = side.item;
  const name = `${protName} con ${sideName.toLowerCase()}`;

  return {
    name,
    type: 'dinner',
    ...nutrition,
    glycemic_index: gi,
    suitable_for: computeSuitableFor(nutrition.carbs, gi),
    ingredients: all.map(toJSONBIngredient),
    tags: computeTags(all, nutrition),
  };
}

// ═══════════════════════════════════════════════════════
// BATCH GENERATION — Genera N comidas únicas por tipo
// ═══════════════════════════════════════════════════════

function generateUniqueByType(generator, type, count) {
  const seen = new Set();
  const meals = [];
  let attempts = 0;
  const maxAttempts = count * 10; // safety valve

  while (meals.length < count && attempts < maxAttempts) {
    attempts++;
    const meal = generator(type);
    const key = meal.name.toLowerCase().trim();

    if (!seen.has(key)) {
      seen.add(key);
      meals.push(meal);
    }
  }

  if (meals.length < count) {
    console.warn(`⚠️  Solo se generaron ${meals.length}/${count} para "${type}" (${attempts} intentos)`);
  }

  return meals;
}

// ═══════════════════════════════════════════════════════
// INSERTION — Sube a Supabase en lotes
// ═══════════════════════════════════════════════════════

async function insertBatch(meals, batchNum, totalBatches) {
  const { data, error } = await supabase
    .from('meals')
    .upsert(meals, { onConflict: 'name,type', ignoreDuplicates: true })
    .select('id');

  if (error) {
    console.error(`❌ Batch ${batchNum}/${totalBatches} falló:`, error.message);
    return 0;
  }

  return data?.length || 0;
}

async function uploadMeals(allMeals) {
  const totalBatches = Math.ceil(allMeals.length / BATCH_SIZE);
  let inserted = 0;

  console.log(`\n🚀 Subiendo ${allMeals.length} recetas en ${totalBatches} lotes de ${BATCH_SIZE}...\n`);

  for (let i = 0; i < allMeals.length; i += BATCH_SIZE) {
    const batch = allMeals.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const count = await insertBatch(batch, batchNum, totalBatches);
    inserted += count;

    const pct = ((batchNum / totalBatches) * 100).toFixed(0);
    process.stdout.write(`\r   📦 Lote ${batchNum}/${totalBatches} (${pct}%) — ${inserted} insertados`);
  }

  console.log('\n');
  return inserted;
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  🍽️  GlicoHack — Seed de Recetas');
  console.log('═══════════════════════════════════════');
  console.log(`  Target: ${TARGET_PER_TYPE} recetas × 5 tipos = ${TARGET_PER_TYPE * 5}`);
  console.log(`  Batch size: ${BATCH_SIZE}`);
  console.log(`  Supabase: ${SUPABASE_URL.substring(0, 30)}...`);
  console.log('═══════════════════════════════════════\n');

  const t0 = Date.now();

  // 1. Generate all meals
  console.log('🔄 Generando desayunos...');
  const breakfasts = generateUniqueByType(generateBreakfast, 'breakfast', TARGET_PER_TYPE);
  console.log(`   ✅ ${breakfasts.length} desayunos`);

  console.log('🔄 Generando snacks mañana...');
  const morningSnacks = generateUniqueByType(
    (t) => generateSnack(t), 'morning_snack', TARGET_PER_TYPE
  );
  console.log(`   ✅ ${morningSnacks.length} snacks mañana`);

  console.log('🔄 Generando comidas...');
  const lunches = generateUniqueByType(generateLunch, 'lunch', TARGET_PER_TYPE);
  console.log(`   ✅ ${lunches.length} comidas`);

  console.log('🔄 Generando snacks tarde...');
  const afternoonSnacks = generateUniqueByType(
    (t) => generateSnack(t), 'afternoon_snack', TARGET_PER_TYPE
  );
  console.log(`   ✅ ${afternoonSnacks.length} snacks tarde`);

  console.log('🔄 Generando cenas...');
  const dinners = generateUniqueByType(generateDinner, 'dinner', TARGET_PER_TYPE);
  console.log(`   ✅ ${dinners.length} cenas`);

  const allMeals = [...breakfasts, ...morningSnacks, ...lunches, ...afternoonSnacks, ...dinners];

  // 2. Stats
  console.log('\n📊 Estadísticas de generación:');
  console.log('─────────────────────────────────────');
  for (const type of ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner']) {
    const subset = allMeals.filter(m => m.type === type);
    const avgCal = Math.round(subset.reduce((s, m) => s + m.calories, 0) / subset.length);
    const avgPrice = (subset.reduce((s, m) => s + m.total_price_estimate, 0) / subset.length).toFixed(2);
    const avgGI = Math.round(subset.reduce((s, m) => s + m.glycemic_index, 0) / subset.length);
    console.log(`  ${type.padEnd(18)} → ${subset.length} recetas | ~${avgCal} kcal | ~${avgPrice}€ | IG ~${avgGI}`);
  }
  console.log('─────────────────────────────────────');

  // 3. Upload
  const inserted = await uploadMeals(allMeals);

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log('═══════════════════════════════════════');
  console.log(`  ✅ Completado: ${inserted} recetas insertadas`);
  console.log(`  ⏱️  Tiempo: ${elapsed}s`);
  console.log('═══════════════════════════════════════');
}

main().catch((err) => {
  console.error('\n💥 Error fatal:', err);
  process.exit(1);
});
