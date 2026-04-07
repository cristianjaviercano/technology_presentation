import React from 'react';
import { BookOpen, BarChart2, Clock, Target } from 'lucide-react';

const modules = [
  { num: 1, title: 'Transporte y Transbordo', desc: 'Modelos de Programación Lineal, balance de masas, nodos ficticios y unimodularidad total.', tag: 'PL Exacto' },
  { num: 2, title: 'Algoritmos de Ruta', desc: 'Dijkstra (origen único, O(V²)) y Floyd-Warshall (todos los pares, O(V³)) — programación dinámica.', tag: 'Grafos' },
  { num: 3, title: 'Flujo Máximo y MST', desc: 'Teorema Min-Cut Max-Flow, Ford-Fulkerson, algoritmos de Kruskal y Prim para expansión mínima.', tag: 'Redes' },
  { num: 4, title: 'CPM/PERT y VRP', desc: 'Ruta crítica, análisis estocástico PERT, VRP y metaheurística ACO (Colonia de Hormigas).', tag: 'NP-Hard' },
];

const refs = [
  'Taha, H. A. (2012). Investigación de Operaciones (9a ed.). Pearson.',
  'Ahuja, R. K., Magnanti, T. L., & Orlin, J. B. (1993). Network Flows. Prentice Hall.',
  'Ballou, R. H. (2004). Logística: Administración de la cadena de suministro (5a ed.). Pearson.',
  'Dorigo, M., & Stützle, T. (2004). Ant Colony Optimization. MIT Press.',
];

export default function HomeView() {
  return (
    <div className="space-y-8 animate-in">
      {/* Hero */}
      <div className="gradient-header rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #10b981 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Universidad Pontificia Bolivariana</span>
          <h1 className="text-4xl font-black text-white mt-2 tracking-tight">Optimización en Redes</h1>
          <p className="text-slate-400 mt-2 text-lg">Modelado Matemático · Programación Lineal · Metaheurísticas</p>
          <div className="flex gap-6 mt-6 text-sm text-slate-300">
            <span className="flex items-center gap-2"><Clock size={14} className="text-emerald-400" /> 48 horas · 4 módulos</span>
            <span className="flex items-center gap-2"><Target size={14} className="text-emerald-400" /> Ing. Industrial VII sem.</span>
            <span className="flex items-center gap-2"><BarChart2 size={14} className="text-emerald-400" /> Taha · Ahuja · Ballou · Dorigo</span>
          </div>
        </div>
      </div>

      {/* Módulos */}
      <div>
        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-emerald-400" /> Plan de Estudios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map(m => (
            <div key={m.num} className="card hover:border-emerald-500/40 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl font-black text-slate-700">{String(m.num).padStart(2,'0')}</span>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{m.tag}</span>
              </div>
              <h3 className="font-bold text-slate-100 mb-1">{m.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones generales */}
      <div className="card border-emerald-500/30">
        <h3 className="font-bold text-emerald-400 mb-3">📋 Instrucciones del Curso</h3>
        <ol className="space-y-2 text-sm text-slate-300">
          {['Navega secuencialmente por los módulos teóricos para construir el marco conceptual.',
            'Completa los laboratorios interactivos para experimentar con cada algoritmo paso a paso.',
            'Usa el Lab de Modelado LaTeX para practicar la notación matemática formal (Taha, cap. 5-8).',
            'Presenta el "Examen de Certificación" al finalizar los 4 módulos — 8 preguntas técnicas.',
            'Revisa tu historial de intentos y progreso en "Mi Historial Académico".'
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="step-badge">{i+1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Bibliografía */}
      <div className="card">
        <h3 className="font-bold text-slate-200 mb-3">📚 Bibliografía Base</h3>
        <ul className="space-y-2">
          {refs.map((r, i) => (
            <li key={i} className="text-xs text-slate-400 font-mono border-l-2 border-slate-700 pl-3">{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
