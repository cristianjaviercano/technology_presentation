import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Calculator, PlayCircle, CheckSquare,
  Database, User, AlertCircle, CheckCircle2, Award, FileEdit, Network, Truck
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

// =====================================================================
// CONFIGURACIÓN DE FIREBASE (Persistencia Académica)
// =====================================================================
let app, auth, db, appId;
try {
  if (typeof __firebase_config !== 'undefined') {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = typeof __app_id !== 'undefined' ? __app_id : 'curso-optimizacion-redes-v2';
  }
} catch (e) {
  console.error("Error al inicializar Firebase.", e);
}

// =====================================================================
// APLICACIÓN PRINCIPAL
// =====================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [currentView, setCurrentView] = useState('home');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!auth) {
      setIsInitializing(false);
      return;
    }
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error de autenticación:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveName = async () => {
    if (user && studentName.trim() !== "") {
      await updateProfile(user, { displayName: studentName });
      setUser({ ...user, displayName: studentName });
    }
  };

  if (isInitializing) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><p className="text-lg text-slate-600 font-semibold animate-pulse">Inicializando Entorno Académico Avanzado...</p></div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* SIDEBAR DE NAVEGACIÓN */}
      <aside className="w-80 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-6 bg-slate-950 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">Optimización de Redes</h1>
          <p className="text-xs text-slate-400 mt-2 font-mono">Plan de Estudios 2.0 (4 Módulos)</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <NavItem icon={<BookOpen size={18} />} label="Syllabus e Introducción" isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />

          <div className="mt-4 mb-2 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidad 1: Programación Lineal</div>
          <NavItem icon={<Database size={18} />} label="Módulo 1: Transporte y Transbordo" isActive={currentView === 'mod1'} onClick={() => setCurrentView('mod1')} />
          <NavItem icon={<PlayCircle size={18} />} label="Lab: Transporte Interactivo" isActive={currentView === 'lab1'} onClick={() => setCurrentView('lab1')} />

          <div className="mt-4 mb-2 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidad 2: Grafos Exactos</div>
          <NavItem icon={<Calculator size={18} />} label="Módulo 2: Algoritmos de Ruta" isActive={currentView === 'mod2'} onClick={() => setCurrentView('mod2')} />
          <NavItem icon={<Network size={18} />} label="Módulo 3: Flujo Máx y Árboles" isActive={currentView === 'mod3'} onClick={() => setCurrentView('mod3')} />
          <NavItem icon={<PlayCircle size={18} />} label="Lab: Visualizador Dijkstra" isActive={currentView === 'lab2'} onClick={() => setCurrentView('lab2')} />

          <div className="mt-4 mb-2 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Unidad 3: Complejidad</div>
          <NavItem icon={<Truck size={18} />} label="Módulo 4: CPM/PERT y VRP" isActive={currentView === 'mod4'} onClick={() => setCurrentView('mod4')} />
          <NavItem icon={<FileEdit size={18} />} label="Lab: Modelado Matemático (LaTeX)" isActive={currentView === 'lab_latex'} onClick={() => setCurrentView('lab_latex')} />

          <div className="mt-4 mb-2 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluación</div>
          <NavItem icon={<CheckSquare size={18} />} label="Examen de Certificación" isActive={currentView === 'exam'} onClick={() => setCurrentView('exam')} />
          <NavItem icon={<Award size={18} />} label="Mis Calificaciones" isActive={currentView === 'grades'} onClick={() => setCurrentView('grades')} />
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <User size={16} className="text-emerald-500" />
                <span className="truncate">{user.displayName || 'Estudiante Activo'}</span>
              </div>
              {!user.displayName && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text" placeholder="Tu nombre completo"
                    className="w-full bg-slate-800 text-xs text-white px-2 py-1 rounded border border-slate-700 outline-none focus:border-emerald-500"
                    value={studentName} onChange={(e) => setStudentName(e.target.value)}
                  />
                  <button onClick={handleSaveName} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2 py-1 rounded">Guardar</button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-red-400">Modo Local (Sin Persistencia)</div>
          )}
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="max-w-5xl mx-auto p-8 lg:p-12">
          {currentView === 'home' && <HomeView />}
          {currentView === 'mod1' && <Module1View />}
          {currentView === 'lab1' && <LabTransport />}
          {currentView === 'mod2' && <Module2View />}
          {currentView === 'mod3' && <Module3View />}
          {currentView === 'lab2' && <LabDijkstra />}
          {currentView === 'mod4' && <Module4View />}
          {currentView === 'lab_latex' && <LabLatexEditor />}
          {currentView === 'exam' && <ExamView user={user} setView={setCurrentView} />}
          {currentView === 'grades' && <GradesView user={user} />}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-colors text-left ${isActive ? 'bg-slate-800 text-emerald-400 border-r-4 border-emerald-500 font-bold' : 'hover:bg-slate-800/50 hover:text-white text-slate-400'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

// =====================================================================
// VISTAS TEÓRICAS (Módulo 1 a 4) - Rigor Científico
// =====================================================================

function HomeView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Optimización en Redes</h1>
        <p className="text-lg text-slate-600 mt-2 font-medium">Modelado Matemático, Programación Lineal y Metaheurísticas</p>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-emerald-600" /> Syllabus Académico (4 Módulos)
        </h2>
        <div className="prose prose-slate max-w-none">
          <p className="text-justify leading-relaxed">
            Bienvenidos al curso avanzado dictado acorde a los principios de Investigación de Operaciones (Taha, 2012) y flujos en redes (Ahuja et al., 1993). La optimización en redes abarca estructuras matemáticas que modelan desde cadenas de suministro intercontinentales (Ballou, 2004) hasta micro-ruteos y arquitecturas de telecomunicación.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <h4 className="font-bold text-slate-800">Módulo 1: Transporte y Transbordo</h4>
              <p className="text-sm text-slate-600 mt-1">Formulación de Modelos de Programación Lineal (PL). Balance de masas, nodos ficticios, unomodularidad total.</p>
            </div>
            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <h4 className="font-bold text-slate-800">Módulo 2: Algoritmos de Ruta</h4>
              <p className="text-sm text-slate-600 mt-1">Caminos más cortos. Algoritmos de Dijkstra (origen único) y Floyd-Warshall (todos contra todos) usando programación dinámica.</p>
            </div>
            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <h4 className="font-bold text-slate-800">Módulo 3: Flujo Máx y Árboles</h4>
              <p className="text-sm text-slate-600 mt-1">Teorema de Flujo Máximo - Corte Mínimo (Ford-Fulkerson). Árbol de expansión mínima (Algoritmos de Prim y Kruskal).</p>
            </div>
            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <h4 className="font-bold text-slate-800">Módulo 4: CPM/PERT y Heurísticas</h4>
              <p className="text-sm text-slate-600 mt-1">Administración de proyectos. Problema de Ruteo de Vehículos (VRP) e introducción a la Optimización por Colonia de Hormigas (ACO).</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-600 text-sm">
            <strong className="text-emerald-900">Nota sobre el modelado:</strong> Durante este curso utilizaremos notación matemática estándar. En el laboratorio de LaTeX podrá practicar la sintaxis usando <code>$ecuación$</code> para ecuaciones en línea y <code>$$ecuación$$</code> para bloques.
          </div>
        </div>
      </section>
    </div>
  );
}

