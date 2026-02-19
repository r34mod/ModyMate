---
name: supabase-interactions-modymate
version: "1.1"
description: "Mejores prácticas y patrones para interactuar con Supabase en el proyecto ModyMate."
metadata:
  scope: FILE
  tags: [supabase, data-fetching, database, auth, react]
  triggers:
    on_file_edit: ["**/src/lib/supabaseClient.js", "**/src/components/**/*.jsx", "**/src/utils/**/*.js"]
    user_request: ["supabase", "leer datos", "guardar datos", "actualizar usuario", "llamar a una funcion"]
---

# Skill: Interacciones con Supabase en ModyMate

Esta guía define las convenciones para toda la comunicación cliente-servidor con Supabase.

## 1. Reglas Críticas y Seguridad

-   **SIEMPRE** importa la instancia única del cliente desde `src/lib/supabaseClient.js`. **NUNCA** crees una nueva instancia.
-   **NUNCA** confíes en la entrada del cliente. La integridad de los datos debe ser garantizada por **Políticas de RLS (Row Level Security)** y constraints en la base de datos.
-   **SIEMPRE** maneja explícitamente tanto `data` como `error` en cada llamada a Supabase.
-   **NUNCA** expongas claves privadas (`service_role`) o secretos en el lado del cliente. Cualquier lógica sensible o privilegiada **DEBE** residir en una **Supabase Edge Function**.

## 2. Lectura de Datos (SELECT)

La mejor práctica es encapsular la lógica de fetching en **hooks personalizados** (`use[Recurso]`). Esto centraliza el manejo de estados de carga, error y datos.

### Ejemplo: Hook `useMeals.js`

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useMeals = (userId) => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchMeals = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('meals')
                .select('*')
                .eq('user_id', userId)
                .order('date', { ascending: false });

            if (error) {
                console.error('Error fetching meals:', error);
                setError(error);
            } else {
                setMeals(data);
            }
            setLoading(false);
        };

        fetchMeals();
    }, [userId]);

    return { meals, loading, error };
};
```

## 3. Escritura de Datos (INSERT, UPDATE, DELETE)

Las mutaciones deben ser funciones `async` exportadas, idealmente desde un hook o un servicio, que manejen la llamada y la posterior actualización del estado.

### Ejemplo: Añadir una comida

```javascript
// Dentro de un componente o un hook...
const addMeal = async (mealData) => {
    const { data, error } = await supabase
        .from('meals')
        .insert([mealData])
        .select();

    if (error) {
        console.error('Error inserting meal:', error);
        // Aquí podrías mostrar una notificación al usuario
        return { success: false, error };
    }

    // Opcional: Actualizar el estado local para reflejar el cambio inmediatamente
    // setMeals(prevMeals => [data[0], ...prevMeals]);

    return { success: true, data: data[0] };
};
```

## 4. Subscripciones en Tiempo Real (Realtime)

Usa Realtime para que la UI reaccione a cambios en la base de datos sin necesidad de recargar. **Es crucial limpiar la subscripción** al desmontar el componente para evitar fugas de memoria.

```javascript
useEffect(() => {
    const channel = supabase
        .channel('public:meals')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'meals' },
            (payload) => {
                console.log('Change received!', payload);
                // Aquí, actualiza tu estado local basado en el payload
            }
        )
        .subscribe();

    // --- Limpieza OBLIGATORIA ---
    return () => {
        supabase.removeChannel(channel);
    };
}, []);
```

## 5. Funciones Edge (Supabase Functions)

Para lógica que no debe vivir en el cliente (ej. procesar un pago, enviar un email masivo, cálculos complejos), usa una Edge Function.

```javascript
const { data, error } = await supabase.functions.invoke('menu-generator', {
  body: { userId: '...' },
});

if (error) {
    // Manejar error de la función
}
// Usar data
```
