import React from 'react';
import { Award, TrendingUp, BookOpen } from 'lucide-react';

const GRADES_KEY = 'oredes_grades_v2';

export default function GradesView({ progressPct, totalVisited, totalVisitable }) {
  const grades = JSON.parse(localStorage.getItem(GRADES_KEY) || '[]');
  const best = grades.length ? Math.max(...grades.map(g => g.score)) : null;
  const avg = grades.length ? (grades.reduce((s, g) => s + g.score, 0) / grades.length).toFixed(2) : null;

  return (
    <div className="space-y-8 animate-in">
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">HISTORIAL ACADÉMICO</span>
        <h1 className="text-3xl font-black text-white mt-1">Mi Progreso</h1>
        <p className="text-slate-400 mt-1">Seguimiento de evaluaciones y avance del curso</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <TrendingUp size={20} className="text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{grades.length}</p>
          <p className="text-xs text-slate-500 mt-1">Exámenes</p>
        </div>
        <div className="card text-center">
          <Award size={20} className="text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{best !== null ? best.toFixed(1) : '—'}</p>
          <p className="text-xs text-slate-500 mt-1">Mejor nota</p>
        </div>
        <div className="card text-center">
          <BookOpen size={20} className="text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-black text-white">{progressPct}%</p>
          <p className="text-xs text-slate-500 mt-1">Módulos visitados</p>
        </div>
      </div>

      {/* Course progress bar */}
      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-slate-200">Avance del Curso</h3>
          <span className="text-sm font-mono text-emerald-400">{totalVisited}/{totalVisitable} secciones</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }} />
        </div>
        {progressPct === 100 && (
          <p className="text-emerald-400 text-sm font-bold mt-3 text-center">🎓 ¡Curso completado! Ahora presenta el examen de certificación.</p>
        )}
      </div>

      {/* Grade history */}
      <div className="card">
        <h3 className="font-bold text-slate-200 mb-4">Historial de Evaluaciones</h3>
        {grades.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Award size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aún no hay evaluaciones registradas.</p>
            <p className="text-xs mt-1">Completa los módulos y presenta el examen de certificación.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {grades.map((g, i) => {
              const date = new Date(g.date);
              const pct = (g.correct / g.total) * 100;
              return (
                <div key={i} className="flex items-center gap-4 bg-slate-900 rounded-xl p-4 border border-slate-700">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0
                    ${g.score >= 4 ? 'bg-emerald-500/20 text-emerald-400' : g.score >= 3 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                    {g.score.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200">Examen de Certificación ({g.correct}/{g.total} correctas)</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {date.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-lg flex-shrink-0
                    ${g.score >= 3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {g.score >= 3 ? 'Aprobado' : 'Reprobado'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {avg !== null && (
        <div className="card text-center border-emerald-500/20">
          <p className="text-slate-400 text-sm">Promedio general</p>
          <p className="text-4xl font-black font-mono text-emerald-400 mt-1">{avg} <span className="text-lg text-slate-500">/ 5.0</span></p>
        </div>
      )}
    </div>
  );
}
