// ================================================
// BASE DE DATOS DE PLATOS — GlicoHack v4
// Diabetes MODY 2 · Compensación carbs · Alérgenos
// Cada plato incluye: allergens[] para filtrado dinámico
// Alérgenos soportados: gluten, lactosa, frutos_secos, marisco, huevo
// ================================================

// ---- DESAYUNOS ----
export const DESAYUNOS = [
  {
    id: 'D01',
    nombre: 'Tostadas de pan blanco con aguacate y huevo revuelto',
    ingredientes: ['pan blanco', 'aguacate', 'huevos', 'aceite de oliva'],
    allergens: ['gluten', 'huevo'],
    carbs: 'medio',
  },
  {
    id: 'D02',
    nombre: 'Yogur natural con nueces y canela',
    ingredientes: ['yogur natural', 'nueces', 'canela'],
    allergens: ['lactosa', 'frutos_secos'],
    carbs: 'bajo',
  },
  {
    id: 'D03',
    nombre: 'Tortilla francesa con jamón york y queso',
    ingredientes: ['huevos', 'jamón york', 'queso', 'aceite de oliva'],
    allergens: ['huevo', 'lactosa'],
    carbs: 'bajo',
  },
  {
    id: 'D04',
    nombre: 'Pan blanco con tomate y jamón serrano',
    ingredientes: ['pan blanco', 'tomate', 'jamón serrano', 'aceite de oliva'],
    allergens: ['gluten'],
    carbs: 'medio',
  },
  {
    id: 'D05',
    nombre: 'Porridge de avena con mantequilla de cacahuete',
    ingredientes: ['copos de avena', 'leche', 'mantequilla de cacahuete', 'canela'],
    allergens: ['gluten', 'lactosa', 'frutos_secos'],
    carbs: 'medio',
  },
  {
    id: 'D06',
    nombre: 'Tostada con queso fresco y pavo',
    ingredientes: ['pan blanco', 'queso fresco', 'pechuga de pavo', 'aceite de oliva'],
    allergens: ['gluten', 'lactosa'],
    carbs: 'medio',
  },
  {
    id: 'D07',
    nombre: 'Huevos revueltos con tomate cherry y queso',
    ingredientes: ['huevos', 'queso', 'tomate cherry', 'aceite de oliva'],
    allergens: ['huevo', 'lactosa'],
    carbs: 'bajo',
  },
  {
    id: 'D08',
    nombre: 'Crepe de avena con plátano y nueces',
    ingredientes: ['copos de avena', 'huevos', 'plátano', 'nueces'],
    allergens: ['gluten', 'huevo', 'frutos_secos'],
    carbs: 'medio',
  },
  {
    id: 'D09',
    nombre: 'Tostada con salmón ahumado y queso crema',
    ingredientes: ['pan blanco', 'salmón ahumado', 'queso crema', 'eneldo'],
    allergens: ['gluten', 'lactosa'],
    carbs: 'medio',
  },
  {
    id: 'D10',
    nombre: 'Bowl de yogur con almendras y fresas',
    ingredientes: ['yogur natural', 'almendras', 'fresas'],
    allergens: ['lactosa', 'frutos_secos'],
    carbs: 'bajo',
  },
];

// ---- MEDIA MAÑANA / SNACKS ----
export const MEDIA_MANANA = [
  { id: 'MM01', nombre: 'Puñado de nueces (30g)', ingredientes: ['nueces'], allergens: ['frutos_secos'] },
  { id: 'MM02', nombre: 'Queso fresco con membrillo sin azúcar', ingredientes: ['queso fresco', 'membrillo sin azúcar'], allergens: ['lactosa'] },
  { id: 'MM03', nombre: 'Yogur natural sin azúcar', ingredientes: ['yogur natural'], allergens: ['lactosa'] },
  { id: 'MM04', nombre: 'Jamón serrano (50g)', ingredientes: ['jamón serrano'], allergens: [] },
  { id: 'MM05', nombre: 'Palitos de zanahoria con hummus', ingredientes: ['zanahorias', 'hummus'], allergens: [] },
  { id: 'MM06', nombre: 'Manzana con mantequilla de cacahuete', ingredientes: ['manzana', 'mantequilla de cacahuete'], allergens: ['frutos_secos'] },
  { id: 'MM07', nombre: 'Mix de almendras y nueces (30g)', ingredientes: ['almendras', 'nueces'], allergens: ['frutos_secos'] },
  { id: 'MM08', nombre: 'Lonchas de pavo con queso', ingredientes: ['pechuga de pavo', 'queso'], allergens: ['lactosa'] },
  { id: 'MM09', nombre: 'Pepino con queso crema', ingredientes: ['pepino', 'queso crema'], allergens: ['lactosa'] },
  { id: 'MM10', nombre: 'Huevo duro', ingredientes: ['huevos'], allergens: ['huevo'] },
];

