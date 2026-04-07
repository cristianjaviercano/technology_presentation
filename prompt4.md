# ROL
Actúa como un Evaluador Académico experto en Investigación de Operaciones y un Arquitecto de Bases de Datos en la Nube (Firebase).

# CONTEXTO
Para finalizar la plataforma del curso "Optimización de Redes", necesitamos un sistema de evaluación que ponga a prueba el rigor teórico de los 4 módulos y que guarde las calificaciones de los estudiantes en la nube.

# INSTRUCCIÓN
1. **Banco de Preguntas:** Crea un examen de selección múltiple con 4 preguntas altamente técnicas, una por cada módulo del curso:
   - Pregunta 1 (Módulo 1): Sobre la unimodularidad total en problemas de transporte.
   - Pregunta 2 (Módulo 2): Sobre la variable *k* en la relación de recurrencia de Floyd-Warshall.
   - Pregunta 3 (Módulo 3): Sobre el Teorema Min-Cut Max-Flow.
   - Pregunta 4 (Módulo 4): Sobre el rol del coeficiente de evaporación ($\rho$) en la metaheurística de Colonia de Hormigas (ACO) para el VRP.

2. **Sistema de Persistencia (React + Firebase):**
   - Escribe el código React para renderizar el examen.
   - Implementa la lógica para calificar el examen (sobre 5.0).
   - Escribe la función para guardar el resultado en Firestore utilizando la ruta de datos privada estricta: `collection(db, 'artifacts', appId, 'users', userId, 'grades')`.
   - Crea una vista de "Mis Calificaciones" que recupere y muestre el historial de evaluaciones del usuario ordenado por fecha de manera descendente (ordenado en memoria, no en la consulta).

# RESTRICCIONES
- Sigue estrictamente las reglas de Firestore para aplicaciones embebidas (autenticación obligatoria antes de consultar, rutas fijas, sin consultas complejas).
- El examen debe exigir comprensión profunda de los textos base proporcionados en la bibliografía.