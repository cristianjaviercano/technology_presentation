# ROL
Actúa como un Desarrollador Front-End especializado en EdTech (Tecnología Educativa) y un experto en visualización de algoritmos.

# CONTEXTO
Estamos construyendo una aplicación interactiva para el curso de "Optimización de Redes". Ya tenemos el syllabus. Ahora necesitamos crear dos laboratorios interactivos o "mini-juegos" que permitan al estudiante experimentar con los conceptos de la Investigación de Operaciones.

# INSTRUCCIÓN
Diseña la lógica y la estructura de componentes React para dos laboratorios:

1. **Laboratorio de Transporte Heurístico:**
   - Un simulador donde el estudiante debe resolver un problema de transporte balanceado.
   - Debe tener 2 orígenes y 2 destinos con ofertas, demandas y costos fijos.
   - El estudiante usará controles deslizantes (sliders) para modificar las variables de decisión ($x_{ij}$).
   - La aplicación debe calcular en tiempo real el costo total ($Z$) y verificar si se cumplen las restricciones de oferta ($\le$) y demanda ($=$).
   - Muestra alertas dinámicas: "Desbalanceado", "Factible" o "Solución Óptima Encontrada" (basado en el costo mínimo matemático real).

2. **Laboratorio de Algoritmos de Ruta (Dijkstra):**
   - Plantea un diseño conceptual (UI) para visualizar cómo el algoritmo de Dijkstra relaja los arcos iteración tras iteración ($d[v] = \min(d[v], d[u] + w(u,v))$).
   - Incluye controles de "Paso Anterior" y "Siguiente Paso".

# RESTRICCIONES Y TONO
- El código resultante debe integrarse en un entorno React utilizando Tailwind CSS para un diseño limpio, moderno y universitario.
- Los laboratorios no deben parecer infantiles; mantén el rigor y la notación de variables (ej. $x_{ij}$, $Z$).