function Module1View() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Módulo 1: Transporte y Transbordo</h1>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose max-w-none text-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">El Problema de Transbordo</h2>
        <p className="text-justify leading-relaxed">
          Una extensión del problema clásico de transporte es el <strong>Problema de Transbordo</strong> (Balakrishnan, 1995; Taha, 2012). Aquí, los envíos pueden pasar a través de nodos intermedios (nodos de transbordo) antes de llegar a su destino final. Esto es fundamental en la logística moderna (centros de consolidación o <em>cross-docking</em> descritos por Ballou).
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">Formulación Generalizada</h3>
        <p>Sea un grafo dirigido {"$G = (N, A)$"}, donde {"$N$"} es el conjunto de nodos y {"$A$"} el conjunto de arcos. Definimos {"$b_i$"} como el flujo neto en el nodo {"$i$"} ({"$b_i \\ge 0$"} para orígenes, {"$b_i \\le 0$"} para destinos, {"$b_i = 0$"} para nodos de transbordo puros). La condición matemática fundamental de balanceo global es {"$\\sum_{i \\in N} b_i = 0$"}.</p>

        <div className="bg-slate-900 text-white p-6 rounded-lg my-6 font-serif text-lg text-center overflow-x-auto shadow-inner">
          <p className="text-emerald-400">{"$\\min Z = \\sum_{(i,j) \\in A} c_{ij} x_{ij}$"}</p>
          <p className="mt-4 text-left text-base font-sans text-slate-300">Sujeto a las Ecuaciones de Conservación de Flujo:</p>
          <p className="mt-2">{"$\\sum_{\\{j \\mid (i,j) \\in A\\}} x_{ij} - \\sum_{\\{j \\mid (j,i) \\in A\\}} x_{ji} = b_i \\quad \\forall i \\in N$"}</p>
          <p className="mt-2 text-sm">{"$x_{ij} \\ge 0 \\quad \\forall (i,j) \\in A$"}</p>
        </div>

        <p className="text-justify">
          La matriz de restricciones de este modelo posee la propiedad de <strong>unimodularidad total</strong>, lo que garantiza que si las ofertas {"$b_i$"} y las capacidades son enteras, el algoritmo Simplex siempre convergerá a una solución donde las variables de decisión {"$x_{ij}$"} serán estrictamente enteras.
        </p>
      </section>
    </div>
  );
}

