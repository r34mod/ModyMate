---
name: react-context-modymate
version: "1.1"
description: "Patrones y optimizaciones para el manejo de estado global con React Context."
metadata:
  scope: FILE
  tags: [react, context, state-management, performance]
  triggers:
    on_file_create: ["**/src/context/**/*.js", "**/src/context/**/*.jsx"]
    user_request: ["estado global", "crear context", "compartir estado entre componentes"]
---

# Skill: Estado Global con React Context

Esta guía establece las mejores prácticas para crear y consumir estado global en ModyMate usando la API de Context de React.

## 1. ¿Cuándo Usar React Context?

Usa Context para estado que es verdaderamente "global" o que necesita ser accedido por muchos componentes en diferentes niveles del árbol.

-   **BUENOS CASOS DE USO:**
    -   Estado de autenticación del usuario (ya implementado en `AuthContext`).
    -   Preferencias del usuario (ej. tema claro/oscuro, idioma).
    -   Estado de un "carrito de compras" o planificador de comidas.

-   **MALOS CASOS DE USO (¡EVITAR!):**
    -   Estado que cambia con mucha frecuencia (ej. valores de un input en un formulario). Esto causa re-renders innecesarios en todos los componentes consumidores. Usa estado local (`useState`) en su lugar.
    -   Para reemplazar `props` en uno o dos niveles. Pasar `props` es más simple y predecible.

## 2. Plantilla para un Nuevo Context

Sigue esta estructura para crear un nuevo contexto. Esto garantiza la encapsulación y facilidad de uso.

```javascript
// src/context/MiNuevoContext.js
import React, { createContext, useContext, useState, useMemo } from 'react';

// 1. Crear el Context
const MiNuevoContext = createContext(null);

// 2. Crear el Proveedor (Provider)
export const MiNuevoContextProvider = ({ children }) => {
    const [miEstado, setMiEstado] = useState('valor-inicial');

    const miAccion = () => {
        // Lógica para actualizar el estado
    };

    // 3. Memoizar el valor del context para evitar re-renders innecesarios.
    //    Esta es una optimización CRÍTICA.
    const value = useMemo(() => ({
        miEstado,
        miAccion,
    }), [miEstado]);

    return (
        <MiNuevoContext.Provider value={value}>
            {children}
        </MiNuevoContext.Provider>
    );
};

// 4. Crear el Hook personalizado para consumir el context
export const useMiNuevoContext = () => {
    const context = useContext(MiNuevoContext);
    if (context === null) {
        throw new Error('useMiNuevoContext debe usarse dentro de un MiNuevoContextProvider');
    }
    return context;
};
```

## 3. Integración en la Aplicación

Para que el contexto esté disponible, debes "envolver" el árbol de componentes con tu nuevo proveedor. Hazlo en `src/App.jsx` o `src/main.jsx`.

```jsx
// En App.jsx
import { AuthContextProvider } from './context/AuthContext';
import { MiNuevoContextProvider } from './context/MiNuevoContext';

export const App = () => {
    return (
        <AuthContextProvider>
            <MiNuevoContextProvider>
                {/* El resto de tu aplicación */}
            </MiNuevoContextProvider>
        </AuthContextProvider>
    );
};
```

## 4. Patrones de Optimización Avanzados

Para contextos que gestionan datos más complejos, considera estos patrones para un rendimiento óptimo.

### Separar Estado y Dispatch (`useReducer`)

Si usas `useReducer`, puedes dividir el contexto en dos: uno para el estado y otro para la función `dispatch`. Los componentes que solo necesiten disparar acciones no se volverán a renderizar cuando cambie el estado.

```javascript
const StateContext = createContext(null);
const DispatchContext = createContext(null);

// En el proveedor...
const [state, dispatch] = useReducer(reducer, initialState);

return (
    <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
            {children}
        </DispatchContext.Provider>
    </StateContext.Provider>
);

// Hooks personalizados
export const useMyState = () => useContext(StateContext);
export const useMyDispatch = () => useContext(DispatchContext);
```