// ---- COMIDAS: CON CARBOHIDRATO BLANCO (flag hasCarbs = true) ----
export const COMIDAS_CARBS = [
  {
    id: 'CC01',
    nombre: 'Arroz blanco con pollo al ajillo',
    ingredientes: ['arroz blanco', 'pechuga de pollo', 'ajo', 'aceite de oliva', 'perejil'],
    hasCarbs: true, allergens: [],
  },
  {
    id: 'CC02',
    nombre: 'Pasta boloñesa de ternera',
    ingredientes: ['pasta', 'carne picada de ternera', 'tomate triturado', 'cebolla', 'zanahoria', 'aceite de oliva'],
    hasCarbs: true, allergens: ['gluten'],
  },
  {
    id: 'CC03',
    nombre: 'Arroz con salmón a la plancha',
    ingredientes: ['arroz blanco', 'salmón fresco', 'limón', 'aceite de oliva', 'eneldo'],
    hasCarbs: true, allergens: [],
  },
  {
    id: 'CC04',
    nombre: 'Macarrones con atún y tomate',
    ingredientes: ['macarrones', 'atún en lata', 'tomate triturado', 'cebolla', 'aceite de oliva'],
    hasCarbs: true, allergens: ['gluten'],
  },
  {
    id: 'CC05',
    nombre: 'Arroz con huevo frito y pimientos',
    ingredientes: ['arroz blanco', 'huevos', 'pimiento verde', 'pimiento rojo', 'aceite de oliva'],
    hasCarbs: true, allergens: ['huevo'],
  },
  {
    id: 'CC06',
    nombre: 'Pasta con gambas al ajillo',
    ingredientes: ['pasta', 'gambas peladas', 'ajo', 'guindilla', 'aceite de oliva', 'perejil'],
    hasCarbs: true, allergens: ['gluten', 'marisco'],
  },
  {
    id: 'CC07',
    nombre: 'Arroz con ternera en salsa',
    ingredientes: ['arroz blanco', 'ternera', 'cebolla', 'zanahoria', 'tomate', 'aceite de oliva'],
    hasCarbs: true, allergens: [],
  },
  {
    id: 'CC08',
    nombre: 'Fideuá de marisco',
    ingredientes: ['fideos', 'gambas', 'mejillones', 'calamar', 'caldo de pescado', 'alioli'],
    hasCarbs: true, allergens: ['gluten', 'marisco'],
  },
  {
    id: 'CC09',
    nombre: 'Arroz a la cubana con huevo y tomate',
    ingredientes: ['arroz blanco', 'huevos', 'tomate frito casero', 'aceite de oliva'],
    hasCarbs: true, allergens: ['huevo'],
  },
  {
    id: 'CC10',
    nombre: 'Pasta con pollo y champiñones',
    ingredientes: ['pasta', 'pechuga de pollo', 'champiñones', 'nata ligera', 'aceite de oliva'],
    hasCarbs: true, allergens: ['gluten'],
  },
];

