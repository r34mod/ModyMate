// ================================================
// BASE DE DATOS DE PLATOS — GlicoHack v2
// Diabetes MODY 2 · NO integral · Compensación carbs
// 20+ platos por categoría para máxima rotación
// ================================================

// ---- DESAYUNOS ----
export const DESAYUNOS = [
  {
    id: 'D01',
    nombre: 'Tostadas de pan blanco con aguacate y huevo revuelto',
    ingredientes: ['pan blanco', 'aguacate', 'huevos', 'aceite de oliva'],
    carbs: 'medio',
  },
  {
    id: 'D02',
    nombre: 'Yogur natural con nueces y canela',
    ingredientes: ['yogur natural', 'nueces', 'canela'],
    carbs: 'bajo',
  },
  {
    id: 'D03',
    nombre: 'Tortilla francesa con jamón york y queso',
    ingredientes: ['huevos', 'jamón york', 'queso', 'aceite de oliva'],
    carbs: 'bajo',
  },
  {
    id: 'D04',
    nombre: 'Pan blanco con tomate y jamón serrano',
    ingredientes: ['pan blanco', 'tomate', 'jamón serrano', 'aceite de oliva'],
    carbs: 'medio',
  },
  {
    id: 'D05',
    nombre: 'Porridge de avena con mantequilla de cacahuete',
    ingredientes: ['copos de avena', 'leche', 'mantequilla de cacahuete', 'canela'],
    carbs: 'medio',
  },
  {
    id: 'D06',
    nombre: 'Tostada con queso fresco y pavo',
    ingredientes: ['pan blanco', 'queso fresco', 'pechuga de pavo', 'aceite de oliva'],
    carbs: 'medio',
  },
  {
    id: 'D07',
    nombre: 'Huevos revueltos con tomate cherry y queso',
    ingredientes: ['huevos', 'queso', 'tomate cherry', 'aceite de oliva'],
    carbs: 'bajo',
  },
  {
    id: 'D08',
    nombre: 'Crepe de avena con plátano y nueces',
    ingredientes: ['copos de avena', 'huevos', 'plátano', 'nueces'],
    carbs: 'medio',
  },
  {
    id: 'D09',
    nombre: 'Tostada con salmón ahumado y queso crema',
    ingredientes: ['pan blanco', 'salmón ahumado', 'queso crema', 'eneldo'],
    carbs: 'medio',
  },
  {
    id: 'D10',
    nombre: 'Bowl de yogur con almendras y fresas',
    ingredientes: ['yogur natural', 'almendras', 'fresas'],
    carbs: 'bajo',
  },
];

// ---- MEDIA MAÑANA / SNACKS ----
export const MEDIA_MANANA = [
  { id: 'MM01', nombre: 'Puñado de nueces (30g)', ingredientes: ['nueces'] },
  { id: 'MM02', nombre: 'Queso fresco con membrillo sin azúcar', ingredientes: ['queso fresco', 'membrillo sin azúcar'] },
  { id: 'MM03', nombre: 'Yogur natural sin azúcar', ingredientes: ['yogur natural'] },
  { id: 'MM04', nombre: 'Jamón serrano (50g)', ingredientes: ['jamón serrano'] },
  { id: 'MM05', nombre: 'Palitos de zanahoria con hummus', ingredientes: ['zanahorias', 'hummus'] },
  { id: 'MM06', nombre: 'Manzana con mantequilla de cacahuete', ingredientes: ['manzana', 'mantequilla de cacahuete'] },
  { id: 'MM07', nombre: 'Mix de almendras y nueces (30g)', ingredientes: ['almendras', 'nueces'] },
  { id: 'MM08', nombre: 'Lonchas de pavo con queso', ingredientes: ['pechuga de pavo', 'queso'] },
  { id: 'MM09', nombre: 'Pepino con queso crema', ingredientes: ['pepino', 'queso crema'] },
  { id: 'MM10', nombre: 'Huevo duro', ingredientes: ['huevos'] },
];

