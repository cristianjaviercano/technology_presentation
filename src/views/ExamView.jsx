import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle } from 'lucide-react';

const QUESTIONS = [
  // Módulo 1
  {
    mod: 'Módulo 1', text: 'En el problema de transporte con oferta y demanda enteras, ¿qué propiedad matricial garantiza que el algoritmo Simplex converja a una solución entera sin aplicar restricciones de integralidad explícitas?',
    options: ['El teorema de Kuhn-Tucker','La unimodularidad total de la matriz de restricciones','La relajación Lagrangiana del espacio dual','El principio de optimalidad de Bellman'],
    correct: 1, explain: 'La matriz tecnológica del problema de transporte es totalmente unimodular (TU): todos sus subdeterminantes son 0, 1 o -1. Esto garantiza que los vértices del poliedro de restricciones sean puntos enteros, por lo que Simplex siempre termina en una solución entera (Taha, §5-1).'
  },
  {
    mod: 'Módulo 1', text: 'El Método de la Esquina Noroeste para obtener una solución básica factible inicial en el problema de transporte opera en tiempo:',
    options: ['O(m·n·log(m+n))','O(m²·n²)','O(m + n)','O(m·n)'],
    correct: 2, explain: 'La esquina noroeste avanza exactamente una posición (derecha o abajo) en cada iteración, haciendo como máximo m + n - 1 asignaciones. Su complejidad es lineal en m + n (Taha, §5-2).'
  },
  // Módulo 2
  {
    mod: 'Módulo 2', text: 'En la relación de recurrencia de Floyd-Warshall d⁽ᵏ⁾ᵢⱼ = min(d⁽ᵏ⁻¹⁾ᵢⱼ, d⁽ᵏ⁻¹⁾ᵢₖ + d⁽ᵏ⁻¹⁾ₖⱼ), ¿qué representa el índice k?',
    options: ['El número de iteraciones totales ejecutadas','La capacidad del arco analizado en la iteración actual','El índice del nodo que se evalúa como pivote intermedio en la ruta','El nodo sumidero del grafo de flujo'],
    correct: 2, explain: 'k es el "nodo pivote": en la iteración k, d⁽ᵏ⁾ᵢⱼ contiene la distancia mínima de i a j usando solo los nodos {1,…,k} como intermedios. Al completar k = n, la matriz contiene las distancias entre todos los pares (Taha, §6.5).'
  },
  {
    mod: 'Módulo 2', text: 'El algoritmo de Dijkstra falla en grafos con arcos de peso negativo porque:',
    options: ['La cola de prioridad min-heap no soporta claves negativas','Una vez extraído un nodo u con distancia mínima, ésta no puede ser mejorada — pero un arco negativo posterior podría hacerlo','El grafo residual generado tiene ciclos de longitud cero','La heurística de relajación excede el límite de memoria en V iteraciones'],
    correct: 1, explain: 'Dijkstra asume que una vez se extrae u de la cola con d[u] mínimo, d[u] es definitivo. Si existieran pesos negativos, un arco (v,u) con w<0 podría reducir d[u] después de extraerlo, invalidando la solución. Para pesos negativos se usa Bellman-Ford O(VE) (Ahuja §4-4).'
  },
  // Módulo 3
  {
    mod: 'Módulo 3', text: 'Según el Teorema del Flujo Máximo — Corte Mínimo (Ford & Fulkerson, 1956), el valor del flujo máximo desde s hasta t es:',
    options: ['La suma de todos los pesos de los arcos en la ruta más corta entre s y t','Proporcional al cuadrado del número de nodos de la red','Exactamente igual a la capacidad del corte s-t de capacidad mínima','El promedio de las capacidades de todos los arcos salientes de s'],
    correct: 2, explain: 'El teorema min-cut/max-flow establece que max-flow(s,t) = cap(corte mínimo s-t). Toda unidad de flujo debe cruzar cualquier corte (S,T) con s∈S, t∈T, por lo que el flujo nunca puede superar la capacidad de ningún corte. Ford-Fulkerson terminará exactamente en ese mínimo (Ahuja §6-1).'
  },
  {
    mod: 'Módulo 3', text: 'El Árbol de Expansión Mínima (MST) de un grafo G es único cuando:',
    options: ['G es un grafo completo con n nodos','Todos los pesos de las aristas son distintos entre sí','El grafo tiene exactamente n-1 aristas','G contiene al menos un ciclo de longitud par'],
    correct: 1, explain: 'Si todos los pesos de las aristas son distintos (sin empates), el MST es único. Con pesos repetidos pueden existir múltiples MST distintos con el mismo costo total. Tanto Kruskal como Prim producen el mismo árbol único en ese caso (Taha, §6-2; Ahuja §7-1).'
  },
  // Módulo 4
  {
    mod: 'Módulo 4', text: 'En el algoritmo ACO para VRP, el coeficiente de evaporación ρ ∈ (0,1) en la regla τᵢⱼ(t+1) = (1-ρ)τᵢⱼ(t) + ΔτK cumple el rol de:',
    options: ['Garantizar que la función objetivo sea convexa y tenga un único mínimo global','Reducir progresivamente la feromona de rutas menos usadas, evitando la convergencia prematura a óptimos locales','Calcular el makespan determinístico como en CPM para el itinerario de los vehículos','Normalizar las demandas de los clientes para que la capacidad Q se cumpla estrictamente'],
    correct: 1, explain: 'ρ controla la tasa de olvido: un ρ alto (≈0.9) hace que la memoria colectiva se pierda rápido, favoreciendo la exploración. Un ρ bajo (≈0.1) refuerza las rutas ya conocidas. Sin evaporación, la feromona converge en los primeros caminos encontrados (óptimos locales). (Dorigo & Stützle, 2004, §3.2)'
  },
  {
    mod: 'Módulo 4', text: 'En el método PERT con estimados a (optimista), m (más probable) y b (pesimista), ¿qué distribución de probabilidad se asume para la duración de cada actividad?',
    options: ['Normal (Gaussiana) simétrica con media m','Uniforme continua en [a, b]','Beta con valor esperado E[t]=(a+4m+b)/6 y varianza ((b-a)/6)²','Poisson con parámetro λ = 1/m'],
    correct: 2, explain: 'PERT asume una distribución Beta (acotada en [a,b]) para las duraciones. La aproximación de la media es E[t]=(a+4m+b)/6 (cuatro veces el peso del valor más probable). La varianza es σ²=((b-a)/6)². La suma de actividades en la ruta crítica sigue aproximadamente una Normal por el TLC (Taha, §6-6).'
  },
];

