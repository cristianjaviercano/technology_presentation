import React, { useState } from 'react';

const C = ({ color='emerald', title, children }) => {
  const cls = {
    emerald:'border-emerald-500 bg-emerald-500/5',
    blue:'border-blue-500 bg-blue-500/5',
    yellow:'border-yellow-500 bg-yellow-500/5',
    red:'border-red-500 bg-red-500/5',
    purple:'border-purple-500 bg-purple-500/5',
  }[color];
  return (
    <div className={`border-l-4 rounded-r-xl p-4 my-3 ${cls}`}>
      {title && <p className="font-bold text-sm text-slate-200 mb-1">{title}</p>}
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
};

const S = ({ t, children }) => (
  <div className="mb-5">
    <h3 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
      <span className="w-1 h-4 bg-emerald-500 rounded-full inline-block flex-shrink-0" />{t}
    </h3>
    <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
  </div>
);

const F = ({ label, children }) => (
  <div className="my-3 bg-slate-900 border border-slate-700 rounded-xl p-4">
    {label && <p className="text-xs font-mono text-slate-500 mb-2">{label}</p>}
    <p className="font-mono text-emerald-400 text-center text-sm leading-loose">{children}</p>
  </div>
);

const THEORY_TABS = [
  ['complexity','🔬 Complejidad'],
  ['landscape','🏔️ Paisajes'],
  ['nfl','🎲 No Free Lunch'],
  ['sa_theory','📐 SA Formal'],
  ['tabu_theory','🗃️ Tabú Formal'],
  ['aco_theory','🐜 ACO Formal'],
  ['cpm_ext','📅 CPM Avanzado'],
  ['vrp_bounds','📦 VRP Bounds'],
];

export default function Module4Theory() {
  const [tab, setTab] = useState('complexity');
  return (
    <div className="space-y-5">
      <div className="bg-purple-500/5 border border-purple-500/30 rounded-2xl p-5">
        <p className="text-xs font-mono text-purple-400">MÓDULO 4 · APÉNDICE TEÓRICO</p>
        <h2 className="text-2xl font-black text-white mt-1">Fundamentos Matemáticos Avanzados</h2>
        <p className="text-slate-400 text-sm mt-1">Teoría de complejidad · Paisajes de aptitud · Convergencia estocástica · CPM crashing · Cotas VRP</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-1">
        {THEORY_TABS.map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t transition-colors
              ${tab===id ? 'text-purple-400 bg-slate-800 border-b-2 border-purple-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── COMPLEJIDAD ──────────────────────────────────────────────── */}
      {tab === 'complexity' && (
        <div className="space-y-4">
          <S t="Clases de Complejidad — La Jerarquía Fundamental">
            <p>La teoría de la complejidad computacional clasifica los problemas según los recursos (tiempo, espacio) que requieren los mejores algoritmos conocidos para resolverlos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['P','Problemas resolubles en tiempo polinomial O(nᵏ). Un algoritmo determinístico los resuelve eficientemente. Ej: Dijkstra O(E log V), Simplex (polynomial en promedio).','text-blue-400','border-blue-500/30'],
                ['NP','Problemas cuya solución se puede *verificar* en tiempo polinomial. Todo problema P ⊆ NP. Ej: TSP, VRP, CVRP, Job-Shop Scheduling.','text-yellow-400','border-yellow-500/30'],
                ['NP-Completo','El subconjunto más difícil de NP: todo problema NP se reduce a ellos en tiempo polinomial. Si uno se resuelve en P, todos lo son. Ej: SAT (Cook 1971), 3-SAT, Clique.','text-orange-400','border-orange-500/30'],
                ['NP-Hard','Al menos tan difícil como NP-Completo, pero no necesariamente en NP (pueden no tener verificación eficiente). Ej: TSP optimización, VRP, Bin Packing.','text-red-400','border-red-500/30'],
              ].map(([n,d,c,b]) => (
                <div key={n} className={`card border ${b}`}>
                  <p className={`font-black text-lg ${c}`}>{n}</p>
                  <p className="text-xs text-slate-400 mt-1">{d}</p>
                </div>
              ))}
            </div>
          </S>

          <S t="Reducción Polinomial — Cómo Probar que un Problema es NP-Hard">
            <p>Para demostrar que el problema X es NP-Hard, se muestra una <strong className="text-white">reducción polinomial</strong> de un problema NP-Hard conocido Y a X: si Y ≤ₚ X, entonces X es al menos tan difícil como Y.</p>
            <C color="blue" title="Cadena de reducciones clave (Cook–Karp, 1972)">
              SAT →ₚ 3-SAT →ₚ Clique →ₚ Independent Set →ₚ Vertex Cover →ₚ <strong>Hamiltonian Cycle</strong> →ₚ <strong>TSP</strong>
            </C>
            <p>La reducción de Hamiltonian Cycle a TSP es directa: dado un grafo G, construir una instancia TSP donde w(i,j)=0 si (i,j)∈G y w(i,j)=1 si no. Un tour de costo 0 existe si y solo si G tiene un ciclo hamiltoniano. QED.</p>
          </S>

          <S t="Grado de Aproximabilidad — ¿Cuánto nos acercamos al óptimo?">
            <p>Dado que los problemas NP-Hard son intratables, una pregunta razonable es: ¿qué tan cerca del óptimo podemos garantizar llegar en tiempo polinomial?</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-800 text-slate-400">
                  <th className="px-3 py-2 text-left">Problema</th>
                  <th className="px-3 py-2">Mejor garantía</th>
                  <th className="px-3 py-2 text-left">Algoritmo</th>
                  <th className="px-3 py-2 text-left">Condición</th>
                </tr></thead>
                <tbody>
                  {[
                    ['TSP métrico','3/2 · OPT','Christofides (1976)','Distancias simétricas y desigualdad triangular'],
                    ['TSP general','No aproximable','—','A menos que P=NP (Sahni & Gonzalez 1976)'],
                    ['VRP con capacidad','1 + ε','PTAS','Solo si rutas homogéneas y demanda uniforme'],
                    ['Bin Packing','1.5 · OPT','First Fit Decreasing','Asintótico cuando n→∞'],
                    ['Job Shop','O(log n)²','Semidefinite relax.','log-aproximado'],
                  ].map(r => (
                    <tr key={r[0]} className="border-b border-slate-800 hover:bg-slate-800/20">
                      <td className="px-3 py-2 text-emerald-400 font-semibold">{r[0]}</td>
                      <td className="px-3 py-2 text-center text-yellow-400 font-mono">{r[1]}</td>
                      <td className="px-3 py-2 text-slate-300">{r[2]}</td>
                      <td className="px-3 py-2 text-slate-400">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <C color="red" title="Resultado de inaproximabilidad del TSP general">
              Si existe un algoritmo polinomial con factor de aproximación α para el TSP sin desigualdad triangular, entonces P=NP. Prueba: toda instancia de Hamiltonian Cycle puede codificarse como TSP con pesos 1 y α·n, forzando que cualquier aproximación α distinga tours de costo n (hamiltoniano) vs n+1 (no hamiltoniano).
            </C>
          </S>
        </div>
      )}

      {/* ── PAISAJES ─────────────────────────────────────────────────── */}
      {tab === 'landscape' && (
        <div className="space-y-4">
          <S t="Paisajes de Aptitud (Fitness Landscapes) — Kauffman 1993">
            <p>Un <strong className="text-white">paisaje de aptitud</strong> es una representación geométrica del espacio de búsqueda: cada punto es una solución, la altitud es su calidad (fitness), y los vecinos son las soluciones alcanzables con un movimiento simple.</p>
            <C color="blue" title="Definición formal (Wright 1932; Kauffman 1993)">
              Un paisaje L = (S, N, f) donde S es el espacio de soluciones, N: S→2^S es la función de vecindad, y f: S→R es la función objetivo. Un óptimo local s* satisface f(s*) ≤ f(s') para todo s' ∈ N(s*).
            </C>
          </S>

          <S t="Propiedades de los Paisajes — Rugosidad y Engañosidad">
            <div className="space-y-3">
              <div className="card">
                <h4 className="font-bold text-slate-200 text-sm mb-2">Rugosidad (Ruggedness)</h4>
                <p className="text-xs text-slate-400">Un paisaje rugoso tiene muchos óptimos locales. Se mide por la correlación de aptitud entre soluciones vecinas — cuando cae rápido, el paisaje es caótico. Los TSP de gran tamaño tienen paisajes extremadamente rugosos. Metaheurísticas como SA son especialmente útiles aquí porque su criterio de Metropolis les permite "saltar" de un valle a otro.</p>
              </div>
              <div className="card">
                <h4 className="font-bold text-slate-200 text-sm mb-2">Engañosidad (Deceptiveness)</h4>
                <p className="text-xs text-slate-400">Un paisaje es engañoso cuando el gradiente local apunta en dirección contraria al óptimo global. Los algoritmos puramente greedy son especialmente vulnerables: los mejores pasos locales los alejan del óptimo. Los algoritmos genéticos fueron diseñados específicamente para combatir paisajes engañosos mediante recombinación.</p>
              </div>
              <div className="card">
                <h4 className="font-bold text-slate-200 text-sm mb-2">Neutralidad</h4>
                <p className="text-xs text-slate-400">Cuando muchas soluciones tienen el mismo fitness (redes neutras), la búsqueda deriva aleatoriamente. Ocurre frecuentemente en TSP con distancias enteras. La Búsqueda Tabú maneja bien la neutralidad al forzar movimientos incluso sin mejora.</p>
              </div>
            </div>
          </S>

          <S t="Número de Óptimos Locales — Análisis Estadístico">
            <p>Para el TSP con n ciudades y operador 2-opt, el número esperado de óptimos locales 2-opt crece <strong className="text-white">exponencialmente</strong> con n. Experimentalmente:</p>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-xs">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-slate-500">n = 10</p><p className="text-emerald-400 font-bold">~6 óptimos locales 2-opt</p></div>
                <div><p className="text-slate-500">n = 20</p><p className="text-yellow-400 font-bold">~10³ óptimos locales</p></div>
                <div><p className="text-slate-500">n = 50</p><p className="text-red-400 font-bold">~10⁸ óptimos locales</p></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">Fuente: Aarts & Lenstra (1997), "Local Search in Combinatorial Optimization". Esto justifica el uso de metaheurísticas: escapar de un óptimo local nunca es gratuito.</p>
          </S>
        </div>
      )}

      {/* ── NO FREE LUNCH ────────────────────────────────────────────── */}
      {tab === 'nfl' && (
        <div className="space-y-4">
          <S t="Teorema de No Free Lunch (NFL) — Wolpert &amp; Macready, 1997">
            <C color="purple" title="Enunciado formal del NFL">
              Para cualquier par de algoritmos de búsqueda/optimización A₁ y A₂, si se promedian sus rendimientos sobre <strong>todos los posibles problemas de optimización</strong>, ambos tienen rendimiento <em>exactamente igual</em>. No existe un algoritmo universalmente superior.
            </C>
            <p>Formalmente: si f es elegida uniformemente de todas las funciones f: X→Y, entonces</p>
            <F label="Promedio sobre todos los problemas:">{'E[f(x*) | A₁, f] = E[f(x*) | A₂, f]'}</F>
            <p>donde x* es la mejor solución encontrada en t evaluaciones.</p>
          </S>

          <S t="Implicaciones Prácticas del NFL">
            <div className="space-y-2">
              {[
                ['Lo que el NFL NO dice','No dice que todos los algoritmos sean iguales en problemas específicos. TSP tiene estructura (desigualdad triangular) que ACO explota mejor que un random walk.'],
                ['Lo que el NFL SÍ dice','Para diseñar un buen algoritmo, se debe explotar conocimiento específico del dominio. La estructura del problema es información que los operadores (2-opt, cruce de rutas) deben incorporar.'],
                ['Consecuencia para el diseño','Los operadores de vecindad y mutación de una metaheurística deben reflejar el dominio: para VRP, la inversión de segmento es relevante; para scheduling, el intercambio de tareas es apropiado.'],
                ['Consecuencia para la comparación','Comparar algoritmos sin fijar el dominio del problema es estadísticamente inválido. Los rankings de metaheurísticas solo son válidos dentro de una clase de problemas específica.'],
              ].map(([t,d]) => (
                <div key={t} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <p className="font-bold text-slate-200 text-sm">{t}</p>
                  <p className="text-xs text-slate-400 mt-1">{d}</p>
                </div>
              ))}
            </div>
          </S>

          <S t="Críticas y Limitaciones del NFL en Optimización Continua">
            <p>El NFL fue formulado para funciones discretas. En optimización continua (funciones sobre R^n), Igel &amp; Toussaint (2004) demostraron que el NFL <strong className="text-white">no se aplica en la misma forma</strong>, dado que el espacio de funciones continuas no es cerrado bajo permutaciones. Sin embargo, la intuición de incorporar conocimiento del dominio permanece válida.</p>
            <C color="yellow" title="Corolario práctico para Ingeniería Industrial">
              En problemas de logística real (VRP, TSP, scheduling), los datos tienen estructura geométrica y temporal que los algoritmos genéricos no conocen. Incorporar restricciones de ventanas de tiempo, capacidad y secuenciación directamente en los operadores de vecindad produce mejoras de 15–40% frente a operadores genéricos.
            </C>
          </S>
        </div>
      )}

      {/* ── SA FORMAL ────────────────────────────────────────────────── */}
      {tab === 'sa_theory' && (
        <div className="space-y-4">
          <S t="Recocido Simulado como Cadena de Markov">
            <p>El proceso estocástico de SA puede modelarse formalmente como una <strong className="text-white">cadena de Markov homogénea</strong> a temperatura fija T. La probabilidad de transición de estado i a estado j es:</p>
            <F label="Probabilidad de transición P(i→j) a temperatura T:">
              {'P(i→j) = (1/|N(i)|) · min(1, e^(-(f(j)-f(i))/T))'}
            </F>
            <p>donde |N(i)| es el tamaño de la vecindad de i. Esta cadena tiene una distribución estacionaria de Boltzmann:</p>
            <F label="Distribución de Boltzmann (distribución límite a temperatura T):">
              {'π_T(i) = e^(-f(i)/T) / Z(T)     donde Z(T) = Σⱼ e^(-f(j)/T)'}
            </F>
            <C color="blue" title="Implicación teórica">
              Cuando T→0, la distribución de Boltzmann concentra toda su masa en los estados de mínimo costo (óptimos globales). Esto garantiza que, si T decrece suficientemente despacio, SA <strong>converge al óptimo global con probabilidad 1</strong>.
            </C>
          </S>

          <S t="Esquemas de Enfriamiento — Análisis Formal">
            <div className="space-y-3">
              {[
                {
                  name: 'Boltzmann / Logarítmico',
                  formula: 'T(k) = T₀ / ln(1 + k)',
                  conv: 'Convergencia garantizada al óptimo global',
                  pros: 'Garantía teórica de convergencia',
                  cons: 'Decrecimiento extremadamente lento — impráctica para instancias grandes',
                },
                {
                  name: 'Geométrico (más común)',
                  formula: 'T(k) = T₀ · αᵏ   con α ∈ (0.9, 0.999)',
                  conv: 'Sin garantía teórica — óptimo local de alta calidad',
                  pros: 'Rápido, fácil de implementar, buen rendimiento empírico',
                  cons: 'α muy alto: búsqueda demasiado lenta. α muy bajo: convergencia prematura',
                },
                {
                  name: 'Cauchy / Rápido',
                  formula: 'T(k) = T₀ / (1 + k)',
                  conv: 'Convergencia garantizada bajo condiciones específicas (Szu & Hartley 1987)',
                  pros: 'Más rápido que Boltzmann con garantía similar',
                  cons: 'Requiere operador de perturbación con distribución de Cauchy',
                },
              ].map(s => (
                <div key={s.name} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-200 text-sm">{s.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${s.conv.includes('garantía') && !s.conv.includes('Sin') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                      {s.conv.includes('Sin') ? 'Sin garantía' : '✓ Garantizado'}
                    </span>
                  </div>
                  <p className="font-mono text-emerald-400 text-xs mb-2">{s.formula}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><p className="text-green-400">↑ {s.pros}</p></div>
                    <div><p className="text-red-400">↓ {s.cons}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </S>

          <S t="Selección de Temperatura Inicial — Regla del 80%">
            <p>Una regla práctica ampliamente usada: elegir T₀ tal que aproximadamente el <strong className="text-white">80% de las soluciones peores sean aceptadas</strong> al inicio. Esto garantiza suficiente exploración del espacio al principio.</p>
            <F label="Temperatura inicial sugerida (White & Ingber):">
              {'T₀ = -Δf_avg / ln(χ₀)     con χ₀ = 0.80'}
            </F>
            <p>donde Δf_avg es el empeoramiento promedio observado en una muestra aleatoria de movimientos. En la práctica, muestrear 100–500 movimientos aleatorios y calcular Δf_avg es suficiente.</p>
          </S>
        </div>
      )}

      {/* ── TABU FORMAL ──────────────────────────────────────────────── */}
      {tab === 'tabu_theory' && (
        <div className="space-y-4">
          <S t="Estructura de Memoria Adaptativa — Los Tres Niveles">
            <p>Glover (1989, 1990) definió Tabu Search como un sistema de <strong className="text-white">memoria adaptativa</strong> con tres horizontes temporales, cada uno con una función distinta:</p>
            <div className="space-y-3">
              {[
                {
                  l: 'Memoria de Corto Plazo (Short-Term)',
                  color: 'text-red-400',
                  bg: 'border-red-500/20',
                  desc: 'La lista tabú clásica. Almacena los movimientos recientes (recencia) y los prohíbe durante "tenure" iteraciones. Evita el ciclaje inmediato y fuerza exploración local.',
                  comp: 'Complejidad: O(tenure × |N(s)|) por iteración'
                },
                {
                  l: 'Memoria de Mediano Plazo (Intermediate-Term)',
                  color: 'text-yellow-400',
                  bg: 'border-yellow-500/20',
                  desc: 'Registro de frecuencia de componentes en soluciones de alta calidad (elite solutions). La intensificación usa esta memoria para retornar a regiones prometedoras y explorarlas en profundidad.',
                  comp: 'Complejidad: O(|S|) espacio para frecuencias acumuladas'
                },
                {
                  l: 'Memoria de Largo Plazo (Long-Term)',
                  color: 'text-blue-400',
                  bg: 'border-blue-500/20',
                  desc: 'Registro de frecuencia de componentes en todas las soluciones visitadas. La diversificación penaliza componentes muy frecuentes para forzar exploración de regiones no visitadas.',
                  comp: 'Estrategia: "strategic oscillation" entre regiones factibles e infactibles'
                },
              ].map(m => (
                <div key={m.l} className={`card border ${m.bg}`}>
                  <p className={`font-bold text-sm ${m.color}`}>{m.l}</p>
                  <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                  <p className="text-xs font-mono text-slate-500 mt-2">{m.comp}</p>
                </div>
              ))}
            </div>
          </S>

          <S t="Criterio de Aspiración — Formalización">
            <p>El criterio de aspiración <strong className="text-white">anula</strong> la prohibición tabú cuando la solución resultante supera el mejor global conocido. La versión estándar:</p>
            <F label="Criterio de aspiración A(s'):">
              {'Aceptar movimiento tabú m que produce s\' si y solo si f(s\') < f(s_best)'}
            </F>
            <p>Existen criterios de aspiración más sofisticados: por influencia (acepta si el atributo tabú contribuye positivamente), por defecto (acepta si no hay vecino no-tabú disponible) y por tiempo (acepta si el movimiento lleva mucho tiempo prohibido).</p>
          </S>

          <S t="Selección del Tenure — Análisis Teórico">
            <p>El tenure determina cuántas iteraciones un movimiento permanece prohibido. Un tenure incorrecto puede causar:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="card border-red-500/20">
                <p className="font-bold text-red-400 text-sm">Tenure demasiado pequeño</p>
                <p className="text-xs text-slate-400 mt-1">Ciclaje: el algoritmo regresa a soluciones recientes. La memoria de corto plazo no es suficiente para impedir la reversión de movimientos.</p>
                <p className="text-xs text-yellow-400 mt-2 font-mono">Síntoma: la solución oscila entre 2-3 estados.</p>
              </div>
              <div className="card border-blue-500/20">
                <p className="font-bold text-blue-400 text-sm">Tenure demasiado grande</p>
                <p className="text-xs text-slate-400 mt-1">Sobre-restricción: demasiados movimientos prohibidos, el algoritmo no puede explorar. La vecindad efectiva se reduce drásticamente.</p>
                <p className="text-xs text-yellow-400 mt-2 font-mono">Síntoma: convergencia prematura o estancamiento.</p>
              </div>
            </div>
            <C color="emerald" title="Regla empírica para el tenure (Dell'Amico & Trubian 1993)">
              Para TSP y VRP con n ciudades: tenure ~ √n. Para scheduling con n trabajos: tenure ~ n/5. Algunos autores usan <strong>tenure reactivo</strong> (varía dinámicamente): si se detecta ciclaje, aumentar tenure; si el algoritmo se estanca, reducirlo.
            </C>
          </S>
        </div>
      )}

      {/* ── ACO FORMAL ───────────────────────────────────────────────── */}
      {tab === 'aco_theory' && (
        <div className="space-y-4">
          <S t="Estigmergia — Base Biológica y Formal">
            <p>La estigmergia (Grassé 1959) es la comunicación indirecta a través de modificaciones del entorno. Las hormigas no se comunican directamente; depositan feromonas en el suelo que guían el comportamiento de otras hormigas.</p>
            <C color="blue" title="Fundamento matemático de la convergencia por estigmergia">
              El proceso de amplificación positiva (refuerzo de buenas rutas) combinado con evaporación (olvido de rutas malas) crea un sistema de retroalimentación que converge hacia las rutas de menor costo. Esto es análogo a los sistemas de ecuaciones diferenciales de campo medio usados en física estadística.
            </C>
          </S>

          <S t="Análisis de Convergencia del ACO — Marco Teórico">
            <p>Stützle &amp; Dorigo (2002) probaron la convergencia del ACO bajo condiciones específicas. Definen la condición de convergencia como:</p>
            <F label="Condición de convergencia (Stützle & Dorigo 2002):">
              {'∃ t* : ∀ t > t*, P(mejor_tour_encontrado = óptimo) → 1'}
            </F>
            <p>Esta convergencia se garantiza si: (1) la feromona τᵢⱼ tiene un mínimo positivo τ_min &gt; 0, y (2) la regla de actualización incluye refuerzo de la mejor solución global (como en MMAS). Sin estas condiciones, la convergencia prematura a un óptimo local es probable.</p>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-800 text-slate-400">
                  <th className="px-3 py-2 text-left">Variante</th>
                  <th className="px-3 py-2">Actualización τ</th>
                  <th className="px-3 py-2">Convergencia</th>
                  <th className="px-3 py-2 text-left">Fortaleza</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Ant System (AS)','Todas las hormigas','No garantizada','Exploración balanceada'],
                    ['Ant Colony System (ACS)','Solo mejor hormiga (global-best)','Sí (con τ_min)','Explotación: mejor para pequeños n'],
                    ['MAX-MIN AS (MMAS)','Solo mejor hormiga + límites [τ_min,τ_max]','Sí (teórica)','Reactivación automática si estanca'],
                    ['Rank-Based AS','Top-r hormigas ponderadas por rango','Sí','Balance explotación/exploración'],
                  ].map(r => (
                    <tr key={r[0]} className="border-b border-slate-800 hover:bg-slate-800/20">
                      {r.map((c,i) => <td key={i} className={`px-3 py-2 ${i===0?'text-emerald-400 font-semibold':i===2?'text-yellow-400 text-center':'text-slate-400'}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>

          <S t="Límites de Feromona en MMAS — Derivación">
            <p>En MMAS, los límites τ_max y τ_min se calculan a partir de la solución óptima (o la mejor conocida), la tasa de evaporación ρ y el número de hormigas m:</p>
            <F label="Límite superior de feromona τ_max:">
              {'τ_max = 1 / (ρ · f(s_best))'}
            </F>
            <F label="Límite inferior de feromona τ_min (Stützle & Hoos 2000):">
              {'τ_min = τ_max · (1 - P_best^(1/n)) / ((avg-1) · P_best^(1/n))'}
            </F>
            <p className="text-xs text-slate-400">donde P_best es la probabilidad deseada de que la mejor hormiga construya la solución óptima (típicamente 0.05), n el número de ciudades, y avg el número promedio de opciones por nodo.</p>
          </S>
        </div>
      )}

      {/* ── CPM AVANZADO ─────────────────────────────────────────────── */}
      {tab === 'cpm_ext' && (
        <div className="space-y-4">
          <S t="Crashing — Análisis Costo-Tiempo (Time-Cost Trade-off)">
            <p>En muchos proyectos es posible acortar la duración de actividades aumentando recursos (personal, equipos). El análisis de crashing determina qué actividades acortar para reducir el makespan al mínimo costo.</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">Costo de crashing por unidad de tiempo actividad i:</p>
                <p className="font-mono text-emerald-400">CCᵢ = (Cᵢᶜ - Cᵢⁿ) / (tᵢⁿ - tᵢᶜ)</p>
                <p className="text-xs text-slate-400 mt-1">ⁿ = normal, ᶜ = crash</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-500 mb-2">Problema de optimización:</p>
                <p className="font-mono text-emerald-400">min Σᵢ CCᵢ · yᵢ</p>
                <p className="text-xs text-slate-400 mt-1">s.a. makespan ≤ T_objetivo</p>
              </div>
            </div>
            <p>El algoritmo de crashing es greedy: en cada paso, acortar la actividad crítica de menor costo por unidad. Cuando hay múltiples rutas críticas, se deben acortar simultáneamente actividades en todas ellas.</p>
            <C color="yellow" title="Ejemplo: Red de 5 actividades">
              Si la ruta crítica A→B→E tiene duración 18 semanas y se necesita completar en 16 semanas, se debe reducir 2 semanas. Si CCB=500 $/sem y CCE=800 $/sem, crashear B 2 semanas cuesta $1000 (más barato que crashear E).
            </C>
          </S>

          <S t="Probabilidad de Completar en Plazo — Análisis PERT">
            <p>Dado que PERT modela incertidumbre, podemos calcular la probabilidad de completar el proyecto antes de una fecha T usando el Teorema Central del Límite:</p>
            <F label="Tiempo de proyecto: distribución aproximada (por TCL)">
              {'TC ≈ Normal(μ_TC, σ_TC²)     con μ_TC = Σ E[tᵢ],  σ²_TC = Σ Var[tᵢ]  (ruta crítica)'}
            </F>
            <F label="P(completar antes de T):">
              {'P(TC ≤ T) = Φ( (T - μ_TC) / σ_TC )'}
            </F>
            <p>donde Φ es la función de distribución acumulada de la normal estándar. Esta aproximación es válida cuando la ruta crítica tiene suficientes actividades independientes (generalmente ≥ 5).</p>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-mono">
              <p className="text-slate-400 mb-2">Ejemplo numérico (μ=15 sem, σ=1.0 sem):</p>
              <p className="text-emerald-400">P(TC ≤ 16) = Φ((16-15)/1.0) = Φ(1.0) ≈ <strong>84.1%</strong></p>
              <p className="text-emerald-400">P(TC ≤ 14) = Φ((14-15)/1.0) = Φ(-1.0) ≈ <strong>15.9%</strong></p>
              <p className="text-emerald-400">P(TC ≤ 15) = Φ(0) = <strong>50.0%</strong></p>
            </div>
          </S>

          <S t="Nivelación de Recursos (Resource Leveling)">
            <p>La nivelación de recursos busca redistribuir actividades no críticas dentro de sus holguras para suavizar el perfil de uso de recursos a lo largo del tiempo, evitando picos de demanda costosos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="card">
                <p className="font-bold text-slate-200 text-sm mb-2">Heurística de Burgess (1962)</p>
                <p className="text-xs text-slate-400">Minimiza la suma de cuadrados del uso diario de recursos (Σ rᵢ²). En cada paso, retrasa las actividades con mayor varianza de recurso, respetando las holguras. Complejidad: O(n² · d) donde d es la duración del proyecto.</p>
              </div>
              <div className="card">
                <p className="font-bold text-slate-200 text-sm mb-2">Formulación como PL Entera</p>
                <p className="text-xs text-slate-400">min Σₜ (rₜ - r̄)² donde rₜ es el uso en el período t y r̄ es el promedio. Las variables de decisión son los tiempos de inicio sᵢ ∈ [ESᵢ, LSᵢ]. Es un RCPSP (Resource Constrained Project Scheduling Problem), NP-Hard en general.</p>
              </div>
            </div>
          </S>
        </div>
      )}

      {/* ── VRP BOUNDS ───────────────────────────────────────────────── */}
      {tab === 'vrp_bounds' && (
        <div className="space-y-4">
          <S t="Cotas Inferiores para el VRP — Relaxaciones">
            <p>Las cotas inferiores son esenciales para evaluar la calidad de las soluciones heurísticas: si la heurística da Z=500 y la cota inferior es Z_lb=480, el gap de optimalidad es máximo 4.2%.</p>
            <div className="space-y-3">
              {[
                {
                  name: 'Cota de Christofides (distancia mínima requerida)',
                  formula: 'Z_lb = (1/Q) · Σᵢ dᵢ · c₀ᵢ',
                  desc: 'Cada unidad de demanda debe viajar al menos la distancia mínima al depósito. Cota débil pero fácil de calcular.',
                },
                {
                  name: 'Relajación del Problema de Asignación Generalizada (GAP)',
                  formula: 'Resolver GAP = VRP sin restricciones de ruta',
                  desc: 'Asignar clientes a vehículos minimizando costo de asignación. Ignorar el orden interno de la ruta. Cota media — se puede resolver con Simplex.',
                },
                {
                  name: 'K-Tree Bound (Christofides 1976)',
                  formula: 'Z_lb = mínimo árbol de expansión + 2 aristas incidentes al depósito',
                  desc: 'Relajación del TSP ligada al VRP. Cota fuerte pero computacionalmente cara (O(V³)).',
                },
                {
                  name: 'Relajación Lagrangeana',
                  formula: 'Dualizar restricciones de capacidad: min {Z + Σλᵢ(demanda_ruta_i - Q)}',
                  desc: 'Permite incorporar restricciones al dual. Al optimizar los multiplicadores λ (subgradiente), se obtiene la cota más fuerte en la práctica.',
                },
              ].map(b => (
                <div key={b.name} className="card">
                  <p className="font-bold text-slate-200 text-sm mb-1">{b.name}</p>
                  <p className="font-mono text-emerald-400 text-xs mb-2">{b.formula}</p>
                  <p className="text-xs text-slate-400">{b.desc}</p>
                </div>
              ))}
            </div>
          </S>

          <S t="Branch-and-Cut para VRP — Estado del Arte Exacto">
            <p>Los mejores algoritmos exactos para CVRP son <strong className="text-white">Branch-and-Cut</strong> basados en formulaciones de flujo de dos índices con planos de corte:</p>
            <div className="space-y-2 text-xs text-slate-400">
              {[
                ['Cortes de Capacidad (Capacity Cuts)','Σᵢ∈S Σⱼ∉S xᵢⱼ ≥ ⌈Σᵢ∈S dᵢ / Q⌉   para todo S ⊆ V. Fuerzan suficientes aristas salientes de cualquier subconjunto de clientes.'],
                ['Cortes de Eliminación de Subciclos (SEC)','Σᵢ∈S Σⱼ∈S xᵢⱼ ≤ |S| - 1   para todo S ⊆ V. Evitan soluciones con subciclos desconectados del depósito.'],
                ['Rounded Capacity Cuts (RCC)','Versión más fuerte de los cortes de capacidad usando el número de vehículos óptimo para el subconjunto S.'],
              ].map(([n,d]) => (
                <div key={n}>
                  <p className="font-semibold text-slate-200">{n}</p>
                  <p className="font-mono text-emerald-400 text-xs mt-0.5 mb-1">{d.split('   ')[0]}</p>
                  <p>{d.split('   ')[1] || ''}</p>
                </div>
              ))}
            </div>
            <C color="blue" title="Estado del arte en resolución exacta del CVRP">
              Con Branch-and-Cut moderno (Pecin et al. 2017, VRPTW), se pueden resolver instancias hasta n≈300 clientes en horas de cómputo. Para n&gt;300, solo metaheurísticas (LKH-3, HGS-CVRP) son prácticas, con gaps de 0.2–1.0% del óptimo conocido.
            </C>
          </S>

          <S t="Benchmark — Instancias Estándar de la Literatura">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-800 text-slate-400">
                  <th className="px-3 py-2 text-left">Conjunto</th>
                  <th className="px-3 py-2">Instancias</th>
                  <th className="px-3 py-2">n (clientes)</th>
                  <th className="px-3 py-2 text-left">Referencia</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Christofides (CMT)','14','50–199','Christofides, Mingozzi & Toth (1979)'],
                    ['Golden (G)','20','240–480','Golden et al. (1998) — grandes'],
                    ['Solomon (RC1, R1, C1)','56','100','Solomon (1987) — VRPTW estándar'],
                    ['Augerat (A, B, P)','73','31–80','Augerat et al. (1995) — CVRP clásico'],
                    ['X (Uchoa)','100','100–1000','Uchoa et al. (2017) — estado del arte'],
                  ].map(r => (
                    <tr key={r[0]} className="border-b border-slate-800 hover:bg-slate-800/20">
                      {r.map((c,i) => <td key={i} className={`px-3 py-2 ${i===0?'text-emerald-400 font-semibold':'text-slate-400'} ${i===1||i===2?'text-center':''}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </S>
        </div>
      )}
    </div>
  );
}