// ---- COMIDAS: CON CARBOHIDRATO BLANCO (flag hasCarbs = true) ----
export const COMIDAS_CARBS = [
  {
    id: 'CC01',
    nombre: 'Arroz blanco con pollo al ajillo',
    ingredientes: ['arroz blanco', 'pechuga de pollo', 'ajo', 'aceite de oliva', 'perejil'],
    hasCarbs: true,
  },
  {
    id: 'CC02',
    nombre: 'Pasta boloñesa de ternera',
    ingredientes: ['pasta', 'carne picada de ternera', 'tomate triturado', 'cebolla', 'zanahoria', 'aceite de oliva'],
    hasCarbs: true,
  },
  {
    id: 'CC03',
    nombre: 'Arroz con salmón a la plancha',
    ingredientes: ['arroz blanco', 'salmón fresco', 'limón', 'aceite de oliva', 'eneldo'],
    hasCarbs: true,
  },
  {
    id: 'CC04',
    nombre: 'Macarrones con atún y tomate',
    ingredientes: ['macarrones', 'atún en lata', 'tomate triturado', 'cebolla', 'aceite de oliva'],
    hasCarbs: true,
  },
  {
    id: 'CC05',
    nombre: 'Arroz con huevo frito y pimientos',
    ingredientes: ['arroz blanco', 'huevos', 'pimiento verde', 'pimiento rojo', 'aceite de oliva'],
    hasCarbs: true,
  },
  {
    id: 'CC06',
    nombre: 'Pasta con gambas al ajillo',
    ingredientes: ['pasta', 'gambas peladas', 'ajo', 'guindilla', 'aceite de oliva', 'perejil'],
    hasCarbs: true,
  },
  {
    id: 'CC07',
    nombre: 'Arroz con ternera en salsa',
    ingredientes: ['arroz blanco', 'ternera', 'cebolla', 'zanahoria', 'tomate', 'aceite de oliva'],
    hasCarbs: true,
  },
  {
    id: 'CC08',
    nombre: 'Fideuá de marisco',
    ingredientes: ['fideos', 'gambas', 'mejillones', 'calamar', 'caldo de pescado', 'alioli'],
    hasCarbs: true,
  },
  {
    id: 'CC09',
    nombre: 'Arroz a la cubana con huevo y tomate',
    ingredientes: ['arroz blanco', 'huevos', 'tomate frito casero', 'aceite de oliva'],
    hasCarbs: true,
  },
  {
    id: 'CC10',
    nombre: 'Pasta con pollo y champiñones',
    ingredientes: ['pasta', 'pechuga de pollo', 'champiñones', 'nata ligera', 'aceite de oliva'],
    hasCarbs: true,
  },
];

// ---- COMIDAS: LEGUMBRES (carbs moderados, pero con fibra) ----
export const COMIDAS_LEGUMBRES = [
  {
    id: 'CL01',
    nombre: 'Lentejas estofadas con chorizo',
    ingredientes: ['lentejas', 'chorizo', 'zanahoria', 'patata', 'cebolla', 'ajo', 'pimentón', 'laurel'],
    hasCarbs: false,
  },
  {
    id: 'CL02',
    nombre: 'Garbanzos con espinacas y huevo',
    ingredientes: ['garbanzos', 'espinacas', 'huevos', 'ajo', 'pimentón', 'aceite de oliva'],
    hasCarbs: false,
  },
  {
    id: 'CL03',
    nombre: 'Alubias blancas con almejas',
    ingredientes: ['alubias blancas', 'almejas', 'cebolla', 'ajo', 'perejil', 'vino blanco'],
    hasCarbs: false,
  },
  {
    id: 'CL04',
    nombre: 'Potaje de lentejas con pollo',
    ingredientes: ['lentejas', 'muslo de pollo', 'zanahoria', 'cebolla', 'tomate', 'aceite de oliva'],
    hasCarbs: false,
  },
  {
    id: 'CL05',
    nombre: 'Ensalada de garbanzos con atún',
    ingredientes: ['garbanzos', 'atún en lata', 'pimiento rojo', 'cebolla morada', 'tomate', 'aceite de oliva'],
    hasCarbs: false,
  },
];

// ---- COMIDAS: VERDURA + PROTEÍNA (Low Carb) ----
export const COMIDAS_VERDURA = [
  {
    id: 'CV01',
    nombre: 'Pollo a la plancha con ensalada mixta',
    ingredientes: ['pechuga de pollo', 'lechuga', 'tomate', 'pepino', 'cebolla', 'aceite de oliva'],
    hasCarbs: false,
  },
  {
    id: 'CV02',
    nombre: 'Merluza al horno con verduras',
    ingredientes: ['merluza', 'calabacín', 'pimiento', 'cebolla', 'tomate', 'aceite de oliva', 'limón'],
    hasCarbs: false,
  },
  {
    id: 'CV03',
    nombre: 'Revuelto de champiñones con gambas',
    ingredientes: ['huevos', 'champiñones', 'gambas peladas', 'ajo', 'aceite de oliva'],
    hasCarbs: false,
  },
  {
    id: 'CV04',
    nombre: 'Pollo al horno con calabacín y berenjena',
    ingredientes: ['muslo de pollo', 'calabacín', 'berenjena', 'aceite de oliva', 'romero'],
    hasCarbs: false,
  },
  {
    id: 'CV05',
    nombre: 'Salmón al papillote con espárragos',
    ingredientes: ['salmón fresco', 'espárragos verdes', 'limón', 'aceite de oliva', 'eneldo'],
    hasCarbs: false,
  },
  {
    id: 'CV06',
    nombre: 'Wok de pollo con verduras salteadas',
    ingredientes: ['pechuga de pollo', 'pimiento rojo', 'calabacín', 'zanahoria', 'salsa de soja'],
    hasCarbs: false,
  },
  {
    id: 'CV07',
    nombre: 'Lubina a la espalda con tomate confitado',
    ingredientes: ['lubina', 'tomate cherry', 'ajo', 'aceite de oliva', 'limón'],
    hasCarbs: false,
  },
];

