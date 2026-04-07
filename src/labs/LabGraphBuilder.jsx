import React, { useState, useRef, useCallback } from 'react';

// ─── Problem catalogue ────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    id: 'p1', title: 'Red Vial',
    text: `Una ciudad tiene 4 intersecciones importantes: el Centro (C), el Aeropuerto (A), la Universidad (U) y el Hospital (H).
• La calle va del Centro al Aeropuerto (no hay regreso directo por esa vía).
• Del Centro se puede llegar a la Universidad (bidireccional).
• Del Aeropuerto al Hospital y de la Universidad al Hospital (ambas bidireccionales).
• No hay conexión directa entre el Aeropuerto y la Universidad.

Construye el dígrafo de la red vial con los 4 nodos y sus conexiones.`,
    expectedNodes: 4,
    expectedEdges: 5,
    directed: true,
    hint: 'Necesitas 4 nodos y 5 arcos. El arco C→A es dirigido. Los demás son bidireccionales (2 arcos cada uno).',
    solution: ['C','A','U','H'],
    solutionEdges: [['C','A'],['C','U'],['U','C'],['A','H'],['H','A'],['U','H'],['H','U']],
  },
  {
    id: 'p2', title: 'Red de Suministro',
    text: `Una cadena de suministro tiene:
• 2 plantas de producción (P1 y P2).
• 1 centro de distribución (CD).
• 3 tiendas (T1, T2, T3).

El flujo de mercancía va siempre: Plantas → Centro de Distribución → Tiendas.
Cada planta tiene arco hacia el CD. El CD tiene arco hacia cada tienda.
No hay arcos directos entre plantas ni entre tiendas.

Construye el dígrafo de esta red de suministro (6 nodos, 5 arcos dirigidos).`,
    expectedNodes: 6,
    expectedEdges: 5,
    directed: true,
    hint: '2 arcos de plantas al CD, y 3 arcos del CD a las tiendas = 5 arcos total.',
    solution: ['P1','P2','CD','T1','T2','T3'],
    solutionEdges: [['P1','CD'],['P2','CD'],['CD','T1'],['CD','T2'],['CD','T3']],
  },
  {
    id: 'p3', title: 'Red Social',
    text: `En un equipo de trabajo de 5 personas (Ana, Boris, Clara, Diego, Elena):
• Ana y Boris trabajan juntos (bidireccional).
• Boris coordina con Clara y con Diego (bidireccional).
• Clara y Elena son compañeras directas (bidireccional).
• Diego no tiene colaboración con Ana ni con Elena.
• Elena colabora con Ana (bidireccional).

Construye el grafo no dirigido de colaboración del equipo (5 nodos, 5 aristas).`,
    expectedNodes: 5,
    expectedEdges: 5,
    directed: false,
    hint: 'Las aristas son: A-B, B-C, B-D, C-E, A-E. Recuerda que en grafo no dirigido cada arista cuenta como 1.',
    solution: ['Ana','Boris','Clara','Diego','Elena'],
    solutionEdges: [['Ana','Boris'],['Boris','Clara'],['Boris','Diego'],['Clara','Elena'],['Ana','Elena']],
  },
];

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4'];

