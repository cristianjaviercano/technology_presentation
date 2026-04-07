import React, { useState, useCallback } from 'react';

/* ══════════════════════════════════════════════════════════════
   LEVEL DEFINITIONS
══════════════════════════════════════════════════════════════ */
const LEVELS = [
  {
    id: 0,
    label: '🟢 Nivel 1 — Básico',
    title: 'Red de 4 Nodos',
    desc: 'Grafo simple, caminos cortos, ideal para entender el algoritmo por primera vez.',
    nodes: [
      { id: 'A', x: 80,  y: 180, label: 'A' },
      { id: 'B', x: 240, y: 80,  label: 'B' },
      { id: 'C', x: 240, y: 280, label: 'C' },
      { id: 'D', x: 400, y: 180, label: 'D' },
    ],
    edges: [
      { u: 'A', v: 'B', w: 2 }, { u: 'A', v: 'C', w: 5 },
      { u: 'B', v: 'C', w: 1 }, { u: 'B', v: 'D', w: 7 },
      { u: 'C', v: 'D', w: 3 },
    ],
    source: 'A',
    steps: [
      { visit: 'A', d: { A:0, B:2, C:5, D:Infinity }, note: 'Extraer A(0). Relajar B→2, C→5.' },
      { visit: 'B', d: { A:0, B:2, C:3, D:9 }, note: 'Extraer B(2). Relajar C→3, D→9.' },
      { visit: 'C', d: { A:0, B:2, C:3, D:6 }, note: 'Extraer C(3). Relajar D→6 (mejora 9→6).' },
      { visit: 'D', d: { A:0, B:2, C:3, D:6 }, note: 'Extraer D(6). Todos visitados. ¡ÓPTIMO!' },
    ],
    optimal: { A:0, B:2, C:3, D:6 },
    prev:    { A:null, B:'A', C:'B', D:'C' },
    target: 'D',
  },
  {
    id: 1,
    label: '🟡 Nivel 2 — Intermedio',
    title: 'Red de 6 Nodos (Taha §6.4)',
    desc: 'Grafo estándar de 6 nodos con múltiples rutas y cuellos de botella. Origen: A, Destino: F.',
    nodes: [
      { id: 'A', x: 60,  y: 200, label: 'A' },
      { id: 'B', x: 200, y: 80,  label: 'B' },
      { id: 'C', x: 200, y: 310, label: 'C' },
      { id: 'D', x: 350, y: 80,  label: 'D' },
      { id: 'E', x: 350, y: 310, label: 'E' },
      { id: 'F', x: 490, y: 200, label: 'F' },
    ],
    edges: [
      { u:'A', v:'B', w:4 }, { u:'A', v:'C', w:2 },
      { u:'B', v:'C', w:1 }, { u:'B', v:'D', w:5 },
      { u:'B', v:'E', w:7 }, { u:'C', v:'E', w:8 },
      { u:'D', v:'E', w:2 }, { u:'D', v:'F', w:3 },
      { u:'E', v:'F', w:6 },
    ],
    source: 'A',
    steps: [
      { visit: 'A', d: { A:0, B:4, C:2, D:Infinity, E:Infinity, F:Infinity }, note: 'Extraer A(0). Relajar B→4, C→2.' },
      { visit: 'C', d: { A:0, B:3, C:2, D:Infinity, E:10, F:Infinity }, note: 'Extraer C(2). Relajar B→3 (mejora), E→10.' },
      { visit: 'B', d: { A:0, B:3, C:2, D:8, E:10, F:Infinity }, note: 'Extraer B(3). Relajar D→8, E→10 sin mejora.' },
      { visit: 'D', d: { A:0, B:3, C:2, D:8, E:10, F:11 }, note: 'Extraer D(8). Relajar E→10 sin mejora, F→11.' },
      { visit: 'E', d: { A:0, B:3, C:2, D:8, E:10, F:11 }, note: 'Extraer E(10). F→16 sin mejora. F ya es 11.' },
      { visit: 'F', d: { A:0, B:3, C:2, D:8, E:10, F:11 }, note: 'Extraer F(11). ¡Algoritmo completo! Z*(A→F)=11.' },
    ],
    optimal: { A:0, B:3, C:2, D:8, E:10, F:11 },
    prev:    { A:null, B:'C', C:'A', D:'B', E:'D', F:'D' },
    target: 'F',
  },
  {
    id: 2,
    label: '🔴 Nivel 3 — Avanzado',
    title: 'Red Logística de 8 Nodos',
    desc: 'Red densa con múltiples rutas competitivas. Varios nodos intermedios y cuellos de botella. Origen: S, Destino: T.',
    nodes: [
      { id: 'S', x: 50,  y: 200, label: 'S' },
      { id: 'A', x: 180, y: 80,  label: 'A' },
      { id: 'B', x: 180, y: 200, label: 'B' },
      { id: 'C', x: 180, y: 320, label: 'C' },
      { id: 'D', x: 320, y: 80,  label: 'D' },
      { id: 'E', x: 320, y: 200, label: 'E' },
      { id: 'F', x: 320, y: 320, label: 'F' },
      { id: 'T', x: 450, y: 200, label: 'T' },
    ],
    edges: [
      { u:'S', v:'A', w:3 }, { u:'S', v:'B', w:1 }, { u:'S', v:'C', w:7 },
      { u:'A', v:'D', w:2 }, { u:'A', v:'E', w:5 },
      { u:'B', v:'A', w:1 }, { u:'B', v:'E', w:4 }, { u:'B', v:'F', w:6 },
      { u:'C', v:'F', w:2 },
      { u:'D', v:'T', w:4 }, { u:'E', v:'D', w:1 }, { u:'E', v:'T', w:3 },
      { u:'F', v:'E', w:1 }, { u:'F', v:'T', w:5 },
    ],
    source: 'S',
    steps: [
      { visit:'S', d:{S:0,A:3,B:1,C:7,D:Infinity,E:Infinity,F:Infinity,T:Infinity}, note:'Extraer S(0). Relajar A→3, B→1, C→7.' },
      { visit:'B', d:{S:0,A:2,B:1,C:7,D:Infinity,E:5,F:7,T:Infinity},              note:'Extraer B(1). Relajar A→2 (mejora!), E→5, F→7.' },
      { visit:'A', d:{S:0,A:2,B:1,C:7,D:4,E:5,F:7,T:Infinity},                    note:'Extraer A(2). Relajar D→4, E→7 sin mejora.' },
      { visit:'D', d:{S:0,A:2,B:1,C:7,D:4,E:5,F:7,T:8},                          note:'Extraer D(4). Relajar T→8.' },
      { visit:'E', d:{S:0,A:2,B:1,C:7,D:4,E:5,F:7,T:8},                          note:'Extraer E(5). Relajar D sin mejora, T→8 sin mejora.' },
      { visit:'C', d:{S:0,A:2,B:1,C:7,D:4,E:5,F:7,T:8},                          note:'Extraer C(7). F→9 sin mejora (ya es 7).' },
      { visit:'F', d:{S:0,A:2,B:1,C:7,D:4,E:5,F:7,T:8},                          note:'Extraer F(7). E→8 sin mejora, T→12 sin mejora.' },
      { visit:'T', d:{S:0,A:2,B:1,C:7,D:4,E:5,F:7,T:8},                          note:'Extraer T(8). ¡ÓPTIMO! Z*(S→T) = 8.' },
    ],
    optimal: { S:0, A:2, B:1, C:7, D:4, E:5, F:7, T:8 },
    prev:    { S:null, A:'B', B:'S', C:'S', D:'A', E:'B', F:'B', T:'D' },
    target: 'T',
  },
];

