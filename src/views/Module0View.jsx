import React, { useState } from 'react';

const Section = ({ title, children }) => (
  <div className="mb-7">
    <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
      <span className="block w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />{title}
    </h3>
    <div className="text-sm text-slate-300 leading-relaxed space-y-3">{children}</div>
  </div>
);

const Callout = ({ color='emerald', title, children }) => {
  const c = { emerald:'border-emerald-500 bg-emerald-500/5', blue:'border-blue-500 bg-blue-500/5', yellow:'border-yellow-500 bg-yellow-500/5' }[color];
  return (
    <div className={`border-l-4 rounded-r-xl p-4 my-3 ${c}`}>
      {title && <p className="font-bold text-sm text-slate-200 mb-1">{title}</p>}
      <div className="text-sm text-slate-300">{children}</div>
    </div>
  );
};

const GraphExample = ({ nodes, edges, directed = false, title }) => {
  const W = 260, H = 160;
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-3">
      <p className="text-xs font-mono text-slate-500 mb-2">{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 130 }}>
        <defs>
          <marker id={`arr-${title}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
          </marker>
        </defs>
        {edges.map(([u, v], i) => {
          const n1 = nodes.find(n => n.id === u), n2 = nodes.find(n => n.id === v);
          if (!n1 || !n2) return null;
          const dx = n2.x - n1.x, dy = n2.y - n1.y;
          const len = Math.sqrt(dx*dx + dy*dy) || 1;
          const ex = n2.x - (dx/len)*18, ey = n2.y - (dy/len)*18;
          return (
            <line key={i} x1={n1.x} y1={n1.y} x2={ex} y2={ey}
              stroke="#10b981" strokeWidth={1.5} strokeOpacity={0.7}
              markerEnd={directed ? `url(#arr-${title})` : undefined} />
          );
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={14} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={1.5} />
            <text x={n.x} y={n.y+5} fill="white" fontSize={10} textAnchor="middle" fontFamily="Inter">{n.label || n.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const GRAPH_TYPES = [
  {
    type: 'No dirigido', icon: '——', color: 'emerald',
    desc: 'Los arcos (u,v) = (v,u): la relación es bidireccional. Ejemplo: red de carreteras (puedes ir en ambas direcciones).',
    nodes: [{id:'A',x:40,y:80},{id:'B',x:130,y:30},{id:'C',x:220,y:80},{id:'D',x:130,y:130}],
    edges: [['A','B'],['B','C'],['C','D'],['D','A'],['B','D']],
    directed: false,
  },
  {
    type: 'Dirigido (Dígrafo)', icon: '→', color: 'blue',
    desc: 'Los arcos (u,v) ≠ (v,u): la relación tiene dirección. Ejemplo: vuelos de aerolíneas, tuberías de fluido.',
    nodes: [{id:'s',x:30,y:80},{id:'A',x:110,y:30},{id:'B',x:110,y:130},{id:'t',x:230,y:80}],
    edges: [['s','A'],['s','B'],['A','t'],['B','t'],['A','B']],
    directed: true,
  },
  {
    type: 'Bipartito', icon: '⊠', color: 'yellow',
    desc: 'V = X ∪ Y, X ∩ Y = ∅: los nodos se dividen en dos conjuntos y los arcos solo van de X a Y. Base del problema de transporte.',
    nodes: [{id:'O1',x:40,y:50},{id:'O2',x:40,y:110},
            {id:'D1',x:210,y:30},{id:'D2',x:210,y:80},{id:'D3',x:210,y:130}],
    edges: [['O1','D1'],['O1','D2'],['O2','D2'],['O2','D3']],
    directed: true,
  },
  {
    type: 'Árbol (grafo acíclico)', icon: '🌲', color: 'emerald',
    desc: 'Grafo conexo sin ciclos. Propiedades: |E| = |V|−1, existe un único camino entre cualquier par de nodos. Base del MST.',
    nodes: [{id:'r',x:130,y:20},{id:'A',x:60,y:80},{id:'B',x:200,y:80},{id:'C',x:30,y:140},{id:'D',x:100,y:140}],
    edges: [['r','A'],['r','B'],['A','C'],['A','D']],
    directed: false,
  },
];

const realExamples = [
  {
    title: 'Red de Transporte Urbano (Bus)', icon: '🚌',
    desc: 'Las estaciones son nodos, las rutas de bus son arcos dirigidos con atributos: tiempo de viaje (peso) y capacidad de pasajeros (cota superior). Un dígrafo capacitado.',
    model: 'Dígrafo capacitado G = (V, A, c, u)',
  },
  {
    title: 'Red de Suministro (Supply Chain)', icon: '🏭',
    desc: 'Plantas → almacenes → distribuidores → puntos de venta. Los bienes fluyen una sola dirección. Las capacidades y costos de los arcos modelan la logística real (Ballou, 2004).',
    model: 'Dígrafo de flujo multi-commodity',
  },
  {
    title: 'Red Eléctrica', icon: '⚡',
    desc: 'Las subestaciones son nodos, las líneas de transmisión son arcos. La energía puede fluir en ambas direcciones → grafo no dirigido. La "capacidad" es la carga máxima del cable.',
    model: 'Grafo no dirigido ponderado G = (V, E, c)',
  },
  {
    title: 'Red Social', icon: '👥',
    desc: '"Seguir" a alguien es una relación dirigida; "ser amigos" es simétrica. La intensidad de relación puede modelarse como peso. Aplicación: algoritmos de recomendación (PageRank usa dígrafo).',
    model: 'Dígrafo / Grafo no dirigido ponderado',
  },
];

export default function Module0View() {
  const [tab, setTab] = useState('intro');
  return (
    <div className="space-y-6 animate-in">
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">UNIDAD 0 · Fundamentos Matemáticos</span>
        <h1 className="text-3xl font-black text-white mt-1">Teoría de Grafos — De la Realidad al Modelo</h1>
        <p className="text-slate-400 mt-1">Diestel (2017) · Ahuja et al. (1993) §1.1 · Taha (2012) §6.1</p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-1">
        {[['intro','🌐 Introducción'],['types','📊 Tipos de Grafos'],['concepts','🔑 Conceptos Clave'],['realworld','🏙️ Modelado Real'],['repres','💾 Representación']].map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-2 text-xs font-semibold rounded-t transition-colors ${tab===id ? 'text-emerald-400 bg-slate-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'intro' && (
        <div className="space-y-5">
          <Section title="¿Qué es un Grafo?">
            <p>
              Un <strong className="text-white">grafo</strong> G = (V, E) es una estructura matemática compuesta por un conjunto de <strong className="text-white">vértices</strong> (o nodos) V y un conjunto de <strong className="text-white">aristas</strong> (o arcos) E que representan relaciones entre pares de vértices. La Teoría de Grafos surgió en 1736 cuando Euler resolvió el problema de los <em>Siete Puentes de Königsberg</em>, demostrando que no era posible cruzar cada puente exactamente una vez.
            </p>
            <p>
              En el contexto de la <em>Investigación de Operaciones</em> (Taha, 2012; Ahuja et al., 1993), los grafos son el lenguaje universal para modelar sistemas con <strong className="text-white">interacciones</strong>: redes de transporte, cadenas de suministro, proyectos de construcción, redes de telecomunicaciones, o cualquier sistema donde existan <em>entidades conectadas</em>.
            </p>
            <Callout color="blue" title="Definición Formal">
              <p>G = (V, A) donde:</p>
              <ul className="mt-2 space-y-1 list-none">
                <li>• V = conjunto finito de <strong>vértices</strong> (nodos): |V| = n</li>
                <li>• A ⊆ V × V = conjunto de <strong>arcos</strong> (aristas): |A| = m</li>
                <li>• Para grafos <em>ponderados</em>: función de peso w: A → ℝ</li>
                <li>• Para grafos <em>capacitados</em>: función de capacidad u: A → ℝ≥0</li>
              </ul>
            </Callout>
          </Section>

          <Section title="El Proceso de Modelado">
            <p>El poder de los grafos radica en su capacidad de <em>abstraer</em> la realidad. El proceso de modelado sigue estos pasos:</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
              {[
                ['1. Observar','Identificar las entidades del sistema y las relaciones entre ellas.','🔍'],
                ['2. Abstraer','Definir qué es un nodo y qué es un arco en el contexto del problema.','🧠'],
                ['3. Parametrizar','Asignar atributos a nodos (oferta/demanda) y arcos (costo, capacidad).','📐'],
                ['4. Resolver','Aplicar el algoritmo adecuado según el tipo de problema de red.','⚙️'],
              ].map(([step, desc, icon]) => (
                <div key={step} className="bg-slate-900 rounded-xl border border-slate-700 p-4 text-center">
                  <div className="text-2xl mb-2">{icon}</div>
                  <p className="font-bold text-slate-200 text-xs mb-1">{step}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === 'types' && (
        <div className="space-y-5">
          <Section title="Clasificación de Grafos">
            <p>Los grafos se clasifican según la naturaleza de sus arcos y las restricciones sobre su estructura:</p>
          </Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GRAPH_TYPES.map(gt => (
              <div key={gt.type} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{gt.icon}</span>
                  <h4 className="font-bold text-slate-200">{gt.type}</h4>
                </div>
                <p className="text-xs text-slate-400 mb-3">{gt.desc}</p>
                <GraphExample nodes={gt.nodes} edges={gt.edges} directed={gt.directed} title={`Ejemplo: ${gt.type}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'concepts' && (
        <div className="space-y-5">
          <Section title="Glosario de Conceptos Fundamentales">
            <div className="space-y-3">
              {[
                { term: 'Grado de un nodo deg(v)', def: 'Número de arcos incidentes en v. En dígrafos: grado de entrada deg⁻(v) y salida deg⁺(v). La suma de grados = 2|E| (Lema de apretón de manos).' },
                { term: 'Camino (Path)', def: 'Sucesión de nodos v₀, v₁,…, vₖ tal que (vᵢ, vᵢ₊₁) ∈ A para todo i. La longitud es el número de arcos k (o la suma de pesos si el grafo es ponderado).' },
                { term: 'Ciclo', def: 'Camino cerrado: el nodo inicial y final coinciden (v₀ = vₖ) y no repite arcos. Un grafo sin ciclos es un bosque; si además es conexo, es un árbol.' },
                { term: 'Grafo Conexo', def: 'Existe un camino entre cualquier par de nodos. En dígrafos: fuertemente conexo si existe camino dirigido entre todos los pares, débilmente conexo si lo es ignorando orientación.' },
                { term: 'Árbol Generador', def: 'Subgrafo conexo sin ciclos que incluye todos los vértices y exactamente |V|−1 aristas. El Árbol de Expansión Mínima (MST) minimiza la suma de pesos.' },
                { term: 'Corte (Cut)', def: 'Partición de V en dos conjuntos S y T = V\\S. La capacidad del corte es la suma de capacidades de los arcos dirigidos de S a T. Fundamental en el teorema Max-Flow Min-Cut.' },
              ].map(({ term, def }) => (
                <div key={term} className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <p className="font-mono font-bold text-emerald-400 text-sm mb-1">{term}</p>
                  <p className="text-sm text-slate-300">{def}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === 'realworld' && (
        <div className="space-y-5">
          <Section title="De la Observación del Mundo Real al Grafo">
            <p>La habilidad más importante en optimización de redes es <strong className="text-white">reconocer la estructura de grafo oculta en un problema real</strong>. Cada sistema tiene sus propias reglas de abstracción:</p>
          </Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {realExamples.map(ex => (
              <div key={ex.title} className="card hover:border-emerald-500/30 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{ex.icon}</span>
                  <h4 className="font-bold text-slate-200">{ex.title}</h4>
                </div>
                <p className="text-sm text-slate-400 mb-3">{ex.desc}</p>
                <div className="bg-slate-900 rounded-lg p-2 text-xs font-mono text-emerald-400 border border-slate-700">
                  Modelo: {ex.model}
                </div>
              </div>
            ))}
          </div>
          <Callout color="yellow" title="Regla de oro del modelado">
            No existe <em>una única</em> representación correcta. Un mismo sistema puede modelarse de múltiples formas según qué pregunta queremos responder. El objetivo es elegir la abstracción que capture <strong>exactamente</strong> las restricciones del problema que deseamos optimizar.
          </Callout>
        </div>
      )}

      {tab === 'repres' && (
        <div className="space-y-5">
          <Section title="Representaciones Computacionales de Grafos">
            <p>Para implementar algoritmos, el grafo debe representarse en una estructura de datos. Las dos más usadas en Optimización de Redes son:</p>
          </Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3">Matriz de Adyacencia A[n×n]</h4>
              <p className="text-xs text-slate-400 mb-3">A[i][j] = peso del arco (i,j), o 0/∞ si no existe.</p>
              <pre className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-emerald-400 font-mono">{`     A  B  C  D
A  [ 0  4  2  ∞ ]
B  [ 4  0  1  5 ]
C  [ 2  1  0  8 ]
D  [ ∞  5  8  0 ]`}</pre>
              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <p>✓ Verificar arco (i,j): O(1)</p>
                <p>✓ Ideal para grafos densos</p>
                <p>✗ Espacio: O(V²) — ineficiente para sparse</p>
              </div>
            </div>
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3">Lista de Adyacencia</h4>
              <p className="text-xs text-slate-400 mb-3">Para cada nodo, lista de sus vecinos con peso. Estándar en grafos dispersos.</p>
              <pre className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-emerald-400 font-mono">{`A: [(B,4), (C,2)]
B: [(A,4), (C,1), (D,5)]
C: [(A,2), (B,1), (D,8)]
D: [(B,5), (C,8)]`}</pre>
              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <p>✓ Espacio: O(V + E)</p>
                <p>✓ Ideal para grafos dispersos (sparse)</p>
                <p>✗ Verificar arco (i,j): O(deg(i))</p>
              </div>
            </div>
          </div>
          <div className="card">
            <h4 className="font-bold text-slate-200 mb-2">¿Cuál usar?</h4>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-slate-700 text-slate-400"><th className="py-2 text-left">Criterio</th><th className="text-center">Matriz</th><th className="text-center">Lista</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {[['Verificar arco (u,v)','O(1)','O(deg)'],
                  ['Listar vecinos de u','O(V)','O(deg(u))'],
                  ['Espacio','O(V²)','O(V+E)'],
                  ['Grafo denso (E≈V²)','✅ Mejor','⬜'],
                  ['Grafo disperso (E≪V²)','⬜','✅ Mejor'],
                ].map(([c,m,l]) => (
                  <tr key={c}><td className="py-2 text-slate-400">{c}</td><td className="text-center text-emerald-400">{m}</td><td className="text-center text-emerald-400">{l}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
