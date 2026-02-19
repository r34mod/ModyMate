# ModyMate Agent Assistant Guide

## 1. Visión General del Proyecto

ModyMate es una aplicación web de salud y bienestar diseñada para ayudar a los usuarios a gestionar su dieta y monitorizar sus niveles de glucosa. La aplicación permite a los usuarios registrar sus comidas diarias, seguir sus mediciones de glucosa y recibir menús y listas de la compra generados automáticamente. El nombre "ModyMate" sugiere que podría estar enfocado en ayudar a personas con diabetes tipo MODY, una forma monogénica de diabetes.

## 2. Pila Tecnológica (Tech Stack)

-   **Frontend:** React.js (usando sintaxis JSX)
-   **Bundler/Build Tool:** Vite
-   **Backend (BaaS):** Supabase (para autenticación, base de datos y almacenamiento)
-   **Lenguaje:** JavaScript
-   **Estilos:** CSS plano (visto en `index.css`)

## 3. Características Principales (Core Features)

-   **Autenticación de Usuarios:** Registro e inicio de sesión gestionados con Supabase Auth.
-   **Onboarding de Usuario:** Una guía inicial para nuevos usuarios (`Onboarding.jsx`, `OnboardingWizard.jsx`).
-   **Seguimiento Diario:** Los usuarios pueden ver y gestionar sus datos diarios, incluyendo comidas y niveles de glucosa (`DayCard.jsx`, `DayDetail.jsx`).
-   **Monitorización de Glucosa:** Visualización de los niveles de glucosa a lo largo del tiempo mediante gráficos (`GlucoseChart.jsx`).
-   **Generador de Menús:** Una utilidad para crear planes de comidas (`utils/menuGenerator.js`).
-   **Lista de la Compra:** Generación automática de listas de la compra basadas en los menús (`ShoppingList.jsx`).
-   **Gestión de Perfil:** Los usuarios pueden ver y editar su perfil (`Profile.jsx`, `UserProfile.jsx`).

## 4. Estructura del Proyecto

El código fuente principal se encuentra en el directorio `src/`.

-   `src/components/`: Contiene los componentes de React que conforman la interfaz de usuario. Cada componente tiene una responsabilidad específica.
-   `src/context/`: Gestiona el estado global de la aplicación, como el estado de autenticación del usuario (`AuthContext.jsx`).
-   `src/data/`: Almacena datos estáticos o iniciales, como la información de las comidas (`meals.js`).
-   `src/lib/`: Contiene la configuración y el cliente para servicios de terceros, en este caso, Supabase (`supabaseClient.js`).
-   `src/utils/`: Alberga funciones de utilidad y lógica de negocio, como el generador de menús.
-   `src/App.jsx`: Es el componente raíz que ensambla la aplicación.
-   `src/main.jsx`: Es el punto de entrada de la aplicación.

## 5. Cómo Contribuir

Al realizar cambios o añadir nuevas funcionalidades, por favor sigue las convenciones existentes en el código:

1.  **Analiza el código existente:** Antes de escribir nuevo código, explora los componentes y la lógica relacionados para entender los patrones actuales.
2.  **Componentes reutilizables:** Si una nueva UI se puede generalizar, créala como un componente reutilizable en `src/components/`.
3.  **Estado global vs. local:** Usa el `AuthContext` para el estado de autenticación. Para otros estados globales, considera si es necesario un nuevo contexto. Para el estado local de un componente, usa los hooks `useState` o `useReducer`.
4.  **Interactuando con Supabase:** Utiliza el cliente centralizado en `src/lib/supabaseClient.js` para todas las comunicaciones con la base de datos. No instancies un nuevo cliente.
5.  **Mantén la consistencia:** Sigue el estilo de nombrado, formato y estructura de los archivos existentes.