function Module2View() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Módulo 2: Algoritmos de Ruta Más Corta</h1>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose max-w-none text-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Dijkstra y Floyd-Warshall</h2>
        <p className="text-justify leading-relaxed">
          En la Teoría de Grafos, los problemas de enrutamiento son elementales. Mientras <strong>Dijkstra</strong> encuentra la ruta más corta desde un único nodo origen hacia todos los demás en grafos con pesos no negativos {"$\\mathcal{O}(|V|^2)$"}, <strong>Floyd-Warshall</strong> evalúa la ruta más corta entre todos los pares de nodos mediante programación dinámica {"$\\mathcal{O}(|V|^3)$"}.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">Relación de Recurrencia (Floyd-Warshall)</h3>
        <p className="mb-4">Sea {"$d_{ij}^{(k)}$"} la distancia del camino más corto desde el nodo {"$i$"} al nodo {"$j$"} utilizando únicamente los nodos {"$\\{1, 2, \\dots, k\\}$"} como nodos intermedios permitidos.</p>

        <div className="bg-slate-50 border-l-4 border-emerald-500 p-6 rounded my-6 text-center text-lg font-serif">
          {"$d_{ij}^{(k)} = \\min \\left( d_{ij}^{(k-1)}, \\ d_{ik}^{(k-1)} + d_{kj}^{(k-1)} \\right)$"}
        </div>

        <p>
          Esta ecuación define el núcleo del algoritmo. Iterativamente se evalúa si incluir un nuevo nodo {"$k$"} como "pivote" en la ruta reduce el costo total de ir de {"$i$"} a {"$j$"}. El algoritmo tolera arcos negativos, pero permite la detección de <em>ciclos de peso negativo</em> si la diagonal principal de la matriz de distancias presenta valores menores a cero ({"$d_{ii} < 0$"}).
        </p>
      </section>
    </div>
  );
}

function Module3View() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Módulo 3: Flujo Máximo y Árboles</h1>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose max-w-none text-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Teorema de Flujo Máximo - Corte Mínimo</h2>
        <p className="text-justify leading-relaxed">
          En redes de suministro limitadas por capacidad (ej. ductos, telecomunicaciones o tráfico), se busca maximizar el flujo desde un nodo fuente {"$s$"} hasta un sumidero {"$t$"}. El <strong>Algoritmo de Ford-Fulkerson</strong> resuelve esto buscando rutas de aumento en un grafo residual {"$G_f$"}.
        </p>

        <div className="bg-slate-100 p-6 rounded my-4 text-center font-serif">
          {"$\\max v$"} <br />
          Sujeto a: {"$\\sum x_{ij} - \\sum x_{ji} = \\begin{cases} v & \\text{si } i = s \\\\ -v & \\text{si } i = t \\\\ 0 & \\text{si } i \\neq s, t \\end{cases}$"} <br />
          {"$0 \\le x_{ij} \\le u_{ij}$"}
        </div>

        <p>
          El <strong>Teorema Min-Cut Max-Flow</strong> establece matemáticamente que el valor del flujo máximo que puede pasar por la red es exactamente igual a la capacidad del <em>corte s-t de capacidad mínima</em>. Si removemos los arcos de este corte, el grafo queda desconectado.
        </p>

        <h3 className="text-xl font-bold mt-8 mb-4">Árbol de Expansión Mínima (MST)</h3>
        <p className="text-justify">
          Para conectar un conjunto de nodos (ej. electrificación urbana) asegurando un camino entre cualquier par de nodos minimizando la longitud total de cableado, se utiliza el modelo MST. Los algoritmos de <strong>Kruskal</strong> (basado en ordenar aristas) y <strong>Prim</strong> (crecimiento desde un nodo raíz) resuelven este problema de manera óptima utilizando un enfoque <em>Greedy</em>.
        </p>
      </section>
    </div>
  );
}

