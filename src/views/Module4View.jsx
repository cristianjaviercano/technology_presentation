import React, { useState } from 'react';
import Module4Theory from './Module4Theory';

/* ─── Sub-components ─────────────────────────────────────────────────────── */
const Callout = ({ color = 'emerald', title, children }) => {
  const c = { emerald:'border-emerald-500 bg-emerald-500/5', blue:'border-blue-500 bg-blue-500/5',
               yellow:'border-yellow-500 bg-yellow-500/5', red:'border-red-500 bg-red-500/5' }[color];
  return (
    <div className={`border-l-4 rounded-r-xl p-4 my-3 ${c}`}>
      {title && <p className="font-bold text-sm text-slate-200 mb-1">{title}</p>}
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
};
const Sec = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-base font-bold text-emerald-400 mb-3 flex items-center gap-2">
      <span className="block w-1 h-4 bg-emerald-500 rounded-full" />{title}
    </h3>
    <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
  </div>
);
const Py = ({ label, code }) => (
  <div className="my-4 rounded-xl overflow-hidden border border-slate-700">
    {label && <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-emerald-400 border-b border-slate-700">🐍 {label}</div>}
    <pre className="bg-[#0d1117] p-4 text-xs text-green-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">{code}</pre>
  </div>
);
const ParamRow = ({ p, range, effect, tip }) => (
  <tr className="hover:bg-slate-800/40 border-b border-slate-800">
    <td className="px-3 py-2 font-mono text-yellow-400">{p}</td>
    <td className="px-3 py-2 text-slate-400 text-xs">{range}</td>
    <td className="px-3 py-2 text-slate-300 text-xs">{effect}</td>
    <td className="px-3 py-2 text-emerald-400 text-xs">{tip}</td>
  </tr>
);

/* ─── Tab definitions ────────────────────────────────────────────────────── */
const TABS = [
  ['intro','🧠 Contexto NP-Hard'],
  ['cpm','📅 CPM / PERT'],
  ['crashing','⚡ Compresión (Crashing)'],
  ['vrp','🚚 VRP'],
  ['greedy','🔨 Heurísticas Constructivas'],
  ['sa','🌡️ Recocido Simulado'],
  ['tabu','🚫 Búsqueda Tabú'],
  ['aco','🐜 ACO'],
  ['compare','⚖️ Comparativa'],
  ['theory','📚 Teoría Avanzada'],
];

/* ─── Python code strings ────────────────────────────────────────────────── */
const CODE_GREEDY = `import numpy as np, random

# ─── Datos: matriz de distancias 5 ciudades ────────────────────────────
dist = np.array([
    [0, 10, 15, 20, 25],
    [10,  0, 35, 25, 30],
    [15, 35,  0, 30, 20],
    [20, 25, 30,  0, 15],
    [25, 30, 20, 15,  0]
], dtype=float)

# ─── 1. Heurística del Vecino más Cercano (Greedy NN) ─────────────────
def nearest_neighbor(dist, start=0):
    n = len(dist)
    visited = [False] * n
    tour = [start]
    visited[start] = True
    for _ in range(n - 1):
        cur = tour[-1]
        nxt = min((i for i in range(n) if not visited[i]),
                  key=lambda i: dist[cur][i])
        tour.append(nxt)
        visited[nxt] = True
    tour.append(start)          # cerrar ciclo
    return tour

# ─── 2. Mejora local: 2-opt ────────────────────────────────────────────
def tour_cost(tour, dist):
    return sum(dist[tour[i]][tour[i+1]] for i in range(len(tour)-1))

def two_opt(tour, dist):
    n = len(tour) - 1           # no contar la ciudad de regreso
    improved = True
    while improved:
        improved = False
        for i in range(1, n - 1):
            for j in range(i + 1, n):
                # Invertir segmento tour[i..j]
                new_tour = tour[:i] + tour[i:j+1][::-1] + tour[j+1:]
                if tour_cost(new_tour, dist) < tour_cost(tour, dist):
                    tour = new_tour
                    improved = True
    return tour

# ─── Ejecución ─────────────────────────────────────────────────────────
tour_nn   = nearest_neighbor(dist, start=0)
tour_2opt = two_opt(tour_nn[:], dist)

print(f"Tour NN   : {tour_nn}   costo={tour_cost(tour_nn,   dist):.1f}")
print(f"Tour 2-opt: {tour_2opt}  costo={tour_cost(tour_2opt, dist):.1f}")
# Salida esperada:
# Tour NN   : [0,1,3,4,2,0]   costo=95.0
# Tour 2-opt: [0,1,3,4,2,0]   costo=95.0  (ya era óptimo local)`;

const CODE_SA = `import math, random, copy
import numpy as np

dist = np.array([
    [0,29,20,21,16],[29,0,15,29,28],[20,15,0,15,14],
    [21,29,15,0,4], [16,28,14, 4, 0]
], dtype=float)

def tour_cost(t, d):
    return sum(d[t[i]][t[i+1]] for i in range(len(t)-1))

# ─── Simulated Annealing ───────────────────────────────────────────────
def simulated_annealing(dist, T0=500.0, T_min=0.1, alpha=0.995, max_iter=5000):
    n = len(dist)
    # Solución inicial aleatoria
    cur = list(range(n))
    random.shuffle(cur)
    cur.append(cur[0])          # ciclo cerrado
    cur_cost = tour_cost(cur, dist)
    best, best_cost = cur[:], cur_cost
    T = T0
    history = []

    for it in range(max_iter):
        # Vecino: intercambio aleatorio de dos ciudades internas
        i, j = sorted(random.sample(range(1, n), 2))
        nbr = cur[:i] + cur[i:j+1][::-1] + cur[j+1:]
        nbr_cost = tour_cost(nbr, dist)
        delta = nbr_cost - cur_cost

        # Criterio de aceptación de Metropolis
        if delta < 0 or random.random() < math.exp(-delta / T):
            cur, cur_cost = nbr, nbr_cost
        if cur_cost < best_cost:
            best, best_cost = cur[:], cur_cost

        T *= alpha              # enfriamiento geométrico
        if T < T_min:
            break
        if it % 500 == 0:
            history.append((it, round(best_cost,2), round(T,4)))

    return best, best_cost, history

best_tour, best_cost, log = simulated_annealing(dist)
print(f"Mejor tour : {best_tour}")
print(f"Costo óptimo: {best_cost:.2f}")
print("\\nProgresión (iter, costo, T):")
for row in log:
    print(f"  {row}")`;

const CODE_TABU = `import random, copy
import numpy as np

dist = np.array([
    [0,29,20,21,16],[29,0,15,29,28],[20,15,0,15,14],
    [21,29,15,0,4], [16,28,14, 4, 0]
], dtype=float)

def tour_cost(tour, d):
    n = len(tour)
    return sum(d[tour[i % n]][tour[(i+1) % n]] for i in range(n))

# ─── Tabu Search ──────────────────────────────────────────────────────
def tabu_search(dist, max_iter=300, tabu_tenure=7):
    n = len(dist)
    cur = list(range(n))        # solución inicial identidad
    cur_cost = tour_cost(cur, dist)
    best, best_cost = cur[:], cur_cost
    tabu = []                   # lista tabú: pares (i,j) bloqueados

    for iteration in range(max_iter):
        best_nbr, best_nbr_cost, best_move = None, float('inf'), None

        # Generar vecindad completa: todos los swaps (i,j)
        for i in range(n - 1):
            for j in range(i + 1, n):
                nbr = cur[:]
                nbr[i], nbr[j] = nbr[j], nbr[i]
                nc = tour_cost(nbr, dist)
                move = (cur[i], cur[j])     # identificar por ciudades

                # Criterio de aspiración: acepta tabú si mejora global
                is_taboo = move in tabu or (move[1], move[0]) in tabu
                if (not is_taboo) or nc < best_cost:
                    if nc < best_nbr_cost:
                        best_nbr, best_nbr_cost, best_move = nbr, nc, move

        if best_nbr is None:
            break               # sin vecino válido

        cur, cur_cost = best_nbr, best_nbr_cost
        tabu.append(best_move)
        if len(tabu) > tabu_tenure:
            tabu.pop(0)         # eliminar el más antiguo (FIFO)

        if cur_cost < best_cost:
            best, best_cost = cur[:], cur_cost

        if iteration % 50 == 0:
            print(f"  iter={iteration:3d}  costo={cur_cost:.1f}  "
                  f"tabú_len={len(tabu)}")

    return best, best_cost

best, cost = tabu_search(dist)
print(f"\\nMejor solución: {best}  →  costo={cost:.1f}")`;

const CODE_ACO = `import numpy as np, random

dist = np.array([
    [0,29,20,21,16],[29,0,15,29,28],[20,15,0,15,14],
    [21,29,15,0,4], [16,28,14, 4, 0]
], dtype=float)

# ─── Ant Colony Optimization (AS — Ant System) ────────────────────────
def aco_tsp(dist, n_ants=10, n_iter=100,
            alpha=1.0, beta=5.0, rho=0.1, Q=100.0):
    """
    alpha  : peso de feromona τ  (exploración vs explotación)
    beta   : peso de heurística η = 1/d  (favorece arcos cortos)
    rho    : tasa de evaporación  (0 < ρ < 1)
    Q      : constante de depósito de feromona
    """
    n   = len(dist)
    eta = 1.0 / (dist + 1e-10)     # heurística de visibilidad
    tau = np.ones((n, n))           # feromona inicial uniforme
    best_tour, best_cost = None, float('inf')

    for it in range(n_iter):
        all_tours, all_costs = [], []

        # ── Fase de construcción ────────────────────────────────────
        for _ in range(n_ants):
            start   = random.randint(0, n - 1)
            visited = [start]

            while len(visited) < n:
                cur = visited[-1]
                unvis = [j for j in range(n) if j not in visited]

                # Regla probabilística de selección
                scores = [(tau[cur][j]**alpha) * (eta[cur][j]**beta)
                          for j in unvis]
                total  = sum(scores)
                probs  = [s / total for s in scores]

                # Ruleta (Roulette Wheel Selection)
                r, cumul = random.random(), 0.0
                chosen = unvis[-1]
                for idx, city in enumerate(unvis):
                    cumul += probs[idx]
                    if r <= cumul:
                        chosen = city
                        break
                visited.append(chosen)

            visited.append(start)   # cerrar ciclo
            c = sum(dist[visited[i]][visited[i+1]] for i in range(n))
            all_tours.append(visited)
            all_costs.append(c)

            if c < best_cost:
                best_tour, best_cost = visited[:], c

        # ── Fase de actualización de feromona ───────────────────────
        tau *= (1 - rho)            # evaporación global
        for tour, cost in zip(all_tours, all_costs):
            deposit = Q / cost
            for i in range(n):
                tau[tour[i]][tour[i+1]] += deposit
                tau[tour[i+1]][tour[i]] += deposit  # simétrico

        if it % 20 == 0:
            print(f"  iter={it:3d}  mejor_costo={best_cost:.2f}  "
                  f"τ_max={tau.max():.3f}")

    return best_tour, best_cost

tour, cost = aco_tsp(dist)
print(f"\\nMejor ruta ACO: {tour}  →  Z* = {cost:.2f}")`;

/* ─── PERT mini example data ─────────────────────────────────────────────── */
const CPM_ACTS = [
  ['A','—','2','2','2','2.00','0.00'],
  ['B','A','4','6','8','6.00','0.44'],
  ['C','A','3','4','5','4.00','0.11'],
  ['D','B,C','1','2','3','2.00','0.11'],
  ['E','D','3','5','7','5.00','0.44'],
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Module4View() {
  const [tab, setTab] = useState('intro');

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">MÓDULO 4 · Heurísticas y Metaheurísticas</span>
        <h1 className="text-3xl font-black text-white mt-1">CPM/PERT · VRP · Metaheurísticas</h1>
        <p className="text-slate-400 mt-1">
          Taha (2012) §6–8 · Dorigo &amp; Stützle (2004) · Kirkpatrick et al. (1983) · Glover (1989)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-1">
        {TABS.map(([id,lbl]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-3 py-2 text-xs font-semibold rounded-t transition-colors
              ${tab===id ? 'text-emerald-400 bg-slate-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ══ INTRO ══════════════════════════════════════════════════════════ */}
      {tab === 'intro' && (
        <div className="space-y-5">
          <Sec title="¿Por qué necesitamos heurísticas? — La barrera NP-Hard">
            <p>
              Los algoritmos exactos (Simplex, Dijkstra, MODI) son eficientes porque los problemas que resuelven pertenecen a la clase <strong className="text-white">P</strong>: su tiempo de cómputo crece polinomialmente con el tamaño de la instancia. Sin embargo, muchos problemas reales de optimización de redes pertenecen a la clase <strong className="text-white">NP-Hard</strong>.
            </p>
            <Callout color="red" title="Definición: NP-Hard">
              Un problema es NP-Hard si todo problema en NP se puede reducir a él en tiempo polinomial. No se conoce (ni se cree que exista) un algoritmo polinomial para resolverlos. El ejemplo canónico es el <strong>Problema del Viajero (TSP)</strong>.
            </Callout>
            <p>El TSP con n=20 ciudades tiene <strong className="text-white">(20-1)! / 2 ≈ 6×10¹⁶</strong> rutas posibles. A 1 billón de evaluaciones/segundo, tardaría ~2 años. Con n=50: imposible en el universo conocido.</p>
          </Sec>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Exactos','Garantizan óptimo global. Inviables para problemas grandes (n≫100).','B&B, Simplex, Dijkstra','text-blue-400','border-blue-500/30'],
              ['Heurísticas','Soluciones buenas en tiempo razonable. Sin garantía de óptimo. Basadas en intuición/reglas.','Vecino más cercano, Ahorros Clarke-Wright','text-yellow-400','border-yellow-500/30'],
              ['Metaheurísticas','Marcos generales de búsqueda inteligente. Evitan óptimos locales con estrategias de exploración.','SA, Tabu, ACO, GA','text-emerald-400','border-emerald-500/30'],
            ].map(([name,desc,ex,col,border]) => (
              <div key={name} className={`card border ${border}`}>
                <h4 className={`font-bold mb-2 ${col}`}>{name}</h4>
                <p className="text-xs text-slate-400 mb-2">{desc}</p>
                <p className="text-xs font-mono text-slate-500">Ej: {ex}</p>
              </div>
            ))}
          </div>

          <Sec title="Taxonomía de Metaheurísticas">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-800 text-slate-400">
                  <th className="px-3 py-2 text-left">Algoritmo</th>
                  <th className="px-3 py-2">Inspiración</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Año</th>
                  <th className="px-3 py-2 text-left">Fortaleza</th>
                </tr></thead>
                <tbody>
                  {[
                    ['Recocido Simulado (SA)','Termodinámica','Single-solution','1983','Escapa óptimos locales con probabilidad'],
                    ['Búsqueda Tabú (TS)','Memoria adaptativa','Single-solution','1986','Diversificación + intensificación'],
                    ['ACO','Feromonas de hormigas','Population-based','1992','Problemas discretos, TSP/VRP'],
                    ['Algoritmo Genético (GA)','Evolución darwiniana','Population-based','1975','Espacios de búsqueda complejos'],
                    ['PSO','Cardumen de peces','Population-based','1995','Optimización continua'],
                    ['GRASP','Greedy + aleatorio','Híbrido','1989','Equilibrio construcción/mejora'],
                  ].map(r => (
                    <tr key={r[0]} className="border-b border-slate-800 hover:bg-slate-800/30">
                      {r.map((c,i) => <td key={i} className={`px-3 py-2 ${i===0?'text-emerald-400 font-semibold':i===4?'text-slate-300':'text-slate-400 text-center'}`}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sec>
        </div>
      )}

      {/* ══ CPM/PERT ══════════════════════════════════════════════════════ */}
      {tab === 'cpm' && (
        <div className="space-y-5">
          <Sec title="Método de la Ruta Crítica (CPM) y Holguras">
            <p>El CPM modela un proyecto como un <strong className="text-white">grafo acíclico dirigido (DAG)</strong>. La ruta crítica dicta la duración del proyecto. Taha (2012) distingue formalmente dos tipos de holgura esenciales para el control del proyecto:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-500 font-mono mb-2">Holgura Total (Total Float):</p>
                <p className="font-mono text-emerald-400">{'HT_{ij} = LC_j - IC_i - D_{ij}'}</p>
                <p className="text-xs text-slate-400 mt-2">Tiempo máximo que una actividad puede retrasarse sin afectar la fecha de finalización de <strong>todo el proyecto</strong>. Es la holgura clásica. Si HT=0, la actividad es crítica.</p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-slate-500 font-mono mb-2">Holgura Libre (Free Float):</p>
                <p className="font-mono text-emerald-400">{'HL_{ij} = IC_j - IC_i - D_{ij}'}</p>
                <p className="text-xs text-slate-400 mt-2">Tiempo que una actividad puede retrasarse sin afectar la fecha de inicio más temprana (IC) de <strong>ninguna actividad sucesora</strong>. Siempre se cumple: HL ≤ HT.</p>
              </div>
            </div>
          </Sec>

          <Sec title="Manejo Estadístico en PERT">
            <p>PERT asume que la duración de cada actividad sigue una distribución <strong className="text-white">Beta</strong> ajustada por tres estimaciones (a = optimista, m = más probable, b = pesimista). Sin embargo, por el <em>Teorema del Límite Central</em>, la duración total de la ruta crítica se aproxima a una distribución <strong className="text-white">Normal</strong>.</p>
            
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Duración Esperada:</p>
                <p className="font-mono text-emerald-400">{'μ_{ij} = (a + 4m + b) / 6'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Varianza de Actividad:</p>
                <p className="font-mono text-emerald-400">{'σ²_{ij} = ((b - a) / 6)²'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Cálculo de Desviación Normal (Z):</p>
                <p className="font-mono text-yellow-400">{'Z = (T_{meta} - Σμ_{crítica}) / √(Σσ²_{crítica})'}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Utilizando el valor Z en tablas de distribución Normal Estándar, se halla la probabilidad de culminar el proyecto antes del plazo <code className="text-emerald-400">T_meta</code>. Taha estipula que este cálculo es solo una aproximación optimista, ya que asume que una ruta no-crítica no superará a la ruta crítica variacionalmente.</p>
          </Sec>
        </div>
      )}

      {/* ══ CRASHING ══════════════════════════════════════════════════════ */}
      {tab === 'crashing' && (
        <div className="space-y-5">
          <Sec title="Compresión de Proyectos (Crashing / Time-Cost Trade-off)">
            <p>Según Hillier & Lieberman (Cap. 10), el método <strong>CPM de Intercambio Tiempo-Costo</strong> resuelve el problema de reducir el tiempo total del proyecto al mínimo costo adicional. Las actividades pueden acelerarse invirtiendo más recursos (horas extras, subcontratación), lo cual tiene un límite ("tiempo de quiebre" o <em>crash time</em>).</p>
            
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 my-4 text-center">
              <p className="text-xs text-slate-500 font-mono mb-2">Costo Marginal de Compresión (Pendiente de Costo):</p>
              <p className="font-mono text-emerald-400 text-lg">{'C_{marginal} = (Costo_{crash} - Costo_{normal}) / (Tiempo_{normal} - Tiempo_{crash})'}</p>
              <p className="text-xs text-slate-400 mt-3">Solo tiene sentido técnico (y económico) comprimir aquellas actividades que pertenecen a la <strong>Ruta Crítica</strong> actual y que posean el menor <code className="text-emerald-400">C_marginal</code>.</p>
            </div>
          </Sec>

          <Sec title="Formulación mediante Programación Lineal (PL)">
             <p>Al volverse un proyecto complejo, múltiples rutas pueden volverse críticas simultáneamente, haciendo imposible el avance manual heurístico. El Crashing se modela estrictamente como Programación Lineal:</p>
             <div className="bg-[#0d1117] border border-slate-700 rounded-xl p-5 mb-4 overflow-x-auto">
              <p className="text-emerald-400 font-mono text-sm leading-loose">{'Minimizar Z = Σ C_{marginal_{ij}} \u00B7 Y_{ij}'}</p>
              <p className="text-xs font-mono text-slate-500 mt-2">{'Sujeto a las restricciones de precedencia:'}</p>
              <p className="text-emerald-400 font-mono text-sm leading-relaxed mt-2 whitespace-pre">
                 {'x_j \u2265 x_i + D_{ij} - Y_{ij}   (para cada actividad i \u2192 j)\n'}
                 {'x_n \u2264 T_{meta}                (donde x_n es nodo final)\n'}
                 {'Y_{ij} \u2264 L_{ij}                (Límite máximo de reducción posible)'}
              </p>
            </div>
            <Callout color="yellow" title="Interpretación de Variables">
              <code className="text-white">x_i</code> = Tiempo de ocurrencia del evento nodo i.<br/>
              <code className="text-white">Y_ij</code> = Cantidad de semanas/días que se reduce la actividad (i,j).<br/>
              <code className="text-white">D_ij</code> = Duración normal de la actividad (i,j).<br/>
              <code className="text-white">L_ij</code> = Diferencia entre el tiempo normal y el tiempo acelerado (Crash).
            </Callout>
          </Sec>
        </div>
      )}

      {/* ══ VRP ════════════════════════════════════════════════════════════ */}
      {tab === 'vrp' && (
        <div className="space-y-5">
          <Sec title="Vehicle Routing Problem (VRP) — Formulación">
            <p>El VRP (Dantzig &amp; Ramser, 1959) generaliza el TSP: dado un depósito y <em>n</em> clientes con demandas, una flota de <em>k</em> vehículos con capacidad Q debe atender todos los clientes minimizando distancia total recorrida. Es NP-Hard.</p>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 font-mono text-sm space-y-2">
              <p className="text-yellow-400">min Z = {'Σᵢ Σⱼ Σₖ  cᵢⱼ · xᵢⱼₖ'}</p>
              <p className="text-slate-400 text-xs">s.a.: Cada cliente visitado exactamente una vez por exactamente un vehículo</p>
              <p className="text-emerald-400">{'Σᵢ dᵢ · yᵢₖ ≤ Q   ∀k  (capacidad)'}</p>
              <p className="text-emerald-400">{'xᵢⱼₖ ∈ {0,1},   yᵢₖ ∈ {0,1}'}</p>
            </div>
          </Sec>

          <Sec title="Variantes del VRP">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['CVRP','Capacitated VRP','Solo restricción de capacidad por vehículo','⭐ Más estudiado'],
                ['VRPTW','VRP con Ventanas de Tiempo','Cada cliente tiene horario [a,b] de entrega','📅 Last-mile delivery'],
                ['MDVRP','VRP Multi-Depósito','Varios centros de distribución de origen','🏭 Retail chains'],
                ['VRPB','VRP con Backhauls','Entregas Y recogidas en la misma ruta','🔄 Logística inversa'],
              ].map(([code,name,desc,use]) => (
                <div key={code} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono font-bold text-emerald-400">{code}</p>
                      <p className="text-xs font-semibold text-slate-200">{name}</p>
                    </div>
                    <span className="text-xs text-slate-500">{use}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </Sec>

          <Sec title="Heurística de Ahorros — Clarke &amp; Wright (1964)">
            <p>La heurística más usada para VRP. Parte de <em>n</em> rutas individuales (depósito→cliente→depósito) y las fusiona iterativamente según el ahorro <strong className="text-white">Sᵢⱼ</strong>.</p>
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 text-center">
              <p className="text-xs text-slate-500 mb-2">Ahorro por fusionar las rutas que sirven i y j:</p>
              <p className="font-mono text-emerald-400">Sᵢⱼ = c₀ᵢ + c₀ⱼ - cᵢⱼ</p>
              <p className="text-xs text-slate-400 mt-2">donde c₀ᵢ = dist(depósito, i). Fusionar ahorra evitar dos viajes al depósito.</p>
            </div>
          </Sec>
        </div>
      )}

      {/* ══ GREEDY / 2-OPT ════════════════════════════════════════════════ */}
      {tab === 'greedy' && (
        <div className="space-y-5">
          <Sec title="Heurísticas Constructivas para TSP/VRP">
            <p>Las heurísticas constructivas <em>construyen</em> una solución paso a paso, tomando decisiones locales. Son rápidas (O(n²)) pero no garantizan el óptimo. Se usan como <strong className="text-white">solución inicial</strong> para metaheurísticas.</p>
          </Sec>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {[
              ['Vecino más Cercano','O(n²)','Desde el nodo actual, ir al más cercano no visitado. Simple y rápido. Gap típico: 20-25% del óptimo.'],
              ['Inserción más Barata','O(n³)','Insertar el nodo no incluido cuyo costo de inserción sea mínimo. Gap: 15-20%.'],
              ['2-opt / 3-opt','O(n²) por paso','Mejora local: intercambiar segmentos del tour si reduce el costo. El estándar de mejora local.'],
            ].map(([n,c,d]) => (
              <div key={n} className="card">
                <p className="font-bold text-slate-200 text-sm">{n}</p>
                <p className="font-mono text-xs text-emerald-400 mt-1">{c}</p>
                <p className="text-xs text-slate-400 mt-2">{d}</p>
              </div>
            ))}
          </div>

          <Py label="greedy_tsp.py — Vecino más Cercano + mejora 2-opt" code={CODE_GREEDY} />

          <Callout color="yellow" title="Observación sobre 2-opt">
            El operador 2-opt trabaja invirtiendo un segmento del tour (tour[i..j]). Cada inversión es válida si reduce el costo. La búsqueda termina cuando ningún intercambio mejora. El resultado es un <strong>óptimo local 2-opt</strong>, no necesariamente global.
          </Callout>
        </div>
      )}

      {/* ══ SA ════════════════════════════════════════════════════════════ */}
      {tab === 'sa' && (
        <div className="space-y-5">
          <Sec title="Recocido Simulado (Simulated Annealing)">
            <p>Inspirado en el proceso de recocido metalúrgico (Kirkpatrick et al., 1983): calentar un metal a alta temperatura y enfriarlo lentamente para obtener una estructura cristalina de mínima energía.</p>
            <p>La clave: acepta soluciones <strong className="text-white">peores</strong> con probabilidad <code className="text-emerald-400">P = e^(-δ/T)</code> donde δ es el empeoramiento y T la temperatura. Al bajar T, la probabilidad cae — el algoritmo se vuelve más selectivo.</p>
          </Sec>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Ciclo del Algoritmo</h4>
              <ol className="space-y-2 text-xs text-slate-400">
                {['Inicializar solución s₀ (aleatoria o greedy) con temperatura T₀',
                  'Generar vecino s\' ∈ N(s) con operador de perturbación',
                  'Calcular δ = f(s\') - f(s)',
                  'Si δ < 0: aceptar s\' (mejora)',
                  'Si δ ≥ 0: aceptar con P = e^(-δ/T)',
                  'Actualizar T ← T·α (enfriamiento geométrico)',
                  'Repetir hasta T < T_min o max_iter'].map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-emerald-500 font-bold flex-shrink-0">{i+1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Guía de Parámetros</h4>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="text-slate-500 border-b border-slate-800">
                  <th className="px-2 py-1 text-left">Param</th>
                  <th className="px-2 py-1">Rango</th>
                  <th className="px-2 py-1 text-left">Efecto</th>
                </tr></thead>
                <tbody>
                  <ParamRow p="T₀" range="100–10000" effect="Temperatura inicial: alta = más exploración inicial" tip="Probar 10×costo_greedy" />
                  <ParamRow p="T_min" range="0.01–1" effect="Criterio de parada por temperatura" tip="0.1 es común" />
                  <ParamRow p="α" range="0.90–0.999" effect="Velocidad de enfriamiento. Alto = más lento" tip="0.995 para instancias grandes" />
                  <ParamRow p="max_iter" range="1k–100k" effect="Evaluaciones totales" tip="Ajustar según tiempo disponible" />
                </tbody>
              </table>
            </div>
          </div>

          <Py label="simulated_annealing.py — TSP con criterio de Metropolis" code={CODE_SA} />

          <Callout color="blue" title="Convergencia garantizada (en teoría)">
            SA converge al óptimo global si la temperatura disminuye según el esquema de Boltzmann T(k) = C/ln(1+k). En la práctica, los esquemas geométricos (T·α) son mucho más rápidos aunque sin garantía teórica de convergencia al óptimo global.
          </Callout>
        </div>
      )}

      {/* ══ TABU ══════════════════════════════════════════════════════════ */}
      {tab === 'tabu' && (
        <div className="space-y-5">
          <Sec title="Búsqueda Tabú (Tabu Search)">
            <p>Propuesta por Glover (1986, 1989). Usa <strong className="text-white">memoria adaptativa</strong> para guiar la búsqueda: una <em>lista tabú</em> prohíbe revertir movimientos recientes, forzando al algoritmo a explorar regiones nuevas del espacio de soluciones.</p>
            <p>A diferencia de SA, Tabu siempre acepta el <em>mejor vecino disponible</em> (incluso si es peor que el actual), usando la lista tabú para evitar ciclaje.</p>
          </Sec>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Componentes Clave</h4>
              <div className="space-y-3 text-xs text-slate-400">
                {[
                  ['Lista Tabú', 'Cola FIFO de movimientos prohibidos. Tamaño = tenure. Evita ciclaje a corto plazo.'],
                  ['Criterio de Aspiración', 'Permite aceptar un movimiento tabú si la solución resultante supera la mejor global conocida.'],
                  ['Tenure (tenure)', 'Cuántas iteraciones un movimiento permanece tabú. Corto = intensificación. Largo = diversificación.'],
                  ['Intensificación', 'Explorar en profundidad la vecindad de buenas soluciones conocidas.'],
                  ['Diversificación', 'Forzar exploración de regiones poco visitadas cuando el algoritmo se estanca.'],
                ].map(([t,d]) => (
                  <div key={t}>
                    <p className="font-semibold text-slate-200">{t}</p>
                    <p className="mt-0.5">{d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Guía de Parámetros</h4>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="text-slate-500 border-b border-slate-800">
                  <th className="px-2 py-1 text-left">Param</th>
                  <th className="px-2 py-1">Rango</th>
                  <th className="px-2 py-1 text-left">Recomendación</th>
                </tr></thead>
                <tbody>
                  <ParamRow p="tenure" range="5–20" effect="Tamaño de lista tabú" tip="~√n para TSP" />
                  <ParamRow p="max_iter" range="100–1000" effect="Iteraciones totales" tip="300–500 para n≤50" />
                  <ParamRow p="|N(s)|" range="n²" effect="Vecindad: todos los intercambios 2-opt" tip="Reducir para n grande" />
                </tbody>
              </table>
            </div>
          </div>

          <Py label="tabu_search.py — TSP con lista tabú y criterio de aspiración" code={CODE_TABU} />

          <Callout color="yellow" title="Tabu Search vs SA">
            Tabu es generalmente más rápido por iteración que SA (no necesita enfriamiento) pero es más sensible al tamaño del tenure. Para TSP con n≤100, Tabu suele superar a SA con el mismo presupuesto de evaluaciones.
          </Callout>
        </div>
      )}

      {/* ══ ACO ════════════════════════════════════════════════════════════ */}
      {tab === 'aco' && (
        <div className="space-y-5">
          <Sec title="Optimización por Colonia de Hormigas (ACO)">
            <p>Dorigo (1992) modeló el comportamiento de búsqueda de alimento de las hormigas: depositan feromonas en los caminos recorridos, y las rutas más cortas acumulan más feromona (más viajes en el mismo tiempo → más depósito por unidad de tiempo).</p>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-700 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Regla de selección probabilística del arco (i→j):</p>
                <p className="font-mono text-emerald-400 text-center">{'P(i→j) = [τᵢⱼ]ᵅ · [ηᵢⱼ]ᵝ  /  Σₗ [τᵢₗ]ᵅ · [ηᵢₗ]ᵝ'}</p>
                <p className="text-xs text-slate-500 text-center mt-1">donde η = 1/d (visibilidad) y τ = feromona</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Actualización de feromona (evaporación + depósito):</p>
                <p className="font-mono text-yellow-400 text-center">{'τᵢⱼ(t+1) = (1 - ρ)·τᵢⱼ(t) + Σₖ ΔτᵢⱼK'}</p>
                <p className="text-xs text-slate-500 text-center mt-1">{'ΔτᵢⱼK = Q/LK si hormiga k usó (i,j), sino 0'}</p>
              </div>
            </div>
          </Sec>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Guía de Parámetros ACO</h4>
              <table className="w-full text-xs border-collapse">
                <thead><tr className="text-slate-500 border-b border-slate-800">
                  <th className="px-2 py-1 text-left">Param</th>
                  <th className="px-2 py-1">Typical</th>
                  <th className="px-2 py-1 text-left">Efecto</th>
                </tr></thead>
                <tbody>
                  <ParamRow p="α" range="0.5–2" effect="Peso feromona: alto = explotación" tip="1.0 estándar" />
                  <ParamRow p="β" range="2–8" effect="Peso heurística: alto = greedy" tip="5.0 para TSP" />
                  <ParamRow p="ρ" range="0.05–0.5" effect="Evaporación: alto = olvida rápido" tip="0.1 para diversidad" />
                  <ParamRow p="Q" range="1–100×L*" effect="Constante de depósito" tip="100 * costo medio" />
                  <ParamRow p="m" range="n/2–2n" effect="Número de hormigas" tip="n hormigas típico" />
                </tbody>
              </table>
            </div>
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3 text-sm">Variantes de ACO</h4>
              <div className="space-y-2 text-xs">
                {[
                  ['Ant System (AS)','Todas las hormigas depositan. El original de Dorigo 1992.','text-slate-400'],
                  ['Ant Colony System (ACS)','Solo la mejor hormiga deposita. Más explotación. Dorigo 1996.','text-emerald-400'],
                  ['MAX-MIN AS (MMAS)','Limita τ ∈ [τ_min, τ_max]. Evita convergencia prematura.','text-blue-400'],
                  ['ANTS','Usa Branch & Bound junto con ACO. Óptimo para instancias pequeñas.','text-yellow-400'],
                ].map(([n,d,c]) => (
                  <div key={n} className={`${c}`}>
                    <p className="font-semibold">{n}</p>
                    <p className="text-slate-500">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Py label="aco_tsp.py — Ant System completo con trazabilidad" code={CODE_ACO} />

          <Callout color="emerald" title="ACO para VRP">
            Para VRP con capacidad, se añade una <strong>restricción de factibilidad</strong> en la selección: si agregar el cliente j excede la capacidad restante del vehículo actual, j no se incluye en los candidatos. Al completar la capacidad, la hormiga regresa al depósito e inicia una nueva ruta.
          </Callout>
        </div>
      )}

      {/* ══ COMPARE ════════════════════════════════════════════════════════ */}
      {tab === 'compare' && (
        <div className="space-y-5">
          <Sec title="Cuándo usar cada metaheurística">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 px-3 py-2 text-left text-slate-400">Criterio</th>
                    {['Greedy+2opt','SA','Tabu','ACO'].map(h => (
                      <th key={h} className="border border-slate-700 px-3 py-2 text-center text-emerald-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Calidad solución','⭐⭐','⭐⭐⭐','⭐⭐⭐⭐','⭐⭐⭐⭐'],
                    ['Velocidad','⭐⭐⭐⭐⭐','⭐⭐⭐','⭐⭐⭐','⭐⭐'],
                    ['Parámetros a ajustar','Ninguno','T₀, α, T_min','tenure','α, β, ρ, Q, m'],
                    ['Memoria requerida','O(n)','O(n)','O(tenure)','O(n²)'],
                    ['Escapar óptimos locales','❌ No','✅ Probabilístico','✅ Memoria','✅ Colectivo'],
                    ['Instancias grandes (n>500)','✅','⚠️ Lento','⚠️ Lento','✅ Paralelo'],
                    ['Problemas con restricciones','❌ Difícil','⚠️ Penalización','⚠️ Penalización','✅ Fácil'],
                    ['Paralelizable','No','✅ Multistart','Difícil','✅ Naturalmente'],
                    ['Implementación','Muy fácil','Fácil','Media','Compleja'],
                    ['Uso típico en VRP','Inicialización','VRP estándar','VRPTW','CVRP denso'],
                  ].map(([row, ...vals]) => (
                    <tr key={row} className="border-b border-slate-800 hover:bg-slate-800/20">
                      <td className="border border-slate-700 px-3 py-2 text-slate-300 font-medium">{row}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="border border-slate-700 px-3 py-2 text-center text-slate-400 text-xs">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sec>

          <Sec title="Diagrama de Decisión — ¿Cuál usar?">
            <div className="space-y-3">
              {[
                { q:'¿n < 20?', a:'→ Usar algoritmo exacto (Branch &amp; Bound). No necesitas metaheurística.', color:'text-blue-400' },
                { q:'¿Tiempo de cómputo muy limitado (< 1 seg)?', a:'→ Greedy NN + 2-opt. Solución buena en milisegundos.', color:'text-yellow-400' },
                { q:'¿Muchas restricciones complejas (ventanas de tiempo, multi-depot)?', a:'→ Tabu Search. La lista tabú es fácil de adaptar a restricciones específicas.', color:'text-emerald-400' },
                { q:'¿Problema continuo o muchas instancias similares?', a:'→ Simulated Annealing. Fácil de implementar y adaptar.', color:'text-emerald-400' },
                { q:'¿VRP grande con flota homogénea?', a:'→ ACO. Convergencia natural hacia rutas eficientes; fácil incorporar capacidad.', color:'text-purple-400' },
                { q:'¿Múltiples objetivos o espacio de búsqueda multimodal complejo?', a:'→ Algoritmos Genéticos (GA) o NSGA-II. Operadores de cruce capturan mejor la estructura.', color:'text-orange-400' },
              ].map(({ q, a, color }) => (
                <div key={q} className="bg-slate-900 rounded-xl p-4 border border-slate-800">
                  <p className="font-semibold text-slate-200 text-sm">{q}</p>
                  <p className={`text-xs mt-1 ${color}`} dangerouslySetInnerHTML={{ __html: a }} />
                </div>
              ))}
            </div>
          </Sec>

          <Sec title="Recursos para Profundizar">
            <div className="space-y-2">
              {[
                ['Dorigo &amp; Stützle (2004)', '"Ant Colony Optimization". MIT Press. La referencia definitiva de ACO.'],
                ['Glover &amp; Laguna (1997)', '"Tabu Search". Kluwer Academic. Manual completo de Búsqueda Tabú.'],
                ['Kirkpatrick et al. (1983)', '"Optimization by Simulated Annealing". Science. El artículo original de SA.'],
                ['Taha (2012) §8', 'Optimización heurística: TSP, VRP, variantes y software.'],
                ['OR-Tools (Google)', 'Python: librería de optimización industrial con VRP solver incluido.'],
              ].map(([ref, desc]) => (
                <div key={ref} className="flex gap-3 text-xs">
                  <span className="text-emerald-400 font-mono flex-shrink-0">[REF]</span>
                  <div>
                    <p className="font-bold text-slate-200" dangerouslySetInnerHTML={{ __html: ref }} />
                    <p className="text-slate-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Sec>
        </div>
      )}

      {/* ══ TEORÍA AVANZADA ═══════════════════════════════════════════════ */}
      {tab === 'theory' && <Module4Theory />}
    </div>
  );
}
