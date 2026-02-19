# AI Agent Skills para ModyMate

Este directorio contiene **Agent Skills** (Habilidades de Agente) que siguen el [estándar abierto de Agent Skills](https://agentskills.io). Las habilidades proporcionan patrones, convenciones y directrices específicas del dominio que ayudan a los asistentes de codificación de IA a comprender los requisitos específicos del proyecto ModyMate.

## ¿Qué son las Skills?

[Agent Skills](https://agentskills.io) es un formato estándar y abierto para ampliar las capacidades de los agentes de IA con conocimiento especializado. Originalmente desarrollado por Anthropic y liberado como un estándar abierto, ahora es adoptado por múltiples productos de agentes.

Las habilidades enseñan a los asistentes de IA cómo realizar tareas específicas. Cuando una IA carga una habilidad, obtiene contexto sobre:

-   Reglas críticas (qué hacer siempre/nunca).
-   Patrones y convenciones de código.
-   Flujos de trabajo específicos del proyecto.
-   Referencias a documentación detallada.

## Configuración

Para configurar las habilidades en los asistentes de IA soportados, se pueden crear enlaces simbólicos para que cada herramienta encuentre las habilidades en su ubicación esperada.

| Herramienta     | Ubicación del Enlace Simbólico |
|-----------------|--------------------------------|
| Claude Code / OpenCode | `.claude/skills/`              |
| Codex (OpenAI)  | `.codex/skills/`               |
| GitHub Copilot  | `.github/skills/`              |
| Gemini CLI      | `.gemini/skills/`              |

Después de la configuración, reinicia tu asistente de codificación de IA para cargar las habilidades.

## Cómo Usar las Skills

Las habilidades son descubiertas automáticamente por el agente de IA. Para cargar manualmente una habilidad durante una sesión, puedes usar un comando como:

```
Lee skills/{nombre-de-la-habilidad}/SKILL.md
```

## Habilidades Disponibles

### Habilidades Genéricas

Patrones reutilizables para tecnologías comunes utilizadas en este proyecto:

| Habilidad      | Descripción                                      |
|----------------|--------------------------------------------------|
| `react-19`     | Patrones de React 19, React Compiler             |
| `vitest`       | Pruebas unitarias, React Testing Library         |
| `tdd`          | Flujo de trabajo de Desarrollo Guiado por Pruebas (TDD) |
| `zod-4`        | Patrones de la API de Zod 4                      |
| `zustand-5`    | Persistencia, selectores, slices en Zustand      |

### Habilidades Específicas de ModyMate

Patrones diseñados para el desarrollo de ModyMate:

| Habilidad                 | Descripción                                                    |
|---------------------------|----------------------------------------------------------------|
| `modymate`                | Vista general del proyecto, navegación entre componentes       |
| `modymate-supabase`       | Patrones para interactuar con Supabase (Auth, DB, RLS)         |
| `modymate-ui`             | Convenciones de React y componentes (JSX, CSS)                 |
| `modymate-menu-generator` | Cómo funciona y cómo extender el generador de menús            |
| `modymate-data-models`    | Estructuras de datos para comidas, glucosa y perfiles          |
| `modymate-testing`        | Estrategia de testing (Vitest + React Testing Library)         |
| `modymate-pr`             | Convenciones para Pull Requests                                |
| `modymate-docs`           | Guía de estilo para la documentación                           |

### Habilidades Meta

| Habilidad       | Descripción                                      |
|-----------------|--------------------------------------------------|
| `skill-creator` | Crear nuevas habilidades para el agente de IA    |
| `skill-sync`    | Sincronizar metadatos de habilidades con `Agents.md` |

## Estructura del Directorio

```
skills/
├── {skill-name}/
│   ├── SKILL.md              # Requerido - Instrucción principal y metadatos
│   ├── scripts/              # Opcional - Código ejecutable
│   ├── assets/               # Opcional - Plantillas, esquemas, recursos
│   └── references/           # Opcional - Enlaces a documentación local
└── README.md                 # Este archivo
```

## ¿Por qué las Secciones de Auto-invocación?

**Problema**: Los asistentes de IA (Claude, Gemini, etc.) no siempre auto-invocan las habilidades de manera fiable, incluso cuando el `Trigger:` en la descripción de la habilidad coincide con la solicitud del usuario. Tratan las sugerencias de habilidades como "ruido de fondo" y continúan con su enfoque predeterminado.

**Solución**: El archivo `Agents.md` en el directorio raíz contiene una sección de **Auto-invoke Skills** que ordena explícitamente a la IA: "Cuando realices la acción X, SIEMPRE invoca la habilidad Y PRIMERO". Este es un [workaround conocido](https://scottspence.com/posts/claude-code-skills-dont-auto-activate) que fuerza a la IA a cargar las habilidades.

**Automatización**: En lugar de mantener manualmente estas secciones, se puede ejecutar una rutina de sincronización (`skill-sync`) después de crear o modificar una habilidad para actualizar `Agents.md`.

## Creando Nuevas Habilidades

Usa la habilidad `skill-creator` para obtener orientación:

```
Lee skills/skill-creator/SKILL.md
```

### Lista Rápida

1.  Crear directorio: `skills/{nombre-de-la-habilidad}/`
2.  Añadir `SKILL.md` con el frontmatter requerido.
3.  Añadir los campos `metadata.scope` y `metadata.auto_invoke`.
4.  Mantener el contenido conciso (menos de 500 líneas).
5.  Hacer referencia a la documentación existente en lugar de duplicarla.
6.  Ejecutar la rutina de `skill-sync` para actualizar `Agents.md`.
7.  Añadir a la tabla de habilidades de `Agents.md` (si no se genera automáticamente).

## Principios de Diseño

-   **Conciso**: Incluir solo lo que la IA no sabe ya.
-   **Divulgación progresiva**: Apuntar a documentos detallados, no duplicar.
-   **Reglas críticas primero**: Empezar con patrones SIEMPRE/NUNCA.
-   **Ejemplos mínimos**: Mostrar patrones, no tutoriales.

## Recursos

-   [Estándar de Agent Skills](https://agentskills.io) - Especificación del estándar abierto.
-   [GitHub de Agent Skills](https://github.com/anthropics/skills) - Habilidades de ejemplo.
-   [Buenas Prácticas de Claude Code](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) - Guía para la creación de habilidades.
-   [ModyMate Agents.md](../Agents.md) - Reglas generales del agente de IA para este proyecto.