function Module4View() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Módulo 4: CPM/PERT y VRP</h1>
      </header>

      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose max-w-none text-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Logística y Problemas NP-Hard</h2>
        <p className="text-justify leading-relaxed">
          En logística avanzada (Ballou, 2004), la teoría de grafos da un salto de complejidad al abordar el <strong>Vehicle Routing Problem (VRP)</strong>. A diferencia del transporte lineal, el VRP es NP-Hard. Aquí se deben diseñar rutas óptimas para una flota de vehículos que atiende a múltiples clientes.
        </p>

        <h3 className="text-xl font-bold mt-6 mb-4">Metaheurísticas: Colonia de Hormigas (ACO)</h3>
        <p className="text-justify">
          Ante la imposibilidad de usar métodos exactos en redes muy grandes, se recurre a la Inteligencia Computacional (Dorigo, 1999). El algoritmo de Colonia de Hormigas modela el rastro de feromonas depositado iterativamente para encontrar el óptimo global.
        </p>

        <div className="bg-slate-900 text-emerald-400 p-6 rounded-lg my-6 font-serif text-lg text-center overflow-x-auto">
          <p>{"$\\tau_{ij}(t+1) = (1 - \\rho) \\tau_{ij}(t) + \\sum_{k=1}^{m} \\Delta\\tau_{ij}^{k}$"}</p>
        </div>
        <p className="text-sm italic text-center mt-2">Donde {"$\\rho$"} es el coeficiente de evaporación y {"$\\Delta\\tau$"} es el incremento de feromona.</p>

        <h3 className="text-xl font-bold mt-8 mb-4">Programación de Proyectos (CPM/PERT)</h3>
        <p className="text-justify">
          El Método de la Ruta Crítica (CPM) identifica las tareas secuenciales que no tienen holgura ({"$H_i = L_i - E_i = 0$"}). Cualquier retraso en un nodo crítico impacta directamente el <em>makespan</em> del proyecto completo. PERT introduce variables estocásticas asumiendo que las duraciones siguen una distribución Beta.
        </p>
      </section>
    </div>
  );
}

// =====================================================================
// LABORATORIOS INTERACTIVOS
// =====================================================================