// ---- COMIDAS: LEGUMBRES (carbs moderados, pero con fibra) ----
export const COMIDAS_LEGUMBRES = [
  {
    id: 'CL01',
    nombre: 'Lentejas estofadas con chorizo',
    ingredientes: ['lentejas', 'chorizo', 'zanahoria', 'patata', 'cebolla', 'ajo', 'pimentón', 'laurel'],
    hasCarbs: false, allergens: [],
  },
  {
    id: 'CL02',
    nombre: 'Garbanzos con espinacas y huevo',
    ingredientes: ['garbanzos', 'espinacas', 'huevos', 'ajo', 'pimentón', 'aceite de oliva'],
    hasCarbs: false, allergens: ['huevo'],
  },
  {
    id: 'CL03',
    nombre: 'Alubias blancas con almejas',
    ingredientes: ['alubias blancas', 'almejas', 'cebolla', 'ajo', 'perejil', 'vino blanco'],
    hasCarbs: false, allergens: ['marisco'],
  },
  {
    id: 'CL04',
    nombre: 'Potaje de lentejas con pollo',
    ingredientes: ['lentejas', 'muslo de pollo', 'zanahoria', 'cebolla', 'tomate', 'aceite de oliva'],
    hasCarbs: false, allergens: [],
  },
  {
    id: 'CL05',
    nombre: 'Ensalada de garbanzos con atún',
    ingredientes: ['garbanzos', 'atún en lata', 'pimiento rojo', 'cebolla morada', 'tomate', 'aceite de oliva'],
    hasCarbs: false, allergens: [],
  },
];

// ---- COMIDAS: VERDURA + PROTEÍNA (Low Carb) ----
export const COMIDAS_VERDURA = [
  {
    id: 'CV01',
    nombre: 'Pollo a la plancha con ensalada mixta',
    ingredientes: ['pechuga de pollo', 'lechuga', 'tomate', 'pepino', 'cebolla', 'aceite de oliva'],
    hasCarbs: false, allergens: [],
  },
  {
    id: 'CV02',
    nombre: 'Merluza al horno con verduras',
    ingredientes: ['merluza', 'calabacín', 'pimiento', 'cebolla', 'tomate', 'aceite de oliva', 'limón'],
    hasCarbs: false, allergens: [],
  },
  {
    id: 'CV03',
    nombre: 'Revuelto de champiñones con gambas',
    ingredientes: ['huevos', 'champiñones', 'gambas peladas', 'ajo', 'aceite de oliva'],
    hasCarbs: false, allergens: ['huevo', 'marisco'],
  },
  {
    id: 'CV04',
    nombre: 'Pollo al horno con calabacín y berenjena',
    ingredientes: ['muslo de pollo', 'calabacín', 'berenjena', 'aceite de oliva', 'romero'],
    hasCarbs: false, allergens: [],
  },
  {
    id: 'CV05',
    nombre: 'Salmón al papillote con espárragos',
    ingredientes: ['salmón fresco', 'espárragos verdes', 'limón', 'aceite de oliva', 'eneldo'],
    hasCarbs: false, allergens: [],
  },
  {
    id: 'CV06',
    nombre: 'Wok de pollo con verduras salteadas',
    ingredientes: ['pechuga de pollo', 'pimiento rojo', 'calabacín', 'zanahoria', 'salsa de soja'],
    hasCarbs: false, allergens: ['gluten'],
  },
  {
    id: 'CV07',
    nombre: 'Lubina a la espalda con tomate confitado',
    ingredientes: ['lubina', 'tomate cherry', 'ajo', 'aceite de oliva', 'limón'],
    hasCarbs: false, allergens: [],
  },
];

// ---- MERIENDAS ----
export const MERIENDAS = [
  { id: 'ME01', nombre: 'Yogur natural con almendras', ingredientes: ['yogur natural', 'almendras'], allergens: ['lactosa', 'frutos_secos'] },
  { id: 'ME02', nombre: 'Queso curado con nueces', ingredientes: ['queso curado', 'nueces'], allergens: ['lactosa', 'frutos_secos'] },
  { id: 'ME03', nombre: 'Tostada con aguacate', ingredientes: ['pan blanco', 'aguacate'], allergens: ['gluten'] },
  { id: 'ME04', nombre: 'Jamón serrano con picos', ingredientes: ['jamón serrano', 'picos de pan'], allergens: ['gluten'] },
  { id: 'ME05', nombre: 'Batido de yogur con fresas', ingredientes: ['yogur natural', 'fresas'], allergens: ['lactosa'] },
  { id: 'ME06', nombre: 'Puñado de anacardos (30g)', ingredientes: ['anacardos'], allergens: ['frutos_secos'] },
  { id: 'ME07', nombre: 'Rollitos de pavo con queso crema', ingredientes: ['pechuga de pavo', 'queso crema'], allergens: ['lactosa'] },
  { id: 'ME08', nombre: 'Manzana con canela y nueces', ingredientes: ['manzana', 'canela', 'nueces'], allergens: ['frutos_secos'] },
  { id: 'ME09', nombre: 'Palitos de apio con hummus', ingredientes: ['apio', 'hummus'], allergens: [] },
  { id: 'ME10', nombre: 'Café con leche y 2 galletas María', ingredientes: ['leche', 'café', 'galletas María'], allergens: ['gluten', 'lactosa'] },
];

