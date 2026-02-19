---
name: react-patterns-modymate
version: "1.0"
description: "Convenciones y patrones para escribir componentes de React en el proyecto ModyMate."
metadata:
  scope: FILE
  tags: [react, hooks, jsx, state-management, components]
  triggers:
    on_file_create: ["**/src/components/**/*.jsx"]
    on_file_edit: ["**/src/components/**/*.jsx"]
    user_request: ["crea un componente react", "refactoriza este componente", "añade estado a un componente"]
---

# Skill: Patrones de React para ModyMate

Al crear o modificar componentes React (`.jsx`) en este proyecto, sigue estas directrices para mantener la consistencia y la calidad del código.

## 1. Reglas Críticas

-   **SIEMPRE** usa componentes funcionales con Hooks. **NUNCA** uses componentes de clase.
-   **SIEMPRE** nombra los archivos de componentes con `PascalCase.jsx` (ej. `DayCard.jsx`).
-   **SIEMPRE** usa exportaciones nombradas (`export const MiComponente`). **NUNCA** uses `export default`.
-   **NUNCA** escribas lógica compleja o anidada directamente en el JSX. Extráela a funciones auxiliares dentro del componente o a un archivo de utilidades.
-   **SIEMPRE** desestructura las `props` para mayor claridad.
-   **SIEMPRE** añade un `array` de dependencias a los hooks `useEffect`, `useCallback` y `useMemo`. Si no tiene dependencias, usa un array vacío `[]`.

## 2. Estructura de un Componente

Usa esta plantilla como punto de partida para nuevos componentes.

```jsx
import React, { useState, useEffect } from 'react';

// Importa el hook de autenticación si es necesario
import { useAuth } from '../context/useAuth';

// Importa estilos si aplican
// import './MiComponente.css';

export const MiComponente = ({ prop1, prop2 }) => {
    // --- Hooks ---
    const [miEstado, setMiEstado] = useState(null);
    const { user } = useAuth(); // Ejemplo de uso del contexto

    useEffect(() => {
        // Lógica de efectos secundarios (ej. fetching de datos)
        // ...
    }, [prop1]); // Array de dependencias

    // --- Manejadores de eventos ---
    const handleClick = () => {
        // ...
    };

    // --- Renderizado ---
    return (
        <div className="mi-componente">
            <h1>{prop1}</h1>
            <p>Usuario: {user ? user.email : 'No autenticado'}</p>
            <button onClick={handleClick}>Accion</button>
        </div>
    );
};
```

## 3. Gestión de Estado

-   **Estado Local Simple:** Usa `useState` para valores primitivos (strings, booleans, números) o arrays/objetos simples.
-   **Estado Local Complejo:** Para objetos complejos o lógica de estado que depende del estado anterior, usa `useReducer`.
-   **Estado Global (Autenticación):** Para acceder a la información del usuario y el estado de autenticación, **SIEMPRE** usa el hook `useAuth()` que proviene de `src/context/useAuth.js`.
    ```jsx
    import { useAuth } from '../context/useAuth';
    const { user, session, loading } = useAuth();
    ```
-   **Otro Estado Global:** Si necesitas un nuevo estado global (que no sea de autenticación), primero considera si se puede gestionar a nivel de componente padre. Si es realmente necesario, crea un nuevo Context en la carpeta `src/context`.

## 4. Estilos (Styling)

-   El proyecto usa **CSS plano**. Para componentes complejos, crea un archivo `MiComponente.css` y impórtalo. Para estilos globales, modifica `src/index.css`.
-   Utiliza nombres de clase descriptivos y específicos para evitar colisiones (ej. `className="day-card-container"`).

## 5. Mirando a React 19

-   **React Compiler:** Escribe tu código siguiendo estrictamente las reglas de los Hooks. Esto asegurará la compatibilidad futura con el compilador de React, que optimizará los re-renders automáticamente.
-   **Actions:** Cuando se estabilicen las "Actions" de React, úsalas para gestionar los envíos de formularios y las mutaciones de datos, ya que proporcionan estados de pendiente/error de forma nativa.