function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export default function LabGraphBuilder() {
  const [pid, setPid] = useState(0);
  const prob = PROBLEMS[pid];
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [validated, setValidated] = useState(null); // null | 'ok' | 'fail'
  const [validMsg, setValidMsg] = useState('');
  const svgRef = useRef();

  const reset = useCallback((newPid = pid) => {
    setNodes([]); setEdges([]); setSelected(null);
    setShowHint(false); setValidated(null); setValidMsg('');
    if (newPid !== undefined) setPid(newPid);
  }, [pid]);

  const handleSvgClick = (e) => {
    if (e.target !== svgRef.current && e.target.tagName !== 'svg') return;
    const rect = svgRef.current.getBoundingClientRect();
    const vbW = 560, vbH = 380;
    const x = ((e.clientX - rect.left) / rect.width) * vbW;
    const y = ((e.clientY - rect.top) / rect.height) * vbH;
    const label = String.fromCharCode(65 + nodes.length);
    const color = COLORS[nodes.length % COLORS.length];
    setNodes(prev => [...prev, { id: `n${prev.length}`, label, x, y, color }]);
    setSelected(null);
    setValidated(null);
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (selected === null) {
      setSelected(nodeId);
    } else if (selected === nodeId) {
      setSelected(null);
    } else {
      // Check if edge already exists
      const exists = edges.some(([a, b]) => a === selected && b === nodeId);
      if (!exists) {
        setEdges(prev => {
          const newEdges = [...prev, [selected, nodeId]];
          if (!prob.directed) newEdges.push([nodeId, selected]);
          return newEdges;
        });
      }
      setSelected(null);
      setValidated(null);
    }
  };

  const removeNode = (nodeId, e) => {
    e.stopPropagation();
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(([a, b]) => a !== nodeId && b !== nodeId));
    if (selected === nodeId) setSelected(null);
    setValidated(null);
  };

  const removeEdge = (idx, e) => {
    e.stopPropagation();
    setEdges(prev => {
      const next = [...prev];
      if (!prob.directed) {
        // remove pair
        const [a, b] = next[idx];
        return next.filter(([x, y], i) => !((x===a && y===b) || (x===b && y===a)));
      }
      next.splice(idx, 1);
      return next;
    });
    setValidated(null);
  };

  const validate = () => {
    const displayedEdges = prob.directed ? edges : edges.filter((_, i) => {
      // deduplicate undirected
      const [a, b] = edges[i];
      return edges.findIndex(([x, y]) => (x===a && y===b) || (x===b && y===a)) === i;
    });
    const nc = nodes.length;
    const ec = prob.directed ? edges.length : displayedEdges.length;
    if (nc !== prob.expectedNodes) {
      setValidated('fail');
      setValidMsg(`Tienes ${nc} nodos pero el problema requiere exactamente ${prob.expectedNodes}. ${nc < prob.expectedNodes ? 'Haz clic en el canvas para agregar más nodos.' : 'Elimina algún nodo haciendo doble clic.'}`);
      return;
    }
    if (ec !== prob.expectedEdges) {
      setValidated('fail');
      setValidMsg(`Tienes ${ec} arco(s) pero el problema requiere ${prob.expectedEdges}. ${ec < prob.expectedEdges ? 'Selecciona dos nodos para conectarlos.' : 'Elimina arcos haciendo doble clic sobre ellos.'}`);
      return;
    }
    setValidated('ok');
    setValidMsg('¡Excelente! Tu grafo tiene el número correcto de nodos y arcos. La estructura es válida.');
  };

  const selectedNode = nodes.find(n => n.id === selected);

  return (
    <div className="space-y-6 animate-in">
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">LAB 0 · Teoría de Grafos</span>
        <h1 className="text-3xl font-black text-white mt-1">Constructor de Grafos</h1>
        <p className="text-slate-400 mt-1">Lee el problema, identifica nodos y arcos, y construye el grafo en el canvas</p>
      </div>

      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, i) => (
          <button key={i} onClick={() => reset(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
              ${pid===i ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Problem text panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card border-blue-500/20">
            <p className="text-xs text-blue-400 font-mono font-bold mb-2">
              {prob.directed ? '→ DÍGRAFO DIRIGIDO' : '— GRAFO NO DIRIGIDO'}
            </p>
            <h4 className="font-bold text-slate-200 mb-3">{prob.title}</h4>
            <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{prob.text}</pre>
          </div>

          {/* Instructions */}
          <div className="card text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-300">📋 Instrucciones:</p>
            <p>• <strong className="text-white">Haz clic en el canvas</strong> para agregar un nodo</p>
            <p>• <strong className="text-white">Clic en nodo A</strong> → <strong className="text-white">clic en nodo B</strong> para crear un arco</p>
            <p>• <strong className="text-white">Doble clic</strong> en un nodo para eliminarlo</p>
            <p>• <strong className="text-white">Doble clic</strong> en la mitad de un arco para eliminarlo</p>
            {prob.directed && <p>• Los arcos son <strong className="text-emerald-400">dirigidos</strong> (flecha de A→B)</p>}
            {!prob.directed && <p>• Los arcos son <strong className="text-emerald-400">no dirigidos</strong> (sin flecha)</p>}
          </div>

          {/* Counter */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`card text-center ${nodes.length === prob.expectedNodes ? 'border-emerald-500/50' : ''}`}>
              <p className="text-2xl font-black text-white">{nodes.length}</p>
              <p className="text-xs text-slate-500">nodos <span className="text-slate-600">/ {prob.expectedNodes}</span></p>
            </div>
            <div className={`card text-center ${(prob.directed ? edges.length : edges.filter((_,i) => { const [a,b]=edges[i]; return edges.findIndex(([x,y])=>(x===a&&y===b)||(x===b&&y===a))===i; }).length) === prob.expectedEdges ? 'border-emerald-500/50' : ''}`}>
              <p className="text-2xl font-black text-white">
                {prob.directed ? edges.length : edges.filter((_,i)=>{const [a,b]=edges[i];return edges.findIndex(([x,y])=>(x===a&&y===b)||(x===b&&y===a))===i;}).length}
              </p>
              <p className="text-xs text-slate-500">arcos <span className="text-slate-600">/ {prob.expectedEdges}</span></p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button onClick={validate} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm">
              ✓ Validar mi Grafo
            </button>
            <button onClick={() => setShowHint(!showHint)} className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-colors">
              💡 {showHint ? 'Ocultar pista' : 'Ver pista'}
            </button>
            <button onClick={() => reset(pid)} className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ↺ Limpiar canvas
            </button>
          </div>

          {showHint && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-xs text-yellow-300">
              <p className="font-bold mb-1">💡 Pista</p>
              {prob.hint}
            </div>
          )}

          {validated && (
            <div className={`rounded-xl p-3 text-sm border ${validated==='ok' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-300'}`}>
              <p className="font-bold mb-1">{validated==='ok' ? '🎉 ¡Correcto!' : '❌ Revisar'}</p>
              {validMsg}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700 overflow-hidden" style={{ minHeight: 400 }}>
            <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Canvas — haz clic para agregar nodos</span>
              {selected && <span className="text-xs text-yellow-400 font-mono">Nodo {selectedNode?.label} seleccionado — haz clic en otro nodo para conectar</span>}
            </div>
            <svg ref={svgRef} viewBox="0 0 560 380" className="w-full cursor-crosshair" style={{ minHeight: 360 }} onClick={handleSvgClick}>
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Edges */}
              {edges.map(([sourceId, targetId], idx) => {
                const s = nodes.find(n => n.id === sourceId);
                const t = nodes.find(n => n.id === targetId);
                if (!s || !t) return null;
                if (!prob.directed) {
                  const [a, b] = [sourceId, targetId].sort();
                  const canonical = edges.findIndex(([x, y]) => {
                    const [cx, cy] = [x, y].sort();
                    return cx === a && cy === b;
                  });
                  if (canonical !== idx) return null;
                }
                const dx = t.x - s.x, dy = t.y - s.y;
                const len = Math.sqrt(dx*dx + dy*dy) || 1;
                const ex = t.x - (dx/len)*20, ey = t.y - (dy/len)*20;
                const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
                return (
                  <g key={`${sourceId}-${targetId}-${idx}`}>
                    <line x1={s.x} y1={s.y} x2={ex} y2={ey}
                      stroke="#10b981" strokeWidth={2} strokeOpacity={0.7}
                      markerEnd={prob.directed ? 'url(#arrowhead)' : undefined} />
                    {/* clickable midpoint to remove */}
                    <circle cx={mx} cy={my} r={8} fill="transparent" className="cursor-pointer"
                      onDoubleClick={(e) => removeEdge(idx, e)} />
                    <circle cx={mx} cy={my} r={3} fill="#10b981" opacity={0.4} />
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map(n => (
                <g key={n.id} onClick={(e) => handleNodeClick(e, n.id)} onDoubleClick={(e) => removeNode(n.id, e)}
                  className="cursor-pointer">
                  <circle cx={n.x} cy={n.y} r={22}
                    fill={selected === n.id ? '#065f46' : '#1e293b'}
                    stroke={selected === n.id ? '#10b981' : n.color}
                    strokeWidth={selected === n.id ? 3 : 2}
                    style={{ transition: 'all 0.15s' }} />
                  <text x={n.x} y={n.y + 5} fill="white" fontSize={13} textAnchor="middle" fontWeight="bold" fontFamily="Inter">{n.label}</text>
                </g>
              ))}

              {/* Empty state */}
              {nodes.length === 0 && (
                <g>
                  <text x={280} y={180} fill="#334155" fontSize={14} textAnchor="middle" fontFamily="Inter">Haz clic aquí para agregar el primer nodo</text>
                  <text x={280} y={200} fill="#1e293b" fontSize={11} textAnchor="middle" fontFamily="Inter">Cada clic agrega un nodo con su letra (A, B, C…)</text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
