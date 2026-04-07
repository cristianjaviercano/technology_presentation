import React, { useState } from 'react';

const INITIAL = `% Modelo de Flujo Máximo — Ford-Fulkerson
% Usa $...$ para expresiones en línea y $$...$$ para bloque

Maximizar el flujo total desde $s$ hasta $t$:

$$\\max \\ v$$

Sujeto a la conservación de flujo en cada nodo $i \\in N$:

$$\\sum_{j:(i,j)\\in A} x_{ij} - \\sum_{j:(j,i)\\in A} x_{ji} = 
\\begin{cases} 
  v  & \\text{si } i = s \\\\
 -v  & \\text{si } i = t \\\\
  0  & \\text{si } i \\in N \\setminus \\{s,t\\}
\\end{cases}$$

Restricciones de capacidad:

$$0 \\leq x_{ij} \\leq u_{ij} \\quad \\forall (i,j) \\in A$$

Donde $u_{ij}$ es la capacidad del arco $(i,j)$ en el grafo residual $G_f$.
`;

const TEMPLATES = [
  { name: 'Flujo Máximo', code: INITIAL },
  { name: 'Transporte', code: `Problema de Transporte — $m$ orígenes a $n$ destinos:

$$\\min Z = \\sum_{i=1}^{m} \\sum_{j=1}^{n} c_{ij} x_{ij}$$

Restricciones de oferta (para cada origen $i$):
$$\\sum_{j=1}^{n} x_{ij} \\leq s_i \\quad \\forall i = 1,\\ldots,m$$

Restricciones de demanda (para cada destino $j$):
$$\\sum_{i=1}^{m} x_{ij} = d_j \\quad \\forall j = 1,\\ldots,n$$

Variables de decisión: $x_{ij} \\geq 0$
` },
  { name: 'CPM', code: `Red de Proyecto — CPM

Tiempo más temprano (forward pass):
$$ES_j = \\max_{i \\to j} \\{ ES_i + t_{ij} \\}$$

Tiempo más tardío (backward pass):
$$LS_i = \\min_{i \\to j} \\{ LS_j - t_{ij} \\}$$

Holgura total de la actividad $(i,j)$:
$$H_{ij} = LS_j - ES_i - t_{ij} \\geq 0$$

Actividad crítica: $H_{ij} = 0$.
El makespan del proyecto es $LS_{\\text{fin}}$.
` },
];

export default function LabLatex() {
  const [code, setCode] = useState(INITIAL);
  const [tmpl, setTmpl] = useState(0);

  const loadTemplate = (idx) => { setTmpl(idx); setCode(TEMPLATES[idx].code); };

  const srcDoc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"></script>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 24px; line-height: 1.7; color: #e2e8f0; background: #0f172a; font-size: 14px; }
  code { color: #10b981; font-family: monospace; }
</style></head>
<body>${code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</body></html>`;

  return (
    <div className="space-y-5 animate-in">
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">LAB 3 · Notación Matemática</span>
        <h1 className="text-3xl font-black text-white mt-1">Modelado Matemático en LaTeX</h1>
        <p className="text-slate-400 mt-1">Editor en vivo con renderizado MathJax — practica la notación de IO</p>
      </div>

      {/* Template buttons */}
      <div className="flex gap-2">
        {TEMPLATES.map((t, i) => (
          <button key={i} onClick={() => loadTemplate(i)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${tmpl===i ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {t.name}
          </button>
        ))}
      </div>

      {/* Split view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '520px' }}>
        <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-700">
          <div className="px-4 py-2 bg-slate-800 text-xs font-mono text-slate-400 border-b border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="ml-2">Código LaTeX</span>
          </div>
          <textarea className="flex-1 p-5 bg-slate-950 text-emerald-400 font-mono text-sm outline-none resize-none leading-relaxed"
            value={code} onChange={e => setCode(e.target.value)} spellCheck={false} />
        </div>

        <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-700">
          <div className="px-4 py-2 bg-slate-800 text-xs font-mono text-slate-400 border-b border-slate-700">
            Vista renderizada (MathJax 3)
          </div>
          <iframe srcDoc={srcDoc} className="flex-1 border-none w-full" title="MathJax Preview" />
        </div>
      </div>

      <div className="card text-xs text-slate-400">
        <strong className="text-slate-300">Sintaxis base:</strong> usa <code className="text-emerald-400">$...$</code> para expresiones en línea y <code className="text-emerald-400">$$...$$</code> para bloques centrados. Los comandos LaTeX como <code className="text-emerald-400">\sum, \min, \max, \forall, \leq, \geq</code> están disponibles.
      </div>
    </div>
  );
}