// ---- CENAS (Siempre Low Carb: proteína + verdura) ----
export const CENAS_LOW_CARB = [
  {
    id: 'CN01',
    nombre: 'Emperador a la plancha con ensalada',
    ingredientes: ['emperador', 'lechuga', 'tomate', 'aceite de oliva', 'limón'],
    allergens: [],
  },
  {
    id: 'CN02',
    nombre: 'Tortilla de calabacín y cebolla',
    ingredientes: ['huevos', 'calabacín', 'cebolla', 'aceite de oliva'],
    allergens: ['huevo'],
  },
  {
    id: 'CN03',
    nombre: 'Pollo a la plancha con espárragos trigueros',
    ingredientes: ['pechuga de pollo', 'espárragos trigueros', 'ajo', 'aceite de oliva'],
    allergens: [],
  },
  {
    id: 'CN04',
    nombre: 'Salmón al horno con brócoli',
    ingredientes: ['salmón fresco', 'brócoli', 'aceite de oliva', 'limón'],
    allergens: [],
  },
  {
    id: 'CN05',
    nombre: 'Revuelto de espárragos con jamón',
    ingredientes: ['huevos', 'espárragos verdes', 'jamón serrano', 'aceite de oliva'],
    allergens: ['huevo'],
  },
  {
    id: 'CN06',
    nombre: 'Lubina al horno con verduritas',
    ingredientes: ['lubina', 'calabacín', 'tomate cherry', 'cebolla', 'aceite de oliva'],
    allergens: [],
  },
  {
    id: 'CN07',
    nombre: 'Pavo a la plancha con champiñones',
    ingredientes: ['pechuga de pavo', 'champiñones', 'ajo', 'aceite de oliva'],
    allergens: [],
  },
  {
    id: 'CN08',
    nombre: 'Huevos al horno con espinacas y queso',
    ingredientes: ['huevos', 'espinacas', 'queso', 'aceite de oliva'],
    allergens: ['huevo', 'lactosa'],
  },
  {
    id: 'CN09',
    nombre: 'Dorada a la sal con ensalada verde',
    ingredientes: ['dorada', 'sal gorda', 'lechuga', 'pepino', 'aceite de oliva'],
    allergens: [],
  },
  {
    id: 'CN10',
    nombre: 'Crema de calabacín con taquitos de pollo',
    ingredientes: ['calabacín', 'cebolla', 'pechuga de pollo', 'aceite de oliva'],
    allergens: [],
  },
  {
    id: 'CN11',
    nombre: 'Ensalada César con pollo',
    ingredientes: ['lechuga romana', 'pechuga de pollo', 'parmesano', 'aceite de oliva'],
    allergens: ['lactosa'],
  },
  {
    id: 'CN12',
    nombre: 'Merluza a la plancha con pimientos asados',
    ingredientes: ['merluza', 'pimiento rojo', 'pimiento verde', 'aceite de oliva'],
    allergens: [],
  },
];

// ---- CENAS LIBRES (cuando comida NO tuvo carbs) ----
export const CENAS_FLEXIBLES = [
  {
    id: 'CF01',
    nombre: 'Tortilla de patatas con ensalada',
    ingredientes: ['huevos', 'patata', 'cebolla', 'lechuga', 'tomate', 'aceite de oliva'],
    allergens: ['huevo'],
  },
  {
    id: 'CF02',
    nombre: 'Sandwich de pollo y aguacate',
    ingredientes: ['pan blanco', 'pechuga de pollo', 'aguacate', 'lechuga', 'tomate'],
    allergens: ['gluten'],
  },
  {
    id: 'CF03',
    nombre: 'Pizza casera de jamón y queso (porción)',
    ingredientes: ['masa de pizza', 'tomate', 'jamón york', 'queso mozzarella'],
    allergens: ['gluten', 'lactosa'],
  },
  ...CENAS_LOW_CARB.slice(0, 8), // también puede ser low carb
];
