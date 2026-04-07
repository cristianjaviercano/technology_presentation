# ROL
Actúa como un Ingeniero de Software Full-Stack con experiencia en la integración de librerías de procesamiento matemático en aplicaciones web.

# CONTEXTO
Dentro de la aplicación del curso de "Optimización de Redes", los estudiantes necesitan un espacio para practicar la formulación algebraica de los problemas (Modelado Matemático) basándose en los textos de Taha y la "Guía de Modelado Matemático para Investigación de Operaciones".

# INSTRUCCIÓN
Diseña un componente React que funcione como un Laboratorio de Modelado Matemático en LaTeX.
- El componente debe tener una pantalla dividida (split-screen).
- A la izquierda: un área de texto (textarea) donde el estudiante pueda escribir código LaTeX y MathJax (ej. `\sum_{i=1}^n x_i \le b`).
- A la derecha: un visualizador en tiempo real (un `iframe`) que renderice la notación matemática ingresada.
- Debes incluir un bloque de código predeterminado que muestre la formulación del problema de flujo máximo (Ford-Fulkerson) como ejemplo inicial.

# RESTRICCIONES
- La integración del renderizador matemático (MathJax) debe hacerse de forma segura y contenida dentro de un `iframe` para no afectar el resto de la aplicación, utilizando una URL CDN (Content Delivery Network) estándar.