/* ── Floyd-Warshall interactive tab ──────────────────────────────────── */
const FW_NODES = ['1','2','3','4'];
const INF_VAL = 999;
const FW_INIT_W = [
  [0, 3, INF_VAL, 7],
  [8, 0, 2, INF_VAL],
  [5, INF_VAL, 0, 1],
  [2, INF_VAL, INF_VAL, 0],
];

function runFW(W) {
  const n = 4;
  const steps = [];
  const D = W.map(r => [...r]);
  steps.push({ k: 0, D: D.map(r=>[...r]), desc: 'Matriz inicial D(0)' });
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (D[i][k] + D[k][j] < D[i][j]) {
          D[i][j] = D[i][k] + D[k][j];
        }
      }
    }
    steps.push({ k: k+1, D: D.map(r=>[...r]), desc: `D(${k+1}): pivote = nodo ${k+1}` });
  }
  return steps;
}

const FW_STEPS = runFW(FW_INIT_W);

/* ── Helpers ──────────────────────────────────────────────────────────── */
function fmt(v) { return v >= INF_VAL ? '∞' : v; }

function getOptimalPath(prev, source, target) {
  const path = [];
  let cur = target;
  const visited = new Set();
  while (cur !== null && cur !== undefined && !visited.has(cur)) {
    visited.add(cur);
    path.unshift(cur);
    if (cur === source) break;
    cur = prev[cur];
  }
  return path;
}

