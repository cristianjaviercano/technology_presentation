import React, { useState } from 'react';

const Callout = ({ color = 'emerald', title, children }) => {
  const c = {
    emerald: 'border-emerald-500 bg-emerald-500/5',
    blue: 'border-blue-500 bg-blue-500/5',
    yellow: 'border-yellow-500 bg-yellow-500/5',
    red: 'border-red-500 bg-red-500/5',
    purple: 'border-purple-500 bg-purple-500/5',
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
    <p className="font-mono text-emerald-400 text-center text-sm md:text-base leading-loose whitespace-pre-wrap">{children}</p>
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

const FF_TRACE = [
  { it: 1, path: 'O → A → T', cap: 'min(5,3,6) = 3', residual: 'O→A = 2, A→T = 0. Flujo: 3' },
  { it: 2, path: 'O → B → A → T', cap: 'min(7,4,6-3) = 3', residual: 'O→B = 4, B→A = 1, A→T = 0. Flujo: 3+3=6' },
  { it: 3, path: 'O → B → C → T', cap: 'min(4,5,8) = 4', residual: 'O→B = 0, B→C=1. Flujo: 6+4=10' },
  { it: 4, path: 'O → C → T', cap: 'min(4,8-4) = 4', residual: 'O→C = 0, C→T = 0. Flujo: 10+4=14' },
  { it: 5, path: 'Ninguna otra ruta con capacidad > 0', cap: '—', residual: 'Finaliza algoritmo.' },
];

const KRUSKAL_TRACE = [
  { step: 1, edge: '(O, A)', weight: 2, action: 'Añadir (no forma ciclo)', mst: 'O-A' },
  { step: 2, edge: '(B, C)', weight: 3, action: 'Añadir (no forma ciclo)', mst: 'O-A, B-C' },
  { step: 3, edge: '(A, B)', weight: 4, action: 'Añadir (une componentes)', mst: 'O-A-B-C' },
  { step: 4, edge: '(O, B)', weight: 5, action: 'RECHAZAR (forma ciclo O-A-B)', mst: 'Igual' },
  { step: 5, edge: '(C, T)', weight: 6, action: 'Añadir (conecta T)', mst: 'O-A-B-C-T' },
];

export default function Module3View() {
  const [tab, setTab] = useState('mincost');

  return (
    <div className="space-y-6 animate-in">
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">MÓDULO 3 · Grafos y Redes Avanzadas</span>
        <h1 className="text-3xl font-black text-white mt-1">Flujo Acotado, MST y el Problema Multimodo</h1>
        <p className="text-slate-400 mt-1">
          Hillier & Lieberman (2010) cap. 9 · Taha (2012) cap. 6 · Ahuja et al. (1993)
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
        {[
          ['mincost', '👑 Flujo de Costo Mínimo'],
          ['maxflow', '🌊 Flujo Máximo y Min-Cut'],
          ['mst', '🌲 Árbol Expan. Mínima (MST)'],
          ['assignment', '🎯 Asignación Bipartita']
        ].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t ${tab === id ? 'text-emerald-400 bg-slate-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'mincost' && (
        <div className="space-y-5">
          <Section title="El Problema Universal: Flujo de Costo Mínimo (MCMF)">
            <p>
              Como plantea <em>Hillier & Lieberman</em>, el <strong>Problema de Flujo de Costo Mínimo</strong> es el modelo unificador de la optimización lineal de redes. Problemas como la Ruta Más Corta, el Flujo Máximo, el Transporte y la Asignación son simplemente <strong>casos especiales</strong> de este gran modelo.
            </p>
            <p>Se considera una red dirigida G = (N, A) donde cada nodo <code className="text-emerald-400">i</code> genera o consume un flujo <code className="text-emerald-400">b_i</code>, y cada arco tiene un costo unitario <code className="text-emerald-400">c_{'{i,j}'}</code> y una capacidad <code className="text-emerald-400">u_{'{i,j}'}</code>.</p>
          </Section>

          <Section title="Formulación de Programación Lineal">
            <Math label="Función Objetivo (Minimizar el costo total de envío):">
              {'Min Z = Σ_{(i,j)∈A} c_{i,j} \u00B7 x_{i,j}'}
            </Math>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-4">
              <p className="text-xs text-slate-500 font-mono mb-2">Restricciones de Conservación de Flujo (para todo nodo i):</p>
              <p className="font-mono text-emerald-400 text-center mb-2">
                {'Σ_{j} x_{i,j} - Σ_{k} x_{k,i} = b_i'}
              </p>
              <p className="text-xs text-slate-400 text-center">
                (Flujo que Sale) - (Flujo que Entra) = (Flujo Neto Generado)
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                <div className="bg-slate-800 rounded p-2 text-center text-blue-400 font-mono font-bold">b_i &gt; 0: Nodo Fuente (Oferta)</div>
                <div className="bg-slate-800 rounded p-2 text-center text-red-400 font-mono font-bold">b_i &lt; 0: Nodo Sumidero (Demanda)</div>
                <div className="bg-slate-800 rounded p-2 text-center text-slate-300 font-mono font-bold">b_i = 0: Nodo de Transbordo</div>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <p className="text-xs text-slate-500 font-mono mb-2">Restricciones de Capacidad de Arco (para todo (i,j)):</p>
              <p className="font-mono text-emerald-400 text-center">
                {'0 \u2264 x_{i,j} \u2264 u_{i,j}'}
              </p>
            </div>
            <Callout color="yellow" title="Condición de Factibilidad Global">
               Para que el problema tenga una solución factible, la suma de todos los flujos netos del sistema debe ser estrictamente cero: <strong>Σ b_i = 0</strong>.
            </Callout>
          </Section>

          <Section title="¿Cómo se reducen otros problemas al MCMF?">
            <table className="w-full text-xs font-mono border-collapse">
              <thead><tr className="bg-slate-800 text-slate-400">
                <th className="border border-slate-700 px-3 py-2 text-left">Problema</th>
                <th className="border border-slate-700 px-3 py-2 text-left">Configuración de Parámetros en Costo Mínimo</th>
              </tr></thead>
              <tbody>
                {[
                  ['Transporte', 'No hay nodos de transbordo (b_i ≠ 0 siempre). No hay límites de capacidad (u_ij = ∞).'],
                  ['Ruta Más Corta (s → t)', 'Reducir el sistema a: b_s = 1 (origen), b_t = -1 (destino), b_otros = 0. Capacidad u_ij = ∞.'],
                  ['Flujo Máximo', 'Costo c_ij = 0. Agregar un arco ficticio del sumidero a la fuente (t → s) con c_ts = -1 y capacidad ∞, e ilimitado. Minimizar esto maximiza el flujo circular.'],
                  ['Asignación', 'b_origen = 1, b_destino = -1. u_ij = 1. Grafo puramente bipartito.'],
                ].map(([p, cfg]) => (
                  <tr key={p} className="hover:bg-slate-800/50">
                    <td className="border border-slate-700 px-3 py-2 font-bold text-emerald-400">{p}</td>
                    <td className="border border-slate-700 px-3 py-2 text-slate-300 font-sans leading-relaxed">{cfg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      )}

      {tab === 'maxflow' && (
        <div className="space-y-5">
          <Section title="Redes de Flujo Máximo">
            <p>Dado un grafo dirigido capacitado con un nodo origen <code className="text-white">s</code> y un destino <code className="text-white">t</code>, el objetivo es despachar la máxima cantidad de materia sin violar las capacidades <code className="text-emerald-400">u_ij</code> de las tuberías ni las leyes de conservación de energía/materia de Kirchhoff.</p>
             <Math label="Formulación PL del Flujo Máximo:">
              {'Maximizar V\nSujeto a:\nΣ_j x_ij - Σ_k x_ki = \n    {  V   si i = s\n      -V   si i = t\n       0   para todo i \u2260 s,t }\n0 \u2264 x_ij \u2264 u_ij'}
            </Math>
          </Section>

          <Section title="El Teorema Min-Cut Max-Flow (Ford & Fulkerson, 1956)">
             <Callout color="blue" title="Enunciado Central de la Teoría de Redes">
                El valor máximo del flujo desde <strong>s</strong> hasta <strong>t</strong> es matemáticamente idéntico a la capacidad del <strong>corte s-t mínimo</strong>.
             </Callout>
             <p>Un <em>corte</em> es una partición de los nodos en dos conjuntos: <code className="text-white">S</code> (que incluye a s) y <code className="text-white">T</code> (que incluye a t). La capacidad del corte es la suma de las capacidades de los arcos dirigidos desde S hacia T. La red siempre colapsará en su "cuello de botella" global.</p>
          </Section>

          <Section title="Algoritmo de Trayectoria de Aumento (Ford-Fulkerson)">
            <p>La clave del algoritmo recae en usar la <strong>Red Residual</strong>. Si hemos enviado un flujo <code className="text-white">f</code> en un arco de capacidad <code className="text-white">c</code>, la red residual nos permite enviar <code className="text-emerald-400">c - f</code> unidades en dirección directa, pero además nos otorga una capacidad de <code className="text-yellow-400">f</code> unidades en dirección <em>inversa</em>, lo cual equivale algorítmicamente a "deshacer" una decisión subóptima.</p>
            <Code>{`FORD_FULKERSON(G, s, t):
  Para cada arco (u,v), flujo f[u,v] = 0
  Mientras exista una trayectoria p desde s hasta t en el Grafo Residual Gf:
    c_residual(p) = min { cap. residual de los arcos en p }
    Para cada arco (u,v) en p:
      Si (u,v) es arco original (dirección frontal):
         f[u,v] = f[u,v] + c_residual(p)
      Si (u,v) es arco paralelo (dirección inversa):
         f[v,u] = f[v,u] - c_residual(p)
  Fin Mientras
  Retornar suma(f[s,v])`}</Code>
          </Section>

          <Section title="Ejemplo Trazado - Flujo Máximo">
            <p className="text-xs text-slate-400 mb-2">Red simple: O(s), A, B, C, T(t). Capacidades directas.</p>
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-slate-800 text-slate-400">
                <th className="border border-slate-700 px-2 py-2">Iteración</th>
                <th className="border border-slate-700 px-2 py-2">Ruta de Aumento Hallada</th>
                <th className="border border-slate-700 px-2 py-2">Flujo Inyectado</th>
                <th className="border border-slate-700 px-2 py-2">Estado Residual Clave</th>
              </tr></thead>
              <tbody>
                {FF_TRACE.map(r => (
                  <tr key={r.it} className="hover:bg-slate-800/40">
                    <td className="border border-slate-700 px-2 py-2 text-center text-yellow-500 font-bold">{r.it}</td>
                    <td className="border border-slate-700 px-2 py-2 text-emerald-400 font-mono tracking-wider">{r.path}</td>
                    <td className="border border-slate-700 px-2 py-2 text-center text-slate-200">{r.cap}</td>
                    <td className="border border-slate-700 px-2 py-2 text-slate-400">{r.residual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      )}

      {tab === 'mst' && (
        <div className="space-y-5">
           <Section title="Árbol de Expansión Mínima (Minimum Spanning Tree)">
            <p>Se utiliza en redes sin dirección. Se busca enlazar todos los <code className="text-white">V</code> nodos utilizando exactamente <code className="text-emerald-400">V - 1</code> arcos (evitando ciclos), de manera que se minimice la longitud total de cableado / tubería. Es un problema común en telecomunicaciones (fibra óptica) y acueductos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">Algoritmo de Kruskal (Enfoque de Arcos)</h4>
                <p className="text-xs text-slate-400 mb-3">Se exploran las aristas globales de menor costo a mayor. Excelente para grafos dispersos.</p>
                <Code>{`KRUSKAL(V, E):
  MST = vacío
  Ordenar aristas E de menor a mayor peso
  Para cada arista (u,v) en orden:
    Si agregar (u,v) a MST NO forma ciclo:
       MST = MST U {(u,v)}
       Si |MST| == |V|-1: BREAK
  Retornar MST`}</Code>
                <p className="text-xs text-slate-500 mt-2">Detención de ciclos mediante estructura de datos Union-Find.</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
                <h4 className="text-emerald-400 font-bold text-sm mb-2">Algoritmo de Prim (Enfoque de Nodos)</h4>
                <p className="text-xs text-slate-400 mb-3">Se expande el árbol desde un nodo inicial como una mancha de aceite. Mejor para grafos densos.</p>
                <Code>{`PRIM(V, E, inicio):
  MST = vacío
  Visitados = {inicio}
  Mientras |Visitados| < |V|:
    (u,v) = arista mínima tal que:
            u ∈ Visitados y v ∉ Visitados
    Visitados = Visitados U {v}
    MST = MST U {(u,v)}
  Retornar MST`}</Code>
                <p className="text-xs text-slate-500 mt-2">Búsqueda eficiente con Colas de Prioridad (Min-Heap).</p>
              </div>
            </div>
          </Section>

          <Section title="Trazado de Secuencia — Algoritmo de Kruskal">
             <table className="w-full text-xs font-mono border-collapse">
              <thead><tr className="bg-slate-800 text-slate-400">
                <th className="border border-slate-700 px-3 py-2 text-center">Paso</th>
                <th className="border border-slate-700 px-3 py-2">Arco Candidato</th>
                <th className="border border-slate-700 px-3 py-2 text-center">Costo</th>
                <th className="border border-slate-700 px-3 py-2">Decisión Justificada</th>
                <th className="border border-slate-700 px-3 py-2">T (Bosque MST)</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-800">
                {KRUSKAL_TRACE.map(r => (
                  <tr key={r.step} className="hover:bg-slate-800/40">
                    <td className="border border-slate-700 px-3 py-2 text-center text-slate-500">{r.step}</td>
                    <td className="border border-slate-700 px-3 py-2 text-emerald-400 font-bold">{r.edge}</td>
                    <td className="border border-slate-700 px-3 py-2 text-center text-yellow-400">{r.weight}</td>
                    <td className="border border-slate-700 px-3 py-2 text-slate-300">{r.action}</td>
                    <td className="border border-slate-700 px-3 py-2 text-slate-400">{r.mst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </div>
      )}

      {tab === 'assignment' && (
        <div className="space-y-5">
           <Section title="El Problema de Asignación y Matrices Bipartitas">
             <p>El problema de la asignación modela situaciones uno-a-uno: asignar <em>n</em> trabajadores a <em>n</em> tareas con la máxima eficiencia o el menor costo. El modelo requiere un <strong>grafo bipartito perfecto</strong>.</p>
             <Callout color="purple" title="¿Qué es un Grafo Bipartito?">
               Los nodos se dividen en dos subconjuntos ajenos V1 y V2. Todos los arcos válidos conectan únicamente a un nodo de V1 con un nodo de V2. No hay relaciones horizontales dentro del mismo conjunto.
             </Callout>
             <Math label="Formulación PL del Problema de Asignación:">
              {'Min Z = Σ_i Σ_j c_ij \u00B7 x_ij\nSujeto a:\nΣ_j x_ij = 1  (Cada origen asignado exactamente a un destino)\nΣ_i x_ij = 1  (Cada destino es cubierto por exactamente un origen)\nx_ij \u2208 {0,1}'}
            </Math>
            <p>Debido a que es un caso altamente degenerado del Transporte (donde la matriz de coeficientes es Totalmente Unimodular y toda oferta/demanda es 1), no se debe usar Simplex regular, sino algoritmos de grafos como Flujo Máximo o el especial <strong>Algoritmo Húngaro (Kuhn, 1955)</strong>.</p>
             <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-4">
              <h4 className="text-emerald-400 font-bold text-sm mb-2">Resolución Vía Flujo Máximo</h4>
              <p className="text-xs text-slate-300">Si se busca resolver el problema de Asignación Máxima Cartinal (encontrar cuántas parejas viables se pueden formar):</p>
              <ul className="text-xs text-slate-400 list-disc ml-4 space-y-1 mt-2">
                <li>Crear nodo Super Fuente S y conectarlo a todos los nodos Trabajador con costo 0, capacidad 1.</li>
                <li>Conectar Trabajo con Trabajador correspondiente (capacidad 1, costo/peso variable).</li>
                <li>Conectar todos los nodos Tarea a un Super Sumidero T con costo 0, capacidad 1.</li>
                <li>Correr Ford-Fulkerson. El flujo máximo equivale exactamente a la asignación perfecta máxima que se puede realizar.</li>
              </ul>
            </div>
           </Section>
        </div>
      )}
    </div>
  );
}