// ---- MERIENDAS ----
export const MERIENDAS = [
  { id: 'ME01', nombre: 'Yogur natural con almendras', ingredientes: ['yogur natural', 'almendras'] },
  { id: 'ME02', nombre: 'Queso curado con nueces', ingredientes: ['queso curado', 'nueces'] },
  { id: 'ME03', nombre: 'Tostada con aguacate', ingredientes: ['pan blanco', 'aguacate'] },
  { id: 'ME04', nombre: 'Jamón serrano con picos', ingredientes: ['jamón serrano', 'picos de pan'] },
  { id: 'ME05', nombre: 'Batido de yogur con fresas', ingredientes: ['yogur natural', 'fresas'] },
  { id: 'ME06', nombre: 'Puñado de anacardos (30g)', ingredientes: ['anacardos'] },
  { id: 'ME07', nombre: 'Rollitos de pavo con queso crema', ingredientes: ['pechuga de pavo', 'queso crema'] },
  { id: 'ME08', nombre: 'Manzana con canela y nueces', ingredientes: ['manzana', 'canela', 'nueces'] },
  { id: 'ME09', nombre: 'Palitos de apio con hummus', ingredientes: ['apio', 'hummus'] },
  { id: 'ME10', nombre: 'Café con leche y 2 galletas María', ingredientes: ['leche', 'café', 'galletas María'] },
];

// ---- CENAS (Siempre Low Carb: proteína + verdura) ----
export const CENAS_LOW_CARB = [
  {
    id: 'CN01',
    nombre: 'Emperador a la plancha con ensalada',
    ingredientes: ['emperador', 'lechuga', 'tomate', 'aceite de oliva', 'limón'],
  },
  {
    id: 'CN02',
    nombre: 'Tortilla de calabacín y cebolla',
    ingredientes: ['huevos', 'calabacín', 'cebolla', 'aceite de oliva'],
  },
  {
    id: 'CN03',
    nombre: 'Pollo a la plancha con espárragos trigueros',
    ingredientes: ['pechuga de pollo', 'espárragos trigueros', 'ajo', 'aceite de oliva'],
  },
  {
    id: 'CN04',
    nombre: 'Salmón al horno con brócoli',
    ingredientes: ['salmón fresco', 'brócoli', 'aceite de oliva', 'limón'],
  },
  {
    id: 'CN05',
    nombre: 'Revuelto de espárragos con jamón',
    ingredientes: ['huevos', 'espárragos verdes', 'jamón serrano', 'aceite de oliva'],
  },
  {
    id: 'CN06',
    nombre: 'Lubina al horno con verduritas',
    ingredientes: ['lubina', 'calabacín', 'tomate cherry', 'cebolla', 'aceite de oliva'],
  },
  {
    id: 'CN07',
    nombre: 'Pavo a la plancha con champiñones',
    ingredientes: ['pechuga de pavo', 'champiñones', 'ajo', 'aceite de oliva'],
  },
  {
    id: 'CN08',
    nombre: 'Huevos al horno con espinacas y queso',
    ingredientes: ['huevos', 'espinacas', 'queso', 'aceite de oliva'],
  },
  {
    id: 'CN09',
    nombre: 'Dorada a la sal con ensalada verde',
    ingredientes: ['dorada', 'sal gorda', 'lechuga', 'pepino', 'aceite de oliva'],
  },
  {
    id: 'CN10',
    nombre: 'Crema de calabacín con taquitos de pollo',
    ingredientes: ['calabacín', 'cebolla', 'pechuga de pollo', 'aceite de oliva'],
  },
  {
    id: 'CN11',
    nombre: 'Ensalada César con pollo',
    ingredientes: ['lechuga romana', 'pechuga de pollo', 'parmesano', 'aceite de oliva'],
  },
  {
    id: 'CN12',
    nombre: 'Merluza a la plancha con pimientos asados',
    ingredientes: ['merluza', 'pimiento rojo', 'pimiento verde', 'aceite de oliva'],
  },
];

// ---- CENAS LIBRES (cuando comida NO tuvo carbs) ----
export const CENAS_FLEXIBLES = [
  {
    id: 'CF01',
    nombre: 'Tortilla de patatas con ensalada',
    ingredientes: ['huevos', 'patata', 'cebolla', 'lechuga', 'tomate', 'aceite de oliva'],
  },
  {
    id: 'CF02',
    nombre: 'Sandwich de pollo y aguacate',
    ingredientes: ['pan blanco', 'pechuga de pollo', 'aguacate', 'lechuga', 'tomate'],
  },
  {
    id: 'CF03',
    nombre: 'Pizza casera de jamón y queso (porción)',
    ingredientes: ['masa de pizza', 'tomate', 'jamón york', 'queso mozzarella'],
  },
  ...CENAS_LOW_CARB.slice(0, 8), // también puede ser low carb
];