/* ── SVG Graph Component ─────────────────────────────────────────────── */
function GraphSVG({ level, step, finished }) {
  const { nodes, edges, source, steps, optimal, prev, target } = level;
  const currentStep = steps[step] || steps[steps.length - 1];
  const d = currentStep.d;
  const visited = steps.slice(0, step + 1).map(s => s.visit);
  const optPath = finished ? getOptimalPath(prev, source, target) : [];

  const vbW = 560, vbH = 400;

  const nodeColor = (id) => {
    if (finished && optPath.includes(id)) return '#065f46';
    if (currentStep.visit === id) return '#78350f';
    if (visited.includes(id)) return '#1e3a5f';
    return '#1e293b';
  };
  const nodeStroke = (id) => {
    if (finished && optPath.includes(id)) return '#10b981';
    if (currentStep.visit === id) return '#f59e0b';
    if (visited.includes(id)) return '#3b82f6';
    return '#334155';
  };

  const edgeOnPath = (u, v) => {
    if (!finished) return false;
    for (let i = 0; i < optPath.length - 1; i++) {
      if ((optPath[i]===u && optPath[i+1]===v) || (optPath[i]===v && optPath[i+1]===u)) return true;
    }
    return false;
  };

  const midX = (u, v) => (u.x + v.x) / 2;
  const midY = (u, v) => (u.y + v.y) / 2;

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full" style={{ maxHeight: 340 }}>
      {/* Edges */}
      {edges.map((e, i) => {
        const n1 = nodes.find(n => n.id === e.u);
        const n2 = nodes.find(n => n.id === e.v);
        const onPath = edgeOnPath(e.u, e.v);
        return (
          <g key={i}>
            <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={onPath ? '#10b981' : '#334155'}
              strokeWidth={onPath ? 3 : 1.5}
              strokeOpacity={onPath ? 1 : 0.5} />
            <text x={midX(n1,n2)} y={midY(n1,n2)-6}
              fill={onPath ? '#6ee7b7' : '#64748b'} fontSize={10} textAnchor="middle" fontFamily="JetBrains Mono">{e.w}</text>
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map(n => {
        const dist = d[n.id];
        const distStr = dist === Infinity || dist === undefined ? '∞' : dist;
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={24} fill={nodeColor(n.id)} stroke={nodeStroke(n.id)} strokeWidth={2.5} />
            <text x={n.x} y={n.y + 5} fill="white" fontSize={13} textAnchor="middle" fontWeight="bold" fontFamily="Inter">{n.label}</text>
            {/* Distance label */}
            <rect x={n.x-16} y={n.y+28} width={32} height={15} rx={4} fill="#0f172a" />
            <text x={n.x} y={n.y+40} fill={distStr==='∞' ? '#475569':'#6ee7b7'} fontSize={10} textAnchor="middle" fontFamily="JetBrains Mono">{distStr}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN LAB COMPONENT
══════════════════════════════════════════════════════════════ */
export default function LabDijkstra() {
  const [mode, setMode] = useState('dijkstra'); // 'dijkstra' | 'floyd'
  const [lvlIdx, setLvlIdx] = useState(0);
  const level = LEVELS[lvlIdx];
  const [step, setStep] = useState(0);
  const [fwStep, setFwStep] = useState(0);

  const totalSteps = level.steps.length - 1;
  const finished = step >= totalSteps;

  const changeLevel = useCallback((i) => {
    setLvlIdx(i);
    setStep(0);
  }, []);

  const curStep = level.steps[step];
  const optPath = finished ? getOptimalPath(level.prev, level.source, level.target) : [];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">LAB 2 · Algoritmos de Ruta</span>
        <h1 className="text-3xl font-black text-white mt-1">Visualizador de Camino Más Corto</h1>
        <p className="text-slate-400 mt-1">3 niveles de Dijkstra + simulador Floyd-Warshall por matrices</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-3">
        <button onClick={() => setMode('dijkstra')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${mode==='dijkstra' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
          ⚡ Dijkstra
        </button>
        <button onClick={() => setMode('floyd')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${mode==='floyd' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
          🔢 Floyd-Warshall
        </button>
      </div>

      {/* ── DIJKSTRA MODE ── */}
      {mode === 'dijkstra' && (
        <>
          {/* Level selector */}
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l, i) => (
              <button key={l.id} onClick={() => changeLevel(i)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
                  ${lvlIdx===i ? 'bg-slate-700 border-slate-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}>
                {l.label}
              </button>
            ))}
          </div>

          {/* Level info */}
          <div className="card border-slate-700">
            <h3 className="font-bold text-slate-200">{level.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{level.desc}</p>
            <div className="flex gap-4 mt-2 text-xs text-slate-500">
              <span>Origen: <strong className="text-emerald-400">{level.source}</strong></span>
              <span>Destino: <strong className="text-emerald-400">{level.target}</strong></span>
              <span>Nodos: <strong className="text-slate-300">{level.nodes.length}</strong></span>
              <span>Arcos: <strong className="text-slate-300">{level.edges.length}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Graph */}
            <div className="xl:col-span-2 bg-slate-900 rounded-2xl border border-slate-700 p-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-3 text-xs">
                {[
                  ['bg-gray-700 border-slate-500', 'Sin visitar'],
                  ['bg-amber-900 border-yellow-500', 'Actual'],
                  ['bg-blue-900 border-blue-500', 'Visitado'],
                  ['bg-emerald-900 border-emerald-500', 'Ruta óptima'],
                ].map(([cls, lbl]) => (
                  <div key={lbl} className="flex items-center gap-1.5">
                    <div className={`w-4 h-4 rounded-full border ${cls}`} />
                    <span className="text-slate-400">{lbl}</span>
                  </div>
                ))}
              </div>
              <GraphSVG level={level} step={step} finished={finished} />
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Step info */}
              <div className="card">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Iteración</span>
                  <span className="font-mono">{step} / {totalSteps}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(step/totalSteps)*100}%` }} />
                </div>
                <p className="text-xs font-mono text-yellow-400 mb-1">Extrayendo: <strong>{curStep.visit}</strong></p>
                <p className="text-xs text-slate-400 leading-relaxed">{curStep.note}</p>
              </div>

              {/* Distance table */}
              <div className="card">
                <p className="text-xs font-mono text-slate-400 mb-2">Tabla d[ ]:</p>
                <div className="space-y-1">
                  {level.nodes.map(n => {
                    const dist = curStep.d[n.id];
                    const visited = level.steps.slice(0, step+1).map(s=>s.visit).includes(n.id);
                    return (
                      <div key={n.id} className={`flex justify-between text-xs px-2 py-1 rounded ${visited ? 'bg-emerald-500/10' : n.id===curStep.visit ? 'bg-yellow-500/10' : ''}`}>
                        <span className="font-mono text-slate-300">{n.id}</span>
                        <span className={`font-mono font-bold ${visited ? 'text-emerald-400' : n.id===curStep.visit ? 'text-yellow-400' : 'text-slate-400'}`}>
                          {dist === Infinity ? '∞' : dist}
                          {visited && ' ✓'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button onClick={() => setStep(s => Math.max(0, s-1))}
                  disabled={step===0}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl disabled:opacity-30 transition-colors">
                  ← Anterior
                </button>
                <button onClick={() => setStep(s => Math.min(totalSteps, s+1))}
                  disabled={step===totalSteps}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl disabled:opacity-30 transition-colors">
                  Siguiente →
                </button>
              </div>
              <button onClick={() => setStep(0)} className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 border border-slate-800 rounded-xl transition-colors">
                ↺ Reiniciar
              </button>

              {/* Result */}
              {finished && (
                <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3">
                  <p className="text-emerald-400 font-bold text-sm mb-1">🏆 Camino Óptimo</p>
                  <p className="font-mono text-slate-200 text-sm">{optPath.join(' → ')}</p>
                  <p className="text-emerald-400 font-mono font-bold mt-1">
                    Z* = {level.optimal[level.target]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Full distance table at bottom */}
          {finished && (
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Tabla de Distancias Mínimas desde {level.source}</h4>
              <div className="overflow-x-auto">
                <table className="text-xs font-mono border-collapse w-full">
                  <thead>
                    <tr className="bg-slate-800">
                      <th className="border border-slate-700 px-3 py-2 text-slate-400">Destino</th>
                      <th className="border border-slate-700 px-3 py-2 text-slate-400">d*</th>
                      <th className="border border-slate-700 px-3 py-2 text-slate-400">prev</th>
                      <th className="border border-slate-700 px-3 py-2 text-slate-400">Ruta óptima</th>
                    </tr>
                  </thead>
                  <tbody>
                    {level.nodes.filter(n => n.id !== level.source).map(n => {
                      const path = getOptimalPath(level.prev, level.source, n.id);
                      return (
                        <tr key={n.id} className={`hover:bg-slate-800/50 ${n.id===level.target ? 'bg-emerald-500/5' : ''}`}>
                          <td className="border border-slate-700 px-3 py-2 text-emerald-400 font-bold">{n.id}</td>
                          <td className="border border-slate-700 px-3 py-2 text-center text-white font-bold">{level.optimal[n.id]}</td>
                          <td className="border border-slate-700 px-3 py-2 text-center text-yellow-400">{level.prev[n.id] || '—'}</td>
                          <td className="border border-slate-700 px-3 py-2 text-slate-300">{path.join(' → ')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── FLOYD-WARSHALL MODE ── */}
      {mode === 'floyd' && (
        <div className="space-y-5">
          <div className="card border-blue-500/20">
            <h3 className="font-bold text-slate-200 mb-1">Floyd-Warshall — Simulación Matricial</h3>
            <p className="text-sm text-slate-400">4 nodos, arcos dirigidos. Navega las matrices D(k) para ver cómo evoluciona la distancia mínima entre todos los pares.</p>
            <div className="mt-2 bg-slate-900 rounded-lg p-2 text-xs font-mono text-emerald-400 border border-slate-700">
              Arcos: 1→2(3), 1→4(7), 2→1(8), 2→3(2), 3→1(5), 3→4(1), 4→1(2)
            </div>
          </div>

          {/* Pivot selector */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-500">Pivote k =</span>
            {FW_STEPS.map((s, i) => (
              <button key={i} onClick={() => setFwStep(i)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border
                  ${fwStep===i ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
                {i === 0 ? '0' : i}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current matrix */}
            <div className="card border-blue-500/20">
              <p className="text-xs font-mono text-blue-400 mb-3">{FW_STEPS[fwStep].desc}</p>
              <table className="w-full text-sm font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 p-2 text-slate-400">→</th>
                    {FW_NODES.map(n => <th key={n} className="border border-slate-700 p-2 text-emerald-400">{n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {FW_STEPS[fwStep].D.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-slate-700 p-2 text-emerald-400 font-bold">{i+1}</td>
                      {row.map((v, j) => {
                        const prev = fwStep > 0 ? FW_STEPS[fwStep-1].D[i][j] : v;
                        const changed = v !== prev;
                        return (
                          <td key={j} className={`border border-slate-700 p-2 text-center font-bold
                            ${i===j ? 'text-slate-600' : changed ? 'text-yellow-400 bg-yellow-500/10' : v >= INF_VAL ? 'text-slate-600' : 'text-slate-300'}`}>
                            {fmt(v)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {fwStep > 0 && (
                <p className="text-xs text-yellow-400 mt-2">🟡 Celdas amarillas = valores actualizados en k={fwStep}</p>
              )}
            </div>

            {/* Nav + explanation */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={() => setFwStep(s => Math.max(0, s-1))} disabled={fwStep===0}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-xl disabled:opacity-30 transition-colors">
                  ← Anterior
                </button>
                <button onClick={() => setFwStep(s => Math.min(FW_STEPS.length-1, s+1))} disabled={fwStep===FW_STEPS.length-1}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl disabled:opacity-30 transition-colors">
                  Siguiente →
                </button>
              </div>

              <div className="card">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Recurrencia activa</p>
                <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-emerald-400">
                  {fwStep === 0
                    ? 'D(0)[i][j] = w(i,j)  ó  ∞'
                    : `D[i][j] = min( D[i][j],  D[i][${fwStep}] + D[${fwStep}][j] )`
                  }
                </div>
              </div>

              {fwStep === FW_STEPS.length-1 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-400 font-bold text-sm mb-2">✅ Matriz óptima D(4) final</p>
                  <div className="space-y-1 text-xs text-slate-300">
                    <p>• d(2→4) = <strong className="text-yellow-400">3</strong> → ruta 2→3→4 = 2+1</p>
                    <p>• d(4→2) = <strong className="text-yellow-400">5</strong> → ruta 4→1→2 = 2+3</p>
                    <p>• d(3→2) = <strong className="text-yellow-400">8</strong> → ruta 3→1→2 = 5+3</p>
                    <p>• Diagonal = 0 (no hay ciclos negativos)</p>
                  </div>
                </div>
              )}

              <div className="card text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">Complejidades:</p>
                <p>⏱ Tiempo: <code className="text-emerald-400">O(V³)</code> = O(4³) = 64 operaciones</p>
                <p>💾 Espacio: <code className="text-emerald-400">O(V²)</code> = 16 celdas</p>
                <p>⚠️ Pesos negativos: ✅ permitidos</p>
                <p>⚠️ Ciclos negativos: ❌ D[i][i] &lt; 0</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