const GRADES_KEY = 'oredes_grades_v2';

export default function ExamView({ setView }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    QUESTIONS.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const final = parseFloat(((correct / QUESTIONS.length) * 5).toFixed(2));
    setScore(final);
    setSubmitted(true);
    // Save to localStorage
    const prev = JSON.parse(localStorage.getItem(GRADES_KEY) || '[]');
    prev.unshift({ date: new Date().toISOString(), score: final, correct, total: QUESTIONS.length });
    localStorage.setItem(GRADES_KEY, JSON.stringify(prev));
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in">
      <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Award size={48} className="text-emerald-400" />
      </div>
      <h2 className="text-3xl font-black text-white">Examen Completado</h2>
      <div className={`text-6xl font-black font-mono ${score >= 3 ? 'text-emerald-400' : 'text-red-400'}`}>{score.toFixed(1)}<span className="text-2xl text-slate-500"> / 5.0</span></div>

      {/* Retroalimentación */}
      <div className="w-full max-w-3xl space-y-4 mt-6">
        {QUESTIONS.map((q, i) => {
          const correct = answers[i] === q.correct;
          return (
            <div key={i} className={`card border-l-4 ${correct ? 'border-emerald-500' : 'border-red-500'}`}>
              <div className="flex items-start gap-3">
                {correct ? <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" /> : <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />}
                <div>
                  <p className="text-xs text-slate-500 font-mono mb-1">{q.mod}</p>
                  <p className="text-sm text-slate-300 mb-2">{q.text}</p>
                  {!correct && <p className="text-xs text-red-400 mb-2">Tu respuesta: <em>{q.options[answers[i]] ?? 'Sin responder'}</em></p>}
                  <p className="text-xs text-emerald-400 font-bold mb-1">✓ Correcta: {q.options[q.correct]}</p>
                  <p className="text-xs text-slate-400 border-l-2 border-slate-700 pl-3 mt-2">{q.explain}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setView('grades')} className="mt-4 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors">
        Ver Historial
      </button>
    </div>
  );

  const answered = Object.keys(answers).length;
  return (
    <div className="space-y-8 animate-in pb-16">
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">EVALUACIÓN · 4 Módulos</span>
        <h1 className="text-3xl font-black text-white mt-1">Examen de Certificación</h1>
        <p className="text-slate-400 mt-1">{QUESTIONS.length} preguntas técnicas · Escala de 0 a 5.0</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(answered/QUESTIONS.length)*100}%` }} />
        </div>
        <span className="font-mono text-emerald-400">{answered}/{QUESTIONS.length}</span>
      </div>

      {QUESTIONS.map((q, i) => (
        <div key={i} className={`card transition-colors ${answers[i] !== undefined ? 'border-emerald-500/20' : ''}`}>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xs font-mono bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full flex-shrink-0">{q.mod}</span>
          </div>
          <h3 className="text-slate-100 font-semibold mb-4 leading-relaxed">{i + 1}. {q.text}</h3>
          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all
                ${answers[i] === oi ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'}`}>
                <input type="radio" name={`q${i}`} className="accent-emerald-500"
                  checked={answers[i] === oi} onChange={() => setAnswers(a => ({ ...a, [i]: oi }))} />
                <span className="text-sm text-slate-300">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button onClick={handleSubmit} disabled={answered < QUESTIONS.length}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold rounded-xl transition-colors">
          Entregar Evaluación ({answered}/{QUESTIONS.length})
        </button>
      </div>
    </div>
  );
}