function LabTransport() {
  const [flows, setFlows] = useState({ f1A: 0, f1B: 0, f2A: 0, f2B: 0 });
  const supply = { S1: 100, S2: 150 };
  const demand = { D1: 120, D2: 130 };
  const costs = { f1A: 5, f1B: 8, f2A: 7, f2B: 4 };

  const currentSupply = { S1: flows.f1A + flows.f1B, S2: flows.f2A + flows.f2B };
  const currentDemand = { D1: flows.f1A + flows.f2A, D2: flows.f1B + flows.f2B };
  const totalCost = (flows.f1A * costs.f1A) + (flows.f1B * costs.f1B) + (flows.f2A * costs.f2A) + (flows.f2B * costs.f2B);

  const isBalanced = currentSupply.S1 <= supply.S1 && currentSupply.S2 <= supply.S2 &&
    currentDemand.D1 === demand.D1 && currentDemand.D2 === demand.D2;
  const isOptimal = isBalanced && totalCost === 1140;

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Lab 1: Transporte Heurístico</h1>
        <p className="text-slate-600 mt-2">Maneja las variables {"$x_{ij}$"} para cumplir restricciones minimizando {"$Z$"}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center bg-slate-50 p-8 rounded-lg relative h-64 border border-slate-100 mb-8">
            <div className="flex flex-col justify-between h-full z-10">
              <Node label="Origen 1" value={currentSupply.S1} max={supply.S1} isSource />
              <Node label="Origen 2" value={currentSupply.S2} max={supply.S2} isSource />
            </div>
            <div className="flex flex-col justify-between h-full z-10">
              <Node label="Destino A" value={currentDemand.D1} max={demand.D1} isDemand />
              <Node label="Destino B" value={currentDemand.D2} max={demand.D2} isDemand />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <FlowSlider id="f1A" label="x_1A (Costo $5)" value={flows.f1A} onChange={(v) => setFlows({ ...flows, f1A: parseInt(v) })} max={120} />
            <FlowSlider id="f1B" label="x_1B (Costo $8)" value={flows.f1B} onChange={(v) => setFlows({ ...flows, f1B: parseInt(v) })} max={100} />
            <FlowSlider id="f2A" label="x_2A (Costo $7)" value={flows.f2A} onChange={(v) => setFlows({ ...flows, f2A: parseInt(v) })} max={120} />
            <FlowSlider id="f2B" label="x_2B (Costo $4)" value={flows.f2B} onChange={(v) => setFlows({ ...flows, f2B: parseInt(v) })} max={130} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-slate-300 uppercase text-xs mb-2">Función Z</h3>
            <div className="text-4xl font-extrabold font-mono text-emerald-400">${totalCost}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <ul className="space-y-3 text-sm">
              <StatusItem label="Oferta S1" current={currentSupply.S1} max={supply.S1} type="leq" />
              <StatusItem label="Oferta S2" current={currentSupply.S2} max={supply.S2} type="leq" />
              <StatusItem label="Demanda D1" current={currentDemand.D1} max={demand.D1} type="eq" />
              <StatusItem label="Demanda D2" current={currentDemand.D2} max={demand.D2} type="eq" />
            </ul>
            {isOptimal ? (
              <div className="mt-4 p-3 bg-emerald-100 text-emerald-800 rounded text-sm font-bold border border-emerald-200">¡Óptimo global alcanzado!</div>
            ) : isBalanced && (
              <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded text-sm border border-blue-200">Factible, pero no óptimo. Sigue reduciendo costos.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Node({ label, value, max, isSource, isDemand }) {
  const isOver = isSource ? value > max : false;
  const isMet = isDemand ? value === max : false;
  return (
    <div className={`p-3 rounded-lg border-2 text-center w-32 bg-white shadow-sm transition-colors ${isOver ? 'border-red-500' : isMet && isDemand ? 'border-emerald-500' : 'border-slate-300'}`}>
      <div className="font-bold text-slate-800 text-sm">{label}</div>
      <div className={`font-mono mt-1 ${isOver ? 'text-red-600 font-bold' : isMet && isDemand ? 'text-emerald-600 font-bold' : 'text-slate-600'}`}>{value} / {max}</div>
    </div>
  );
}

function FlowSlider({ label, value, onChange, max }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
        <span className="font-mono">{label}</span> <span className="font-mono">{value}</span>
      </div>
      <input type="range" min="0" max={max} step="10" value={value} onChange={(e) => onChange(e.target.value)} className="w-full accent-emerald-600" />
    </div>
  );
}

function StatusItem({ label, current, max, type }) {
  let isValid = type === 'leq' ? current <= max : current === max;
  return (
    <li className="flex justify-between items-center border-b border-slate-100 pb-2">
      <span className="text-slate-600">{label}</span>
      <span className={`font-mono font-bold flex items-center gap-2 ${isValid ? 'text-emerald-600' : 'text-red-500'}`}>
        {current} {type === 'leq' ? '≤' : '='} {max}
      </span>
    </li>
  );
}

function LabDijkstra() {
  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Lab 2: Diagramas Estáticos y Complejidad</h1>
        <p className="text-slate-600 mt-2">Visualización de procesos algorítmicos teóricos.</p>
      </header>
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 prose">
        <p>El Algoritmo de Dijkstra evalúa {"$d[v] = \\min(d[v], d[u] + w(u,v))$"}. Dado un entorno virtual sin persistencia de estado gráfico complejo, invitamos al estudiante a resolver las instancias de ruteo del libro de Taha utilizando el editor de LaTeX en la siguiente pestaña para modelar las distancias en notación matricial.</p>
      </div>
    </div>
  );
}

