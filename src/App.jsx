import React, { useState, useCallback } from 'react';
import {
  BookOpen, Calculator, PlayCircle, CheckSquare, Award,
  FileEdit, Network, Truck, Database, User, CheckCircle2, GitBranch
} from 'lucide-react';
import HomeView from './views/HomeView';
import Module0View from './views/Module0View';
import Module1View from './views/Module1View';
import Module2View from './views/Module2View';
import Module3View from './views/Module3View';
import Module4View from './views/Module4View';
import LabGraphBuilder from './labs/LabGraphBuilder';
import LabTransport from './labs/LabTransport';
import LabDijkstra from './labs/LabDijkstra';
import LabLatex from './labs/LabLatex';
import ExamView from './views/ExamView';
import GradesView from './views/GradesView';

const NAV = [
  { id: 'home', label: 'Syllabus e Introducción', icon: BookOpen },
  { type: 'header', label: 'Unidad 0: Fundamentos' },
  { id: 'mod0',     label: 'Módulo 0: Teoría de Grafos', icon: GitBranch },
  { id: 'lab0',     label: 'Lab: Constructor de Grafos', icon: Network },
  { type: 'header', label: 'Unidad 1: Programación Lineal' },
  { id: 'mod1',     label: 'Módulo 1: Transporte y Transbordo', icon: Database },
  { id: 'lab1',     label: 'Lab: Transporte Interactivo', icon: PlayCircle },
  { type: 'header', label: 'Unidad 2: Grafos Exactos' },
  { id: 'mod2',     label: 'Módulo 2: Algoritmos de Ruta', icon: Calculator },
  { id: 'lab2',     label: 'Lab: Visualizador Dijkstra', icon: Network },
  { id: 'mod3',     label: 'Módulo 3: Flujo Máx y Árboles', icon: Network },
  { type: 'header', label: 'Unidad 3: VRP y Metaheurísticas' },
  { id: 'mod4',     label: 'Módulo 4: CPM/PERT y VRP', icon: Truck },
  { id: 'lab_latex',label: 'Lab: Modelado LaTeX', icon: FileEdit },
  { type: 'header', label: 'Evaluación' },
  { id: 'exam',     label: 'Examen de Certificación', icon: CheckSquare },
  { id: 'grades',   label: 'Mi Historial Académico', icon: Award },
];

const PROGRESS_KEY = 'oredes_progress_v2';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [visited, setVisited] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; }
  });
  const [studentName, setStudentName] = useState(() => localStorage.getItem('oredes_student') || '');
  const [editingName, setEditingName] = useState(!localStorage.getItem('oredes_student'));

  const navigate = useCallback((id) => {
    setCurrentView(id);
    setVisited(prev => {
      const next = { ...prev, [id]: true };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
    window.scrollTo(0, 0);
  }, []);

  const saveName = () => {
    if (studentName.trim()) {
      localStorage.setItem('oredes_student', studentName.trim());
      setEditingName(false);
    }
  };

  const visitable = NAV.filter(s => s.id && s.id !== 'grades');
  const totalVisitable = visitable.length;
  const totalVisited = Object.keys(visited).filter(k => k !== 'grades' && NAV.find(n => n.id === k)).length;
  const progressPct = Math.round((totalVisited / totalVisitable) * 100);

  const VIEW_MAP = {
    home:      <HomeView />,
    mod0:      <Module0View />,
    lab0:      <LabGraphBuilder />,
    mod1:      <Module1View />,
    lab1:      <LabTransport />,
    mod2:      <Module2View />,
    lab2:      <LabDijkstra />,
    mod3:      <Module3View />,
    mod4:      <Module4View />,
    lab_latex: <LabLatex />,
    exam:      <ExamView setView={navigate} />,
    grades:    <GradesView progressPct={progressPct} totalVisited={totalVisited} totalVisitable={totalVisitable} />,
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20">
        {/* Logo */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Network size={20} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">Optimización de Redes</h1>
              <p className="text-xs text-slate-400 font-mono">UPB · Ing. Industrial VII</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Progreso del curso</span>
              <span className="font-mono text-emerald-400">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          {NAV.map((item, idx) => {
            if (item.type === 'header') return (
              <div key={idx} className="mt-4 mb-1 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
            );
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isDone = visited[item.id];
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-150
                  ${isActive ? 'bg-emerald-500/10 text-emerald-300 border-r-2 border-emerald-500' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
                <span className="flex-1 leading-tight text-xs">{item.label}</span>
                {isDone && !isActive && <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Student footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          {editingName ? (
            <div className="flex gap-2">
              <input type="text" placeholder="Tu nombre completo"
                className="flex-1 bg-slate-800 border border-slate-700 text-xs text-white px-2 py-1.5 rounded-lg outline-none focus:border-emerald-500 transition-colors"
                value={studentName} onChange={e => setStudentName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()} />
              <button onClick={saveName} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">✓</button>
            </div>
          ) : (
            <button onClick={() => setEditingName(true)} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors w-full">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-emerald-400" />
              </div>
              <span className="truncate text-xs">{studentName || 'Editar nombre'}</span>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {VIEW_MAP[currentView] || <HomeView />}
        </div>
      </main>
    </div>
  );
}
