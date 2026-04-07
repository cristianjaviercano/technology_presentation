import React, { useState } from 'react';

/* ── Shared sub-components ─────────────────────────────────────────────── */
const Callout = ({ color = 'emerald', title, children }) => {
  const c = {
    emerald: 'border-emerald-500 bg-emerald-500/5',
    blue: 'border-blue-500 bg-blue-500/5',
    yellow: 'border-yellow-500 bg-yellow-500/5',
    red: 'border-red-500 bg-red-500/5',
  }[color];
  return (
    <div className={`border-l-4 rounded-r-xl p-4 my-3 ${c}`}>
      {title && <p className="font-bold text-sm text-slate-200 mb-1">{title}</p>}
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
};

const Math = ({ label, children }) => (
  <div className="my-4 bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-x-auto">
    {label && <p className="text-xs text-slate-500 font-mono mb-2">{label}</p>}
    <p className="font-mono text-emerald-400 text-center text-base leading-loose">{children}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
      <span className="block w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />{title}
    </h3>
    <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
  </div>
);

const Code = ({ children }) => (
  <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-emerald-400 font-mono leading-relaxed overflow-x-auto mt-3">
    {children}
  </pre>
);

/* ── Dijkstra trace table (Taha example) ───────────────────────────────── */
const DIJKSTRA_TRACE = [
  { it: 0, u: '—',   A: '0',  B: '∞',  C: '∞',  D: '∞',  E: '∞',  F: '∞',  note: 'Inicializar: d[A]=0, resto ∞' },
  { it: 1, u: 'A',   A: '0✓', B: '4',  C: '2',  D: '∞',  E: '∞',  F: '∞',  note: 'Extraer A. Relajar vecinos B(4) y C(2)' },
  { it: 2, u: 'C',   A: '0✓', B: '3',  C: '2✓', D: '∞',  E: '10', F: '∞',  note: 'Extraer C(min=2). Relajar B: 2+1=3, E: 2+8=10' },
  { it: 3, u: 'B',   A: '0✓', B: '3✓', C: '2✓', D: '8',  E: '10', F: '∞',  note: 'Extraer B(min=3). Relajar D: 3+5=8, E: 3+7=10 (sin mejora)' },
  { it: 4, u: 'D',   A: '0✓', B: '3✓', C: '2✓', D: '8✓', E: '10', F: '11', note: 'Extraer D(min=8). Relajar E: 8+2=10 (sin mejora), F: 8+3=11' },
  { it: 5, u: 'E',   A: '0✓', B: '3✓', C: '2✓', D: '8✓', E: '10✓',F: '11', note: 'Extraer E(min=10). Relajar F: 10+6=16 (sin mejora)' },
  { it: 6, u: 'F',   A: '0✓', B: '3✓', C: '2✓', D: '8✓', E: '10✓',F: '11✓',note: 'Extraer F(min=11). Todos visitados. ÓPTIMO.' },
];

/* ── Floyd-Warshall example (4 nodes) ─────────────────────────────────── */
const INF = '∞';
const FW_INIT = [
  [0,  3,   INF, 7  ],
  [8,  0,   2,   INF],
  [5,  INF, 0,   1  ],
  [2,  INF, INF, 0  ],
];
// After full FW
const FW_FINAL = [
  [0, 3, 5, 6],
  [7, 0, 2, 3],
  [5, 8, 0, 1],
  [2, 5, 7, 0],
];

/* ── Exercises ────────────────────────────────────────────────────────── */
const EXERCISES = [
  {
    id: 'ex1',
    title: 'Ejercicio 1 — Red Logística (Taha §6.4)',
    desc: 'Una empresa de mensajería conecta 5 ciudades. Encuentra la ruta más corta de la ciudad 1 a todas las demás.',
    graph: {
      nodes: ['1','2','3','4','5'],
      edges: [['1','2',3],['1','3',6],['2','3',2],['2','4',1],['3','5',4],['4','3',1],['4','5',3]],
      directed: false,
    },
    dijkstra: [
      ['1','2','3','4','5'],
      ['0','3','5','4','8'],
      ['—','1','2(via 4)','2','4'],
    ],
    optimal: { '1-2': 3, '1-3': 5, '1-4': 4, '1-5': 7 },
    answer: 'Ruta 1→3: 1→2→4→3 = 3+1+1 = 5. Ruta 1→5: 1→2→4→5 = 3+1+3 = 7.',
  },
  {
    id: 'ex2',
    title: 'Ejercicio 2 — Detectar Ruta Alternativa',
    desc: 'Red de carreteras con 4 nodos. Dos caminos paralelos compiten por ser el más corto de A a D.',
    graph: {
      nodes: ['A','B','C','D'],
      edges: [['A','B',2],['A','C',5],['B','C',1],['B','D',7],['C','D',3]],
      directed: false,
    },
    dijkstra: [
      ['A','B','C','D'],
      ['0','2','3','6'],
      ['—','A','B','C'],
    ],
    optimal: { 'A-B': 2, 'A-C': 3, 'A-D': 6 },
    answer: 'Ruta A→D = A→B→C→D = 2+1+3 = 6. La ruta directa A→C→D = 5+3 = 8 es subóptima.',
  },
  {
    id: 'ex3',
    title: 'Ejercicio 3 — Floyd-Warshall: Todos los Pares',
    desc: 'Grafo dirigido de 4 nodos. Calcula la matriz de distancias mínimas entre todos los pares.',
    fw: { init: FW_INIT, final: FW_FINAL },
    answer: 'Ver tabla final. Ej: d(2,4)=3 vía 2→3→4: 2+1=3. Verificar: d(4,2)=5 vía 4→1→2: 2+3=5.',
  },
];

/* ── Bellman-Ford trace ────────────────────────────────────────────────── */
const BF_TRACE = [
  { pass: 0, s: 0, a: 999, b: 999, c: 999, d: 999, note: 'Inicio: solo s=0' },
  { pass: 1, s: 0, a: 5,   b: 3,   c: 2,   d: 999, note: 'Relajar todos los arcos una vez' },
  { pass: 2, s: 0, a: 4,   b: 3,   c: 2,   d: 1,   note: 'Segunda pasada: mejoras detectadas' },
  { pass: 3, s: 0, a: 4,   b: 3,   c: 2,   d: 1,   note: 'Sin cambios → CONVERGIÓ (3 = n-1 pasadas)' },
];

/* ── Main Component ────────────────────────────────────────────────────── */
const TABS = ['history','dijkstra','floyd','bellman','compare','exercises'];
const TAB_LABELS = {
  history:   '📖 Historia y Contexto',
  dijkstra:  '⚡ Dijkstra Profundo',
  floyd:     '🔢 Floyd-Warshall',
  bellman:   '❗ Bellman-Ford',
  compare:   '⚖️ Comparativa',
  exercises: '📝 Ejercicios',
};

export default function Module2View() {
  const [tab, setTab] = useState('history');
  const [openEx, setOpenEx] = useState(null);

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">MÓDULO 2 · Grafos y Redes</span>
        <h1 className="text-3xl font-black text-white mt-1">Algoritmos de Ruta Más Corta</h1>
        <p className="text-slate-400 mt-1">
          Taha (2012) §6.4–6.5 · Ahuja, Magnanti &amp; Orlin (1993) caps. 4–5 · Dijkstra (1959) · Floyd (1962)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-xs font-semibold rounded-t transition-colors
              ${tab===t ? 'text-emerald-400 bg-slate-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── HISTORY ── */}
      {tab === 'history' && (
        <div className="space-y-5">
          <Section title="Contexto Histórico — El Problema del Camino Más Corto">
            <p>El problema del camino más corto (<em>shortest path</em>) tiene raíces en la Teoría de Grafos del siglo XVIII, pero su formalización computacional emergió en la década de 1950 con el auge de la programación y la investigación de operaciones.</p>
            <p>En 1956, el matemático holandés <strong className="text-white">Edsger W. Dijkstra</strong> desarrolló su célebre algoritmo mientras trabajaba en el Centre for Mathematics and Computer Science (CWI) en Ámsterdam. La motivación original fue práctica: encontrar la ruta más rápida para un robot en un laberinto. El artículo fue publicado en 1959 en <em>Numerische Mathematik</em> y es uno de los más citados en ciencias de la computación.</p>
            <Callout color="blue" title="Dato histórico (Dijkstra, 1959)">
              Dijkstra diseñó el algoritmo en 20 minutos mientras tomaba café con su esposa en Ámsterdam. No usó papel — todo fue pensado mentalmente. Años después afirmó que la elegancia del algoritmo se debía precisamente a que no tenía lápiz para escribir borradores.
            </Callout>
            <p>En 1962, el matemático americano <strong className="text-white">Robert Floyd</strong> publicó su algoritmo de programación dinámica para todos los pares de nodos en Communications of the ACM, basándose en el trabajo previo de Stephen Warshall sobre la clausura transitiva. El algoritmo comparte ideas con el método de <strong className="text-white">Richard Bellman</strong> (1958) para el problema de un solo origen con pesos negativos.</p>
          </Section>

          <Section title="Taxonomía del Problema de Camino Más Corto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Origen Único (SSSP)', alg: 'Dijkstra, Bellman-Ford', use: 'GPS, enrutamiento IP, logística punto a punto', pesos: 'No negativos (Dijkstra) / Cualquiera (BF)' },
                { name: 'Todos los Pares (APSP)', alg: 'Floyd-Warshall, Johnson', use: 'Detección de ciclos negativos, tablas de enrutamiento', pesos: 'Cualquiera (sin ciclos negativos)' },
                { name: 'Destino Único', alg: 'Dijkstra invertido', use: 'Centros de emergencia, hubs logísticos', pesos: 'No negativos' },
                { name: 'DAG (sin ciclos)', alg: 'Relajación topológica', use: 'CPM/PERT, compiladores, scheduling', pesos: 'Cualquiera' },
              ].map(t => (
                <div key={t.name} className="card">
                  <h4 className="font-bold text-slate-200 text-sm mb-2">{t.name}</h4>
                  <p className="text-xs text-slate-400 mb-1"><span className="text-emerald-400">Algoritmo:</span> {t.alg}</p>
                  <p className="text-xs text-slate-400 mb-1"><span className="text-emerald-400">Aplicación:</span> {t.use}</p>
                  <p className="text-xs text-slate-400"><span className="text-emerald-400">Pesos:</span> {t.pesos}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Aplicaciones en Ingeniería Industrial y Logística">
            <div className="space-y-2">
              {[
                ['🚚 Distribución Last-Mile', 'Optimización de rutas de entrega urbana. Los nodos son intersecciones, los arcos son calles con tiempo de viaje como peso. Empresas como FedEx, Amazon y Rappi usan variantes de Dijkstra en tiempo real.'],
                ['📡 Enrutamiento de Redes IP', 'El protocolo OSPF (Open Shortest Path First) usa Dijkstra para construir la tabla de enrutamiento de cada router. Los pesos son métricas de ancho de banda.'],
                ['✈️ Planificación de Rutas Aéreas', 'Los grafos de conexiones aéreas (hubs) usan APSP para calcular el tiempo mínimo de conexión entre cualquier par de ciudades, incluyendo escalas.'],
                ['🏥 Servicios de Emergencia', 'La ubicación óptima de ambulancias y la asignación dinámica de vehículos a incidentes resuelve el problema de camino más corto en tiempo real (sistemas MERS).'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3 bg-slate-900 rounded-xl p-3 border border-slate-800">
                  <span className="text-lg">{title.split(' ')[0]}</span>
                  <div>
                    <p className="font-semibold text-slate-200 text-xs">{title.substring(2)}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ── DIJKSTRA DEEP ── */}
      {tab === 'dijkstra' && (
        <div className="space-y-5">
          <Section title="Algoritmo de Dijkstra — Análisis Profundo">
            <p>Dijkstra resuelve el problema SSSP en grafos con pesos <strong className="text-white">no negativos</strong>. Su estrategia es <em>greedy</em>: en cada iteración extrae el nodo no visitado con menor distancia tentativa y lo declara definitivo, propagando la mejora a sus vecinos.</p>

            <Callout color="blue" title="Invariante del algoritmo">
              En cada iteración, el conjunto S contiene todos los nodos cuya distancia mínima definitiva ya se conoce. Para todo nodo u ∈ S: d[u] es la distancia más corta real desde s hasta u.
            </Callout>

            <p><strong className="text-white">Por qué este invariante se mantiene:</strong> Suponemos que al extraer u (con menor d[u] en la cola), existe una ruta más corta que pasa por algún nodo aún no visitado v. Pero eso implicaría d[v] ≤ d[u] (ya que los pesos son ≥ 0), contradiciendo que u es el mínimo. QED.</p>
          </Section>

          <Section title="Formulación como Programación Dinámica">
            <p>Dijkstra puede verse como programación dinámica donde el estado es el nodo actual y la decisión es qué arco explorar:</p>
            <Math label="Ecuación de Bellman para camino más corto:">
              {'d[v] = min{ d[u] + w(u,v) }  para todo (u,v) ∈ A'}
            </Math>
            <p>La diferencia con Bellman-Ford es que Dijkstra explota la monotonía (pesos ≥ 0) para resolver cada subproblema exactamente una vez.</p>
          </Section>

          <Section title="Implementaciones y Complejidades">
            <div className="space-y-3">
              {[
                { impl: 'Array (lista lineal)', extract: 'O(V)', relax: 'O(E)', total: 'O(V² + E) = O(V²)', uso: 'Grafos densos, E = O(V²). Implementación más simple.' },
                { impl: 'Min-Heap binario', extract: 'O(log V)', relax: 'O(log V)', total: 'O((V + E) log V)', uso: 'Grafos dispersos, E = O(V log V). Estándar en la práctica.' },
                { impl: 'Fibonacci Heap', extract: 'O(log V) amortizado', relax: 'O(1) amortizado', total: 'O(E + V log V)', uso: 'Óptimo teórico. Constantes altas — raro en práctica.' },
              ].map(({ impl, extract, relax, total, uso }) => (
                <div key={impl} className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-slate-200 text-sm">{impl}</p>
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{total}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 mb-2">
                    <span>Extract-min: <code className="text-slate-300">{extract}</code></span>
                    <span>Decrease-key: <code className="text-slate-300">{relax}</code></span>
                  </div>
                  <p className="text-xs text-slate-500">{uso}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Trazado Completo — Ejemplo Grafo A→F (6 nodos)">
            <p className="text-xs text-slate-400 mb-3">Grafo del lab: A-B(4), A-C(2), B-C(1), B-D(5), B-E(7), C-E(8), D-E(2), D-F(3), E-F(6). Origen: A.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 px-2 py-2 text-slate-400">It.</th>
                    <th className="border border-slate-700 px-2 py-2 text-slate-400">Nodo u</th>
                    {['A','B','C','D','E','F'].map(n => <th key={n} className="border border-slate-700 px-2 py-2 text-emerald-400">{n}</th>)}
                    <th className="border border-slate-700 px-2 py-2 text-slate-400 text-left">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {DIJKSTRA_TRACE.map(r => (
                    <tr key={r.it} className="hover:bg-slate-800/50">
                      <td className="border border-slate-700 px-2 py-2 text-center text-slate-400">{r.it}</td>
                      <td className="border border-slate-700 px-2 py-2 text-center text-yellow-400 font-bold">{r.u}</td>
                      {[r.A, r.B, r.C, r.D, r.E, r.F].map((v, i) => (
                        <td key={i} className={`border border-slate-700 px-2 py-2 text-center ${v.includes('✓') ? 'text-emerald-400 bg-emerald-500/5' : 'text-slate-300'}`}>{v}</td>
                      ))}
                      <td className="border border-slate-700 px-2 py-2 text-left text-slate-400 text-xs max-w-xs">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
              <p className="text-xs text-emerald-400 font-bold">Resultado: Ruta A→F</p>
              <p className="text-sm text-slate-300 mt-1">A → C → B → D → F = 2+1+5+3 = <strong className="text-emerald-400">11</strong> | prev[F]=D, prev[D]=B, prev[B]=C, prev[C]=A</p>
            </div>
          </Section>

          <Section title="Pseudocódigo Formal">
            <Code>{`DIJKSTRA(G, w, s):
  // Inicialización
  FOR cada vértice v ∈ V:
    d[v] ← ∞
    prev[v] ← NIL
  d[s] ← 0
  
  Q ← MIN-PRIORITY-QUEUE(V)  // ordenada por d[v]
  
  // Loop principal
  WHILE Q ≠ ∅:
    u ← EXTRACT-MIN(Q)          // O(log V) con heap
    
    FOR cada vecino v de u (arco (u,v) con peso w(u,v)):
      IF d[u] + w(u,v) < d[v]:  // relajación
        d[v] ← d[u] + w(u,v)
        prev[v] ← u
        DECREASE-KEY(Q, v, d[v]) // O(log V)
  
  RETURN d[], prev[]

// Reconstruir ruta desde s hasta t:
RECONSTRUCT-PATH(prev, s, t):
  path ← []
  u ← t
  WHILE u ≠ NIL:
    path.prepend(u)
    u ← prev[u]
  RETURN path`}</Code>
          </Section>
        </div>
      )}

      {/* ── FLOYD-WARSHALL ── */}
      {tab === 'floyd' && (
        <div className="space-y-5">
          <Section title="Floyd-Warshall — Todos los Pares">
            <p>Publicado por Robert Floyd en 1962, este algoritmo de <strong className="text-white">programación dinámica</strong> calcula la distancia mínima entre <em>todos los pares</em> de nodos en un grafo dirigido ponderado (con o sin pesos negativos, pero sin ciclos negativos).</p>
            <p>La idea es construir iterativamente la solución: <code className="text-emerald-400">d(k)[i][j]</code> es la distancia mínima de i a j usando solo los nodos 1, 2, …, k como intermedios.</p>

            <Math label="Recurrencia de Floyd-Warshall:">
              {'d(k)[i][j] = min( d(k-1)[i][j],  d(k-1)[i][k] + d(k-1)[k][j] )'}
            </Math>

            <Callout color="blue" title="Interpretación de la recurrencia">
              En la iteración k: ¿conviene pasar por el nodo k para ir de i a j? Si la ruta i→k→j (ambas ya optimizadas con 1…k-1 como intermedios) es más corta que la ruta directa i→j conocida, se actualiza.
            </Callout>
          </Section>

          <Section title="Inicialización y Convenciones">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                ['d(0)[i][i] = 0', 'Distancia de un nodo a sí mismo es siempre 0.'],
                ['d(0)[i][j] = w(i,j)', 'Si existe el arco (i,j), su peso es la distancia inicial.'],
                ['d(0)[i][j] = ∞', 'Si no existe arco directo de i a j.'],
              ].map(([cond, desc]) => (
                <div key={cond} className="bg-slate-900 border border-slate-700 rounded-xl p-3">
                  <p className="font-mono text-emerald-400 text-sm mb-1">{cond}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Ejemplo Completo — Grafo Dirigido de 4 Nodos">
            <p className="text-xs text-slate-400 mb-3">Arcos: 1→2(3), 1→4(7), 2→1(8), 2→3(2), 3→1(5), 3→4(1), 4→1(2). Verificar d(2→4) = 3.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs text-slate-500 font-mono mb-2">Matriz inicial D(0):</p>
                <table className="text-xs font-mono border-collapse w-full">
                  <thead><tr className="bg-slate-800">
                    <th className="border border-slate-700 p-2"></th>
                    {[1,2,3,4].map(n => <th key={n} className="border border-slate-700 p-2 text-emerald-400">{n}</th>)}
                  </tr></thead>
                  <tbody>
                    {FW_INIT.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-slate-700 p-2 text-emerald-400 font-bold">{i+1}</td>
                        {row.map((v, j) => (
                          <td key={j} className={`border border-slate-700 p-2 text-center ${v===INF ? 'text-slate-600' : 'text-slate-300'}`}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-mono mb-2">Matriz final D(4) — solución óptima:</p>
                <table className="text-xs font-mono border-collapse w-full">
                  <thead><tr className="bg-slate-800">
                    <th className="border border-slate-700 p-2"></th>
                    {[1,2,3,4].map(n => <th key={n} className="border border-slate-700 p-2 text-emerald-400">{n}</th>)}
                  </tr></thead>
                  <tbody>
                    {FW_FINAL.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-slate-700 p-2 text-emerald-400 font-bold">{i+1}</td>
                        {row.map((v, j) => (
                          <td key={j} className={`border border-slate-700 p-2 text-center ${i===j ? 'text-slate-600' : 'text-emerald-400 font-bold'}`}>{v}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Callout color="emerald" title="Verificación clave">
              d(2→4) = 3: la ruta 2→3→4 = 2+1 = 3 (no la directa 2→1→4 = 8+7 = 15). El algoritmo lo descubrió al usar el nodo 3 como pivote (k=3).
            </Callout>
          </Section>

          <Section title="Detección de Ciclos Negativos">
            <p>Una aplicación crucial de Floyd-Warshall es detectar <strong className="text-white">ciclos negativos</strong>: si al finalizar el algoritmo existe algún nodo i tal que <code className="text-emerald-400">d[i][i] &lt; 0</code>, el grafo contiene un ciclo negativo accesible desde i.</p>
            <Callout color="red" title="Implicación práctica">
              En redes logísticas, un ciclo negativo indicaría una inconsistencia en el modelo (ej. dos rutas cuya ganancia combinada es infinita). En redes financieras (arbitraje), representa una oportunidad de ganancia sin riesgo — y su detección es el objetivo buscado.
            </Callout>
          </Section>

          <Code>{`FLOYD_WARSHALL(W[n][n]):
  D ← copia de W           // D[i][j] = w(i,j) ó ∞ ó 0 si i=j
  next[i][j] ← j           // para reconstrucción de rutas
  
  FOR k = 1 TO n:           // nodo pivote
    FOR i = 1 TO n:
      FOR j = 1 TO n:
        IF D[i][k] + D[k][j] < D[i][j]:
          D[i][j] ← D[i][k] + D[k][j]
          next[i][j] ← next[i][k]   // actualizar ruta
  
  // Detectar ciclos negativos:
  FOR i = 1 TO n:
    IF D[i][i] < 0: RETURN "CICLO NEGATIVO"
  
  RETURN D, next

// Reconstruir ruta de u a v:
GET_PATH(next, u, v):
  IF next[u][v] = NIL: RETURN []
  path ← [u]
  WHILE u ≠ v:
    u ← next[u][v]
    path.append(u)
  RETURN path`}</Code>
        </div>
      )}

      {/* ── BELLMAN-FORD ── */}
      {tab === 'bellman' && (
        <div className="space-y-5">
          <Section title="Bellman-Ford — Pesos Negativos y Detección de Ciclos">
            <p>Publicado independientemente por <strong className="text-white">Richard Bellman</strong> (1958) y <strong className="text-white">Lester Ford Jr.</strong> (1956), este algoritmo extiende la capacidad de Dijkstra al permitir arcos de <strong className="text-white">peso negativo</strong> (pero no ciclos negativos alcanzables desde la fuente).</p>
            <p>La estrategia es relajar <strong className="text-white">todos los arcos |V|−1 veces</strong>. El número de pasadas garantiza que, en un grafo sin ciclos negativos, la distancia se propagará a través de cualquier camino de hasta |V|−1 arcos.</p>

            <Math label="Regla de relajación (aplicada a todos los arcos en cada pasada):">
              {'d[v] = min( d[v],  d[u] + w(u,v) )  ∀(u,v) ∈ A'}
            </Math>

            <Callout color="yellow" title="¿Por qué |V|-1 pasadas son suficientes?">
              Un camino simple (sin repetir nodos) tiene como máximo |V|-1 arcos. Después de la pasada k, d[v] contiene la distancia más corta usando a lo sumo k arcos. Tras |V|-1 pasadas, cualquier camino mínimo simple ha sido encontrado.
            </Callout>
          </Section>

          <Section title="Detección de Ciclos Negativos">
            <p>Después de las |V|-1 relajaciones, si aún existe un arco (u,v) tal que <code className="text-emerald-400">d[u] + w(u,v) &lt; d[v]</code>, entonces existe un ciclo negativo accesible desde s — las distancias seguirían decreciendo indefinidamente.</p>

            <Code>{`BELLMAN_FORD(G, w, s):
  d[s] ← 0;  d[v] ← ∞  para todo v ≠ s
  prev[v] ← NIL  para todo v
  
  // |V|-1 relajaciones
  FOR i = 1 TO |V|-1:
    FOR cada arco (u,v) ∈ A:
      IF d[u] + w(u,v) < d[v]:
        d[v] ← d[u] + w(u,v)
        prev[v] ← u
  
  // Verificar ciclos negativos (pasada adicional)
  FOR cada arco (u,v) ∈ A:
    IF d[u] + w(u,v) < d[v]:
      RETURN "CICLO NEGATIVO DETECTADO"
  
  RETURN d[], prev[]`}</Code>
          </Section>

          <Section title="Trazado — Grafo con Arco Negativo (5 nodos)">
            <p className="text-xs text-slate-400 mb-3">Arcos: s→a(5), s→b(3), b→a(-2), a→c(2), c→d(1). Fuente: s.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 p-2 text-slate-400">Pasada</th>
                    {['s','a','b','c','d'].map(n => <th key={n} className="border border-slate-700 p-2 text-emerald-400">{n}</th>)}
                    <th className="border border-slate-700 p-2 text-slate-400 text-left">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {BF_TRACE.map(r => (
                    <tr key={r.pass} className="hover:bg-slate-800/50">
                      <td className="border border-slate-700 p-2 text-center text-yellow-400">{r.pass}</td>
                      {[r.s, r.a, r.b, r.c, r.d].map((v, i) => (
                        <td key={i} className={`border border-slate-700 p-2 text-center ${v===999 ? 'text-slate-600' : 'text-emerald-400'}`}>{v===999 ? '∞' : v}</td>
                      ))}
                      <td className="border border-slate-700 p-2 text-slate-400">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 text-xs">
              <p className="text-blue-400 font-bold">Resultado:</p>
              <p className="text-slate-300 mt-1">d[a] = 1 vía s→b→a = 3+(−2) = 1, más corta que la directa s→a = 5. El arco negativo fue detectado correctamente en la segunda pasada.</p>
            </div>
          </Section>

          <Section title="Cuándo usar Bellman-Ford vs Dijkstra">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card border-yellow-500/20">
                <h4 className="font-bold text-yellow-400 mb-2">Usar Bellman-Ford cuando…</h4>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>• El grafo tiene arcos de peso negativo</li>
                  <li>• Se necesita detectar ciclos negativos</li>
                  <li>• El grafo es distribuido (ej. protocolos RIP)</li>
                  <li>• La implementación sencilla prima sobre la velocidad</li>
                </ul>
              </div>
              <div className="card border-emerald-500/20">
                <h4 className="font-bold text-emerald-400 mb-2">Usar Dijkstra cuando…</h4>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>• Todos los pesos son no negativos (garantizado)</li>
                  <li>• El rendimiento es crítico (GPS, tiempo real)</li>
                  <li>• El grafo es grande y disperso</li>
                  <li>• Se tiene una buena estructura de cola de prioridad</li>
                </ul>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── COMPARE ── */}
      {tab === 'compare' && (
        <div className="space-y-5">
          <Section title="Tabla Comparativa Completa">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 px-3 py-3 text-left text-slate-400">Criterio</th>
                    <th className="border border-slate-700 px-3 py-3 text-center text-emerald-400">Dijkstra</th>
                    <th className="border border-slate-700 px-3 py-3 text-center text-blue-400">Floyd-Warshall</th>
                    <th className="border border-slate-700 px-3 py-3 text-center text-yellow-400">Bellman-Ford</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {[
                    ['Caso de uso','Origen único → todos','Todos → todos','Origen único → todos'],
                    ['Complejidad tiempo','O(V²) / O(E log V)','O(V³)','O(V·E)'],
                    ['Complejidad espacio','O(V)','O(V²)','O(V)'],
                    ['Pesos negativos','❌ No','✅ Sí (sin ciclos neg.)','✅ Sí'],
                    ['Detección ciclo neg.','❌ No','✅ d[i][i] < 0','✅ Pasada |V|-a'],
                    ['Mejor para grafos','Dispersos','Densos / APSP','Con w negativos'],
                    ['Estrategia','Greedy','Prog. Dinámica','Relax. iterativa'],
                    ['Reconstr. de ruta','Sí (prev[])','Sí (next[][])','Sí (prev[])'],
                    ['Aplicación típica','GPS, OSPF','Routing completo','Protocolo RIP'],
                  ].map(([c, d, f, b]) => (
                    <tr key={c} className="hover:bg-slate-800/30">
                      <td className="border border-slate-700 px-3 py-2.5 text-slate-300 font-medium">{c}</td>
                      <td className="border border-slate-700 px-3 py-2.5 text-center text-slate-300 text-xs">{d}</td>
                      <td className="border border-slate-700 px-3 py-2.5 text-center text-slate-300 text-xs">{f}</td>
                      <td className="border border-slate-700 px-3 py-2.5 text-center text-slate-300 text-xs">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Jerarquía de Algoritmos de Camino Más Corto">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <div className="space-y-3 text-sm">
                {[
                  { cond: 'DAG (grafo acíclico dirigido)', winner: 'Relajación topológica', why: 'O(V+E) — explota la ausencia de ciclos', color: 'text-purple-400' },
                  { cond: 'Pesos no negativos + origen único', winner: 'Dijkstra + Fibonacci Heap', why: 'O(E + V log V) — óptimo para este caso', color: 'text-emerald-400' },
                  { cond: 'Pesos negativos + origen único', winner: 'Bellman-Ford', why: 'O(VE) — maneja negativos correctamente', color: 'text-yellow-400' },
                  { cond: 'Todos los pares + grafo denso', winner: 'Floyd-Warshall', why: 'O(V³) — simple e itera sobre todo V²', color: 'text-blue-400' },
                  { cond: 'Todos los pares + grafo disperso', winner: 'Johnson (Dijkstra + rebalanceo)', why: 'O(V² log V + VE) — aplica rebalanceo de Johnson', color: 'text-orange-400' },
                ].map(({ cond, winner, why, color }) => (
                  <div key={cond} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">{cond}</p>
                      <p className={`font-bold ${color}`}>{winner}</p>
                      <p className="text-xs text-slate-400">{why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── EXERCISES ── */}
      {tab === 'exercises' && (
        <div className="space-y-5">
          <Section title="Ejercicios Resueltos Paso a Paso">
            <p>3 ejercicios de complejidad creciente. Intenta resolver antes de ver la solución.</p>
          </Section>

          {EXERCISES.map((ex, idx) => (
            <div key={ex.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono text-slate-500">{idx+1}/{EXERCISES.length}</span>
                  <h4 className="font-bold text-slate-200 mt-0.5">{ex.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{ex.desc}</p>
                </div>
                <button onClick={() => setOpenEx(openEx === ex.id ? null : ex.id)}
                  className="ml-4 flex-shrink-0 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30 transition-colors">
                  {openEx === ex.id ? 'Ocultar' : 'Ver solución'}
                </button>
              </div>

              {/* Graph info */}
              {ex.graph && (
                <div className="mt-3 bg-slate-900 rounded-xl p-3 border border-slate-800 text-xs font-mono">
                  <p className="text-slate-500 mb-1">Arcos del grafo:</p>
                  <p className="text-emerald-400">{ex.graph.edges.map(([u,v,w]) => `${u}-${v}(${w})`).join(', ')}</p>
                </div>
              )}
              {ex.fw && (
                <div className="mt-3 text-xs text-slate-400">
                  Matriz W inicial dada arriba en la pestaña Floyd-Warshall.
                </div>
              )}

              {openEx === ex.id && (
                <div className="mt-4 space-y-3">
                  {ex.dijkstra && (
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-700">
                      <p className="text-xs text-slate-500 font-mono mb-2">Tabla de distancias (Dijkstra):</p>
                      <table className="text-xs font-mono border-collapse w-full">
                        <thead><tr>
                          <td className="border border-slate-800 px-2 py-1 text-slate-500">Nodo</td>
                          {ex.dijkstra[0].map(n => <td key={n} className="border border-slate-800 px-2 py-1 text-emerald-400 text-center">{n}</td>)}
                        </tr></thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-800 px-2 py-1 text-slate-500">d[ ]</td>
                            {ex.dijkstra[1].map((v,i) => <td key={i} className="border border-slate-800 px-2 py-1 text-center text-slate-300">{v}</td>)}
                          </tr>
                          <tr>
                            <td className="border border-slate-800 px-2 py-1 text-slate-500">prev[ ]</td>
                            {ex.dijkstra[2].map((v,i) => <td key={i} className="border border-slate-800 px-2 py-1 text-center text-yellow-400">{v}</td>)}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {ex.fw && (
                    <div className="bg-slate-950 rounded-xl p-4 border border-slate-700">
                      <p className="text-xs text-slate-500 font-mono mb-2">Matriz final D(n):</p>
                      <table className="text-xs font-mono border-collapse">
                        <thead><tr>
                          <th className="border border-slate-800 px-2 py-1"></th>
                          {[1,2,3,4].map(n => <th key={n} className="border border-slate-800 px-2 py-1 text-emerald-400">{n}</th>)}
                        </tr></thead>
                        <tbody>
                          {ex.fw.final.map((row, i) => (
                            <tr key={i}>
                              <td className="border border-slate-800 px-2 py-1 text-emerald-400 font-bold">{i+1}</td>
                              {row.map((v, j) => <td key={j} className="border border-slate-800 px-2 py-1 text-center text-slate-300">{v}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3">
                    <p className="text-xs text-emerald-400 font-bold mb-1">Respuesta explicada:</p>
                    <p className="text-sm text-slate-300">{ex.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
