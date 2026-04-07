import React, { useState } from 'react';

// ─── Problem definitions ──────────────────────────────────────────────────────
const PROBLEMS = [
  {
    id: 0,
    title: 'Problema Básico 2×2',
    desc: 'Dos plantas (Montería y Sincelejo) deben abastecer dos centros de distribución. Oferta total = Demanda total = 250 ton.',
    origins: ['Montería (S₁=100)', 'Sincelejo (S₂=150)'],
    dests: ['CD-Bogotá (D₁=120)', 'CD-Cali (D₂=130)'],
    supply: [100, 150],
    demand: [120, 130],
    costs: [[5, 8], [7, 4]],
    // optimal: x[0][0]=100, x[1][0]=20, x[1][1]=130  → Z = 500+140+520 = 1160
    optimal: [[100, 0], [20, 130]],
    optZ: 1160,
    transshipment: false,
  },
  {
    id: 1,
    title: 'Problema Balanceado 3×4',
    desc: 'Tres plantas colombianas abastecen cuatro centros de distribución. Sistema balanceado. Inspirado en Taha §5.2.',
    origins: ['Planta Barranquilla (S₁=120)', 'Planta Bogotá (S₂=80)', 'Planta Medellín (S₃=100)'],
    dests: ['CD-Norte (D₁=70)', 'CD-Sur (D₂=60)', 'CD-Este (D₃=90)', 'CD-Oeste (D₄=80)'],
    supply: [120, 80, 100],
    demand: [70, 60, 90, 80],
    costs: [[2, 3, 1, 7], [5, 4, 2, 3], [3, 6, 5, 4]],
    // BFS via VAM then MODI: x[0][2]=90, x[0][0]=30, x[1][1]=60,x[1][3]=20, x[2][0]=40,x[2][3]=60
    optimal: [[30, 0, 90, 0], [0, 60, 0, 20], [40, 0, 0, 60]],
    optZ: 30*2+90*1+60*4+20*3+40*3+60*4, // = 60+90+240+60+120+240 = 810
    transshipment: false,
  },
  {
    id: 2,
    title: 'Transbordo con Nodo Intermedio',
    desc: 'Dos plantas envían mercancía que puede pasar por un almacén de transbordo (Cross-Dock) antes de llegar a los destinos. Los nodos intermedios tienen balance = 0.',
    origins: ['Planta Norte (b₁=+150)', 'Planta Sur (b₂=+100)'],
    transNodes: ['Cross-Dock Central (b₃=0)'],
    dests: ['Destino A (b₄=-120)', 'Destino B (b₅=-130)'],
    supply: [150, 100],
    demand: [120, 130],
    costs: [[3, 7], [5, 2], [4, 6]], // [N->A, N->B], [S->A, S->B], [CD->A, CD->B]  (simplified)
    // For display we simplify: direct arcs from origins to dests, plus passing via cross-dock
    // optimal direct solution: x[0][0]=120, x[0][1]=30, x[1][1]=100  → Z=120*3+30*7+100*2 = 360+210+200=770
    optimal: [[120, 30], [0, 100]],
    optZ: 770,
    transshipment: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function calcZ(flows, costs) {
  let z = 0;
  for (let i = 0; i < flows.length; i++)
    for (let j = 0; j < (flows[i]||[]).length; j++)
      z += (flows[i][j] || 0) * (costs[i][j] || 0);
  return z;
}

function initFlows(m, n) {
  return Array.from({ length: m }, () => Array(n).fill(0));
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LabTransport() {
  const [pid, setPid] = useState(0);
  const prob = PROBLEMS[pid];
  const m = prob.supply.length, n = prob.demand.length;

  const [flows, setFlows] = useState(initFlows(m, n));
  const [optimized, setOptimized] = useState(false);

  const usedSupply = Array.from({ length: m }, (_, i) => flows[i].reduce((a, v) => a + v, 0));
  const usedDemand = Array.from({ length: n }, (_, j) => flows.reduce((a, row) => a + row[j], 0));
  const Z = calcZ(flows, prob.costs);

  const ok_supply = usedSupply.map((u, i) => u <= prob.supply[i]);
  const ok_demand = usedDemand.map((u, j) => u === prob.demand[j]);
  const feasible = ok_supply.every(Boolean) && ok_demand.every(Boolean);
  const optimal = feasible && Math.abs(Z - prob.optZ) < 1;

  const setFlow = (i, j, v) => {
    setOptimized(false);
    setFlows(prev => {
      const next = prev.map(r => [...r]);
      next[i][j] = Math.max(0, parseInt(v) || 0);
      return next;
    });
  };

  const handleOptimize = () => {
    setFlows(prob.optimal.map(r => [...r]));
    setOptimized(true);
  };

  const handleChangeProblem = (newPid) => {
    const p = PROBLEMS[newPid];
    setPid(newPid);
    setFlows(initFlows(p.supply.length, p.demand.length));
    setOptimized(false);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">LAB 1 · Programación Lineal</span>
        <h1 className="text-3xl font-black text-white mt-1">Laboratorio de Transporte</h1>
        <p className="text-slate-400 mt-1">Ajusta las variables xᵢⱼ manualmente o usa "Optimizar" para ver la solución óptima</p>
      </div>

      {/* Problem selector */}
      <div className="flex flex-wrap gap-2">
        {PROBLEMS.map((p, i) => (
          <button key={i} onClick={() => handleChangeProblem(i)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border
              ${pid === i ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}>
            {p.title}
          </button>
        ))}
      </div>

      {/* Problem description */}
      <div className="card border-blue-500/20">
        <p className="text-xs text-blue-400 font-mono font-bold mb-1">
          {prob.transshipment ? '🔄 TRANSBORDO' : '📦 TRANSPORTE'}
        </p>
        <p className="text-sm text-slate-300">{prob.desc}</p>
        {prob.transshipment && (
          <div className="mt-3 flex gap-3 flex-wrap text-xs">
            {prob.transNodes?.map(t => (
              <span key={t} className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-lg">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Cost table + flow controls */}
        <div className="xl:col-span-2 space-y-4">
          {/* Table */}
          <div className="card">
            <h4 className="font-bold text-slate-200 mb-3 text-sm">Costos unitarios cᵢⱼ y flujos xᵢⱼ</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-900">
                    <th className="border border-slate-700 px-2 py-2 text-slate-500"></th>
                    {prob.dests.map(d => <th key={d} className="border border-slate-700 px-2 py-2 text-emerald-400">{d}</th>)}
                    <th className="border border-slate-700 px-2 py-2 text-yellow-400">Uso/Oferta</th>
                  </tr>
                </thead>
                <tbody>
                  {prob.origins.map((org, i) => (
                    <tr key={i}>
                      <td className="border border-slate-700 px-2 py-2 text-emerald-400 font-bold">{org}</td>
                      {prob.dests.map((_, j) => (
                        <td key={j} className="border border-slate-700 p-1">
                          <div className="text-slate-500 text-center mb-1">c={prob.costs[i][j]}</div>
                          <input type="number" min={0} value={flows[i]?.[j] ?? 0}
                            onChange={e => setFlow(i, j, e.target.value)}
                            className={`w-full text-center bg-slate-800 border rounded px-1 py-1 outline-none font-mono
                              ${flows[i]?.[j] > 0 ? 'border-emerald-500 text-emerald-400' : 'border-slate-700 text-slate-500'}`} />
                        </td>
                      ))}
                      <td className={`border border-slate-700 px-2 py-2 text-center font-bold
                        ${ok_supply[i] ? 'text-emerald-400' : 'text-red-400'}`}>
                        {usedSupply[i]} / {prob.supply[i]}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900">
                    <td className="border border-slate-700 px-2 py-2 text-yellow-400 font-bold">Uso/Demanda</td>
                    {prob.dests.map((_, j) => (
                      <td key={j} className={`border border-slate-700 px-2 py-2 text-center font-bold
                        ${ok_demand[j] ? 'text-emerald-400' : 'text-red-400'}`}>
                        {usedDemand[j]} / {prob.demand[j]}
                      </td>
                    ))}
                    <td className="border border-slate-700" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* SVG bipartite graph */}
          <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4">
            <p className="text-xs text-slate-500 font-mono mb-3">Representación de flujos activos</p>
            <svg viewBox={`0 0 ${380 + (n > 2 ? (n-2)*40 : 0)} ${Math.max(m, n) * 80 + 60}`} className="w-full" style={{ maxHeight: 260 }}>
              {prob.origins.map((org, i) => {
                const oy = 50 + i * (200 / Math.max(m - 1, 1));
                return (
                  <g key={i}>
                    <circle cx={60} cy={oy} r={22} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={2} />
                    <text x={60} y={oy + 5} fill="white" fontSize={10} textAnchor="middle" fontFamily="Inter">S{i+1}</text>
                  </g>
                );
              })}
              {prob.dests.map((d, j) => {
                const dy = 50 + j * (200 / Math.max(n - 1, 1));
                return (
                  <g key={j}>
                    <circle cx={320} cy={dy} r={22} fill="#064e3b" stroke="#10b981" strokeWidth={2} />
                    <text x={320} y={dy + 5} fill="white" fontSize={10} textAnchor="middle" fontFamily="Inter">D{j+1}</text>
                  </g>
                );
              })}
              {prob.origins.map((_, i) => {
                const oy = 50 + i * (200 / Math.max(m - 1, 1));
                return prob.dests.map((_, j) => {
                  const dy = 50 + j * (200 / Math.max(n - 1, 1));
                  const flow = flows[i]?.[j] || 0;
                  if (flow === 0) return null;
                  const maxFlow = Math.max(...prob.supply);
                  const thick = 1 + (flow / maxFlow) * 5;
                  return (
                    <g key={`${i}-${j}`}>
                      <line x1={82} y1={oy} x2={298} y2={dy} stroke="#10b981" strokeWidth={thick} strokeOpacity={0.7} />
                      <text x={190} y={(oy + dy) / 2 - 4} fill="#6ee7b7" fontSize={9} textAnchor="middle" fontFamily="JetBrains Mono">{flow}</text>
                    </g>
                  );
                });
              })}
            </svg>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Z display */}
          <div className={`card text-center transition-all ${optimal ? 'border-emerald-500/50 bg-emerald-500/5' : ''}`}>
            <p className="text-xs text-slate-500 font-mono mb-1">Función Objetivo Z</p>
            <p className={`text-4xl font-black font-mono ${optimal ? 'text-emerald-400' : 'text-white'}`}>
              ${Z.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1 font-mono">Z* óptimo = ${prob.optZ.toLocaleString()}</p>
            {optimal && <p className="mt-2 text-emerald-400 text-sm font-bold">🏆 ¡Solución Óptima!</p>}
            {feasible && !optimal && <p className="mt-2 text-blue-400 text-xs">✅ Factible — gap = ${(Z - prob.optZ).toLocaleString()}</p>}
            {!feasible && <p className="mt-2 text-yellow-400 text-xs">⚠️ Restricciones incumplidas</p>}
          </div>

          {/* Optimize button */}
          <button onClick={handleOptimize}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/30 text-sm">
            ⚡ Optimizar — Mostrar Z*
          </button>
          {optimized && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400">
              <p className="font-bold mb-1">Solución Óptima Aplicada</p>
              <p className="text-slate-400">Los flujos se han cargado con la solución óptima pre-calculada (Virgel + MODI). Puedes modificar los valores para experimentar.</p>
            </div>
          )}

          {/* Constraints status */}
          <div className="card space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase">Restricciones</p>
            {prob.origins.map((org, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs ${ok_supply[i] ? 'text-emerald-400' : 'text-red-400'}`}>
                <span>{ok_supply[i] ? '✓' : '✗'}</span>
                <span className="font-mono truncate">{usedSupply[i]} ≤ {prob.supply[i]} (S{i+1})</span>
              </div>
            ))}
            {prob.dests.map((dest, j) => (
              <div key={j} className={`flex items-center gap-2 text-xs ${ok_demand[j] ? 'text-emerald-400' : 'text-red-400'}`}>
                <span>{ok_demand[j] ? '✓' : '✗'}</span>
                <span className="font-mono truncate">{usedDemand[j]} = {prob.demand[j]} (D{j+1})</span>
              </div>
            ))}
          </div>

          {/* Reset */}
          <button onClick={() => { setFlows(initFlows(m, n)); setOptimized(false); }}
            className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-800 rounded-xl">
            ↺ Limpiar flujos
          </button>
        </div>
      </div>
    </div>
  );
}