// =====================================================================
// LABORATORIO LATEX EDITOR (Vía iframe seguro con MathJax)
// =====================================================================
function LabLatexEditor() {
  const [latexCode, setLatexCode] = useState(
    `% Escribe tu modelo de optimización aquí usando sintaxis LaTeX y MathJax.
El problema de flujo máximo (Ford-Fulkerson) se formula de la siguiente manera:

Función Objetivo:
$$ \\max Z = v $$

Restricciones de conservación de flujo en los nodos $i \\in N$:
$$ \\sum_{j} x_{ij} - \\sum_{j} x_{ji} = 
\\begin{cases} 
v & \\text{si } i = \\text{origen} \\\\ 
-v & \\text{si } i = \\text{destino} \\\\ 
0 & \\text{para nodos intermedios} 
\\end{cases} $$

Restricciones de capacidad de los arcos:
$$ 0 \\le x_{ij} \\le u_{ij} \\quad \\forall (i,j) \\in A $$
`);

  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; line-height: 1.6; color: #1e293b; }
      </style>
    </head>
    <body>
      ${latexCode.replace(/\n/g, '<br/>')}
      <script>
        if (window.MathJax) { window.MathJax.typesetPromise(); }
      </script>
    </body>
    </html>
  `;

  return (
    <div className="space-y-6 animate-in fade-in h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">Lab: Modelado Matemático LaTeX</h1>
        <p className="text-slate-600 mt-2">Práctica la construcción de ecuaciones algebraicas y modelos PL usando sintaxis `$` (inline) y `$$` (bloque).</p>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        <div className="flex flex-col border border-slate-300 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-800 text-slate-300 px-4 py-2 text-xs font-mono font-bold">Código Fuente LaTeX</div>
          <textarea
            className="flex-1 p-4 bg-slate-950 text-emerald-400 font-mono text-sm outline-none resize-none"
            value={latexCode}
            onChange={(e) => setLatexCode(e.target.value)}
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="bg-slate-100 text-slate-700 px-4 py-2 text-xs font-mono font-bold border-b border-slate-200">Vista Renderizada (MathJax)</div>
          <iframe
            srcDoc={iframeSrcDoc}
            className="flex-1 w-full border-none"
            title="LaTeX Render"
          />
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// EXAMEN DE CERTIFICACIÓN (Integrando los 4 Módulos)
// =====================================================================

const examQuestions = [
  {
    id: 1,
    text: "Módulo 1: En la formulación PL del problema de transporte, si el sistema está balanceado $\\sum s_i = \\sum d_j$ y los parámetros son enteros, ¿qué propiedad matricial garantiza que el algoritmo Simplex converja a una solución estrictamente entera?",
    options: ["El Teorema de Kuhn-Tucker.", "La Unimodularidad Total de la matriz tecnológica.", "La relajación Lagrangiana.", "El principio de optimalidad de Bellman."],
    correctIndex: 1
  },
  {
    id: 2,
    text: "Módulo 2: En la relación de recurrencia del algoritmo de Floyd-Warshall $d_{ij}^{(k)} = \\min(d_{ij}^{(k-1)}, d_{ik}^{(k-1)} + d_{kj}^{(k-1)})$, ¿qué representa la variable k?",
    options: ["El número de iteraciones o pasos máximos permitidos en la ruta.", "La capacidad del arco analizado.", "El índice del nodo intermedio que se está evaluando incorporar en la ruta.", "El nodo sumidero del grafo."],
    correctIndex: 2
  },
  {
    id: 3,
    text: "Módulo 3: Según el Teorema Min-Cut Max-Flow, el flujo máximo enviado desde un origen a un destino en una red capacitada es:",
    options: ["Igual a la suma de las holguras en la ruta crítica.", "Equivalente a la capacidad de la ruta más corta multiplicada por el número de arcos.", "Exactamente igual a la capacidad del corte de red mínimo que separa la fuente del sumidero.", "Proporcional a la cantidad de nodos ficticios añadidos."],
    correctIndex: 2
  },
  {
    id: 4,
    text: "Módulo 4: En el algoritmo de optimización metaheurística 'Colonia de Hormigas' (ACO) aplicado al Vehicle Routing Problem (VRP), ¿cuál es el rol matemático del coeficiente de evaporación $\\rho$?",
    options: ["Garantiza que la función objetivo minimice las distancias mediante el algoritmo del Simplex.", "Reduce progresivamente el nivel de feromona de los caminos menos transitados para evitar convergencias prematuras en óptimos locales.", "Calcula el makespan o ruta crítica determinística del proyecto de ruteo.", "Asigna los vehículos a las capacidades de los nodos destino en un problema de transporte puro."],
    correctIndex: 1
  }
];

function ExamView({ user, setView }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = async () => {
    if (!user) { alert("Debes estar conectado (incluso en modo local) para registrar notas."); return; }
    setIsSubmitting(true);
    let correct = 0;
    examQuestions.forEach(q => { if (answers[q.id] === q.correctIndex) correct++; });
    const finalScore = (correct / examQuestions.length) * 5.0;
    setScore(finalScore);

    try {
      const gradesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'grades');
      await addDoc(gradesRef, {
        score: finalScore,
        maxScore: 5.0,
        correctAnswers: correct,
        totalQuestions: examQuestions.length,
        timestamp: serverTimestamp(),
        type: 'Evaluación Global (4 Módulos)'
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving grade:", error);
      alert("Error al guardar en la nube. Posible ejecución en Sandbox sin config válida.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><Award size={48} /></div>
        <h2 className="text-3xl font-extrabold text-slate-900">Examen Completado</h2>
        <div className="text-5xl font-mono font-bold text-emerald-500">{score.toFixed(1)} / 5.0</div>
        <button onClick={() => setView('grades')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Ver Mis Calificaciones</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Evaluación Científica Final</h1>
        <p className="text-slate-600 mt-2">Cuestionario integrador de las 3 unidades y 4 módulos de la carta descriptiva.</p>
      </header>

      <div className="space-y-8">
        {examQuestions.map((q, idx) => (
          <div key={q.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 mb-4">
              <span className="text-emerald-600 mr-2">Pregunta {idx + 1}.</span> {q.text}
            </h3>
            <div className="space-y-3">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer border transition-colors ${answers[q.id] === optIdx ? 'bg-emerald-50 border-emerald-500' : 'hover:bg-slate-50 border-slate-200'}`}>
                  <input type="radio" name={`q-${q.id}`} value={optIdx} checked={answers[q.id] === optIdx} onChange={() => setAnswers({ ...answers, [q.id]: optIdx })} className="mt-1 accent-emerald-600" />
                  <span className="text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-6">
        <button onClick={handleSubmit} disabled={Object.keys(answers).length < examQuestions.length || isSubmitting} className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 disabled:opacity-50">
          Entregar Evaluación
        </button>
      </div>
    </div>
  );
}

function GradesView({ user }) {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !db) { setLoading(false); return; }
    const gradesRef = collection(db, 'artifacts', appId, 'users', user.uid, 'grades');
    const unsubscribe = onSnapshot(gradesRef, (snapshot) => {
      const gradesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), date: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date() }));
      gradesData.sort((a, b) => b.date - a.date);
      setGrades(gradesData);
      setLoading(false);
    }, (error) => { console.error(error); setLoading(false); });
    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="text-center mt-20 text-slate-500">Consultando registro...</div>;
  if (!user) return <div className="text-center mt-20 font-bold text-red-500">Modo Offline / No Autenticado</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Mi Historial Académico</h1>
      </header>
      {grades.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center shadow-sm">Sin registros previos.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
              <tr><th className="px-6 py-4">Evaluación</th><th className="px-6 py-4">Aciertos</th><th className="px-6 py-4 text-right">Nota Final</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800">{g.type}</td>
                  <td className="px-6 py-4 text-slate-600">{g.correctAnswers} / {g.totalQuestions}</td>
                  <td className="px-6 py-4 text-right"><span className={`px-3 py-1 rounded-full font-bold ${g.score >= 3.0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{g.score.toFixed(1)} / 5.0</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}