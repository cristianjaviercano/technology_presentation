import React, { useState } from 'react';

const Callout = ({ color = 'emerald', title, children }) => {
  const colors = {
    emerald: 'border-emerald-500 bg-emerald-500/5 text-emerald-300',
    yellow: 'border-yellow-500 bg-yellow-500/5 text-yellow-300',
    blue: 'border-blue-500 bg-blue-500/5 text-blue-300',
    red: 'border-red-500 bg-red-500/5 text-red-300',
  };
  return (
    <div className={`border-l-4 rounded-r-xl p-4 my-4 ${colors[color]}`}>
      {title && <p className="font-bold text-sm mb-1">{title}</p>}
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
};

const MathBlock = ({ children, label }) => (
  <div className="my-5 bg-slate-900 border border-slate-700 rounded-xl p-5 text-center overflow-x-auto">
    {label && <p className="text-xs text-slate-500 font-mono mb-2 text-left">{label}</p>}
    <p className="font-mono text-emerald-400 text-lg">{children}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-7">
    <h3 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
      <span className="block w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />{title}
    </h3>
    <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
  </div>
);

const TABS = ['theory', 'methods', 'unbalanced', 'example', 'pseudo'];
const TAB_LABELS = { theory: '📖 Teoría', methods: '⚙️ Métodos de Solución', unbalanced: '⚖️ Problemas Desbalanceados', example: '🔢 Ejemplo Resuelto', pseudo: '💻 Algoritmos' };

export default function Module1View() {
  const [tab, setTab] = useState('theory');
  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="gradient-header rounded-2xl p-7">
        <span className="text-xs font-mono text-emerald-400">MÓDULO 1 · Programación Lineal en Redes</span>
        <h1 className="text-3xl font-black text-white mt-1">Transporte y Transbordo</h1>
        <p className="text-slate-400 mt-1">Taha (2012) §5.1–5.4 · Ahuja, Magnanti & Orlin (1993) §1.2, §2.4 · Hillier & Lieberman (2010) §8</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-xs font-semibold rounded-t transition-colors
              ${tab===t ? 'text-emerald-400 bg-slate-800 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* ── THEORY ── */}
      {tab === 'theory' && (
        <div className="space-y-6">
          <Section title="Contexto Histórico y Motivación">
            <p>
              El <strong className="text-white">Problema de Transporte</strong> fue formulado originalmente por Hitchcock (1941) y Koopmans (1947), quienes modelaron el envío de un producto homogéneo desde múltiples orígenes de producción hacia múltiples destinos de consumo, minimizando el costo total de distribución. Dantzig (1951) lo reconoció como un caso especial del <em>Método Simplex</em> y demostró que podía resolverse con mayor eficiencia aprovechando su estructura de red.
            </p>
            <p>
              Desde la perspectiva de la cadena de suministro (Ballou, 2004), el problema de transporte está omnipresente: asignación de plantas a centros de distribución, distribución de materias primas a líneas de producción, despacho de inventarios a puntos de venta, entre otros. Su importancia radica no solo en su aplicabilidad sino en que es la puerta de entrada a los modelos de <em>flujo en redes</em> más complejos.
            </p>
          </Section>

          <Section title="Formulación Matemática Completa">
            <p>
              Sea un sistema con <strong className="text-white">m orígenes</strong> y <strong className="text-white">n destinos</strong>. Definimos:
            </p>
            <ul className="list-none space-y-1 ml-4">
              {[
                ['sᵢ', 'disponibilidad (oferta) del origen i, i = 1,…,m'],
                ['dⱼ', 'requerimiento (demanda) del destino j, j = 1,…,n'],
                ['cᵢⱼ', 'costo unitario de transporte desde i hasta j'],
                ['xᵢⱼ', 'cantidad a transportar desde i hasta j (variable de decisión)'],
              ].map(([v, d]) => (
                <li key={v} className="flex gap-3"><code className="text-emerald-400 w-8 flex-shrink-0">{v}</code><span>{d}</span></li>
              ))}
            </ul>

            <MathBlock label="Función objetivo — Minimizar costo total de distribución:">
              {'min Z = Σᵢ Σⱼ  cᵢⱼ · xᵢⱼ'}
            </MathBlock>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-500 mb-2">Restricciones de Oferta (para i = 1,…,m):</p>
                <p className="font-mono text-emerald-400">Σⱼ xᵢⱼ  ≤  sᵢ</p>
                <p className="text-xs text-slate-400 mt-2">No se puede enviar más de lo disponible en cada origen. Si el sistema está balanceado, se usa "=" en lugar de "≤".</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <p className="text-xs font-mono text-slate-500 mb-2">Restricciones de Demanda (para j = 1,…,n):</p>
                <p className="font-mono text-emerald-400">Σᵢ xᵢⱼ  =  dⱼ</p>
                <p className="text-xs text-slate-400 mt-2">La demanda de cada destino debe satisfacerse exactamente. Es una restricción de igualdad porque el cliente necesita exactamente dⱼ unidades.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <p className="text-xs font-mono text-slate-500 mb-2">No negatividad:</p>
              <p className="font-mono text-emerald-400">xᵢⱼ  ≥  0  ∀ (i,j)</p>
            </div>
          </Section>

          <Section title="Unimodularidad Total — Por qué siempre hay soluciones enteras">
            <p>
              Una de las propiedades más elegantes del problema de transporte es que su <strong className="text-white">matriz de restricciones es totalmente unimodular (TU)</strong>. Esto significa que todos los subdeterminantes de la matriz de coeficientes son 0, +1 o −1.
            </p>
            <Callout color="blue" title="Teorema (Hoffman & Kruskal, 1956)">
              Si la matriz de restricciones A es TU y el vector del lado derecho b es entero, entonces todos los vértices del poliedro {'{ x : Ax = b, x ≥ 0 }'} son puntos enteros. Por ello, el algoritmo Simplex nunca necesita explorar soluciones fraccionarias — la optimal siempre será entera.
            </Callout>
            <p>
              Esto es fundamental en logística: <em>"¿cuántas unidades envío de la Planta 1 al CD Bogotá?"</em> debe ser un número entero de cajas, pallets o camiones. La TU garantiza esto automáticamente sin agregar restricciones de integralidad explícitas (que haría el problema NP-Hard).
            </p>
          </Section>

          <Section title="El Problema de Transbordo">
            <p>
              El <strong className="text-white">Problema de Transbordo</strong> (Orden, 1956; Taha §6-2) extiende el modelo de transporte incluyendo <strong className="text-white">nodos intermediarios</strong> que pueden recibir y redespachar mercancía. Estos son los <em>centros de distribución, almacenes cross-docking o puertos de conectividad</em> descritos por Ballou (2004).
            </p>
            <p>
              En el modelo generalizado de flujo en redes, todos los nodos tienen un parámetro <strong className="text-white">bᵢ</strong> que indica el flujo neto:
            </p>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[
                ['bᵢ > 0','Nodo fuente (origen)','Tiene excedente para distribuir'],
                ['bᵢ < 0','Nodo sumidero (destino)','Tiene déficit que debe cubrirse'],
                ['bᵢ = 0','Nodo de transbordo','Todo lo que entra debe salir'],
              ].map(([v, name, desc]) => (
                <div key={v} className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-center">
                  <p className="font-mono text-emerald-400 font-bold">{v}</p>
                  <p className="text-xs font-bold text-slate-200 mt-1">{name}</p>
                  <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <MathBlock label="Ecuación de balance nodal (Conservación de flujo):">
              {'Σⱼ xᵢⱼ  -  Σⱼ xⱼᵢ  =  bᵢ  ∀ i ∈ N'}
            </MathBlock>
            <Callout color="yellow" title="Condición de balance global">
              Para que un problema de transbordo tenga solución factible, es necesario que la suma algebraica de todos los flujos netos sea cero: <strong>Σᵢ bᵢ = 0</strong>. Esto equivale a decir que la oferta total del sistema iguala la demanda total.
            </Callout>
          </Section>
        </div>
      )}

      {/* ── METHODS ── */}
      {tab === 'methods' && (
        <div className="space-y-6">
          <Section title="Fase 1: Solución Básica Factible Inicial (SBFI)">
            <p>
              El Método Simplex de Transporte necesita un punto de partida: una <strong className="text-white">solución básica factible inicial</strong> con exactamente <em>m + n − 1</em> variables básicas (flujos no cero). Existen tres métodos clásicos, listados por calidad creciente de la SBFI:
            </p>
            <div className="space-y-4 mt-4">
              {[
                {
                  name: '1. Esquina Noroeste', complexity: 'O(m+n)', quality: 'Baja',
                  desc: 'Asigna flujo comenzando desde la celda (1,1) de la tabla de transporte, agotando la oferta del origen y / o la demanda del destino antes de moverse a la siguiente celda (derecha si se agota la demanda, abajo si se agota la oferta). Ignora completamente los costos — produce la SBFI de peor calidad pero es el método más didáctico.',
                },
                {
                  name: '2. Costo Mínimo', complexity: 'O(m·n·log(m·n))', quality: 'Media',
                  desc: 'Selecciona iterativamente la celda de costo cᵢⱼ más bajo disponible y asigna el máximo posible. Considera los costos pero no de manera global — puede quedar atrapado en mínimos locales. Produce generalmente mejores SBFI que la esquina noroeste.',
                },
                {
                  name: '3. Aproximación de Vogel (VAM)', complexity: 'O(m·n·(m+n))', quality: 'Alta',
                  desc: 'Calcula para cada fila y columna la "penalización" (diferencia entre el costo mínimo y el segundo mínimo). Asigna en la fila/columna con mayor penalización — prioriza las rutas donde el costo de no elegir el mínimo es más alto. Produce SBFI muy cercanas a la óptima. (Taha §5-2B)',
                },
              ].map(m => (
                <div key={m.name} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-100">{m.name}</h4>
                    <div className="flex gap-2">
                      <span className="text-xs font-mono bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{m.complexity}</span>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${m.quality === 'Alta' ? 'bg-emerald-500/20 text-emerald-400' : m.quality === 'Media' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{m.quality}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Fase 2: Optimización — Método MODI (u-v)">
            <p>
              Una vez obtenida la SBFI, el <strong className="text-white">Método MODI</strong> (Modified Distribution Method) verifica la optimalidad y mejora la solución calculando los costos relativos <em>d̄ᵢⱼ</em> de las variables no básicas:
            </p>
            <MathBlock label="Condición de optimalidad (todas las celdas no básicas deben ser ≥ 0):">
              {'d̄ᵢⱼ = cᵢⱼ  -  uᵢ  -  vⱼ  ≥  0'}
            </MathBlock>
            <p>
              Los multiplicadores <strong className="text-white">uᵢ</strong> y <strong className="text-white">vⱼ</strong> se calculan a partir de las celdas básicas usando el sistema <em>cᵢⱼ = uᵢ + vⱼ</em> para toda celda básica. Si algún <em>d̄ᵢⱼ &lt; 0</em>, la variable xᵢⱼ debe entrar a la base — se realiza una asignación circular (<em>loop</em>) para mantener el número de variables básicas.
            </p>
            <Callout color="blue" title="Interpretación económica de uᵢ y vⱼ">
              Los multiplicadores son los <strong>precios sombra</strong> (duales) del sistema. uᵢ representa el ahorro marginal de tener una unidad adicional de oferta en el origen i, y vⱼ es el valor marginal de la demanda en el destino j. d̄ᵢⱼ = 0 indica que el arco (i,j) es degenerado (puede entrar sin cambiar Z).
            </Callout>
          </Section>
        </div>
      )}

      {/* ── UNBALANCED ── */}
      {tab === 'unbalanced' && (
        <div className="space-y-6">
          <Section title="Problemas Desbalanceados">
            <p>
              En la práctica, la oferta total raramente iguala la demanda total. Cuando el sistema está desbalanceado, es necesario agregar <strong className="text-white">variables ficticias</strong> para convertir el problema en uno balanceado antes de aplicar el Simplex de Transporte.
            </p>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card border-blue-500/30">
              <h4 className="font-bold text-blue-400 mb-3">Caso 1: Oferta Total &gt; Demanda Total</h4>
              <p className="text-sm text-slate-300 mb-3">
                La oferta excede la demanda: <strong>Σsᵢ &gt; Σdⱼ</strong>. En logística, significa que hay capacidad productiva o de almacenamiento que quedará ociosa.
              </p>
              <div className="bg-slate-900 rounded-xl p-4 border border-blue-500/20">
                <p className="text-xs text-blue-400 font-mono mb-2">Solución → Agregar Destino Ficticio:</p>
                <p className="text-sm text-slate-300">Se añade un destino <em>D(n+1)</em> con demanda ficticia <strong>d(n+1) = Σsᵢ − Σdⱼ</strong> y costos <strong>c(i,n+1) = 0</strong> para todos los orígenes. Los flujos asignados a esta columna representan capacidad ociosa.</p>
              </div>
            </div>
            <div className="card border-yellow-500/30">
              <h4 className="font-bold text-yellow-400 mb-3">Caso 2: Demanda Total &gt; Oferta Total</h4>
              <p className="text-sm text-slate-300 mb-3">
                La demanda supera la oferta: <strong>Σdⱼ &gt; Σsᵢ</strong>. En logística, significa escasez — no todos los destinos podrán suplirse completamente.
              </p>
              <div className="bg-slate-900 rounded-xl p-4 border border-yellow-500/20">
                <p className="text-xs text-yellow-400 font-mono mb-2">Solución → Agregar Origen Ficticio:</p>
                <p className="text-sm text-slate-300">Se añade un origen <em>O(m+1)</em> con oferta ficticia <strong>s(m+1) = Σdⱼ − Σsᵢ</strong> y costos <strong>c(m+1,j) = M</strong> (Big-M penalización) si hay destinos prioritarios, o <strong>0</strong> si la escasez se distribuye libremente.</p>
              </div>
            </div>
          </div>

          <Section title="Degeneración en el Problema de Transporte">
            <p>
              Una <strong className="text-white">solución degenerada</strong> ocurre cuando el número de variables básicas es menor que <em>m + n − 1</em>. Esto surge naturalmente cuando al asignar en una iteración de la SBFI se agotan simultáneamente tanto la oferta de un origen como la demanda de un destino.
            </p>
            <Callout color="red" title="Tratamiento de la degeneración">
              Se introduce una pequeña cantidad <strong>ε → 0</strong> en una celda que mantenga la conectividad del árbol de solución básica, pero cuyo valor sea despreciable para el cálculo del costo. El método MODI sigue funcionando normalmente. (Taha §5-3B)
            </Callout>
          </Section>

          <Section title="Restricciones de Ruta Prohibida">
            <p>
              Si una ruta (i,j) no existe o está restringida (carretera bloqueada, regulación aduanera, etc.), se puede modelar asignando un costo <strong className="text-white">cᵢⱼ = M (Big-M)</strong>, donde M es un número suficientemente grande. Esto garantiza que el Simplex nunca seleccione esa ruta en la solución óptima.
            </p>
          </Section>
        </div>
      )}

      {/* ── EXAMPLE ── */}
      {tab === 'example' && (
        <div className="space-y-5">
          <Section title="Ejemplo Resuelto Completo — Vogel + MODI">
            <p>Problema de Taha (2012), Ejemplo 5.2-1 ampliado. 3 orígenes (plantas), 4 destinos (centros de distribución).</p>
          </Section>

          <div className="card">
            <h4 className="font-bold text-slate-200 mb-3">Tabla de Costos Unitarios (en $000 COP/ton)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="border border-slate-700 px-3 py-2 text-slate-400"></th>
                    {['CD-Bogotá','CD-Medellín','CD-Cali','CD-Barranquilla'].map(d => (
                      <th key={d} className="border border-slate-700 px-3 py-2 text-emerald-400 text-xs">{d}</th>
                    ))}
                    <th className="border border-slate-700 px-3 py-2 text-yellow-400">Oferta (ton)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Planta Montería', '12', '8', '16', '14', '120'],
                    ['Planta Sincelejo', '6', '10', '9', '18', '80'],
                    ['Planta Cartagena', '11', '7', '13', '5', '100'],
                  ].map(row => (
                    <tr key={row[0]} className="hover:bg-slate-800/50">
                      {row.map((cell, i) => (
                        <td key={i} className={`border border-slate-700 px-3 py-2 text-center
                          ${i===0 ? 'text-emerald-400 text-xs font-bold' : i===5 ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-slate-800">
                    <td className="border border-slate-700 px-3 py-2 text-yellow-400 font-bold text-xs">Demanda (ton)</td>
                    {['70','60','90','80'].map((d,i) => <td key={i} className="border border-slate-700 px-3 py-2 text-center text-yellow-400 font-bold">{d}</td>)}
                    <td className="border border-slate-700 px-3 py-2 text-center text-slate-500">300=300 ✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card">
              <h4 className="font-bold text-slate-200 mb-3">Solución Básica Inicial (Vogel)</h4>
              <table className="w-full text-xs font-mono">
                <tbody className="divide-y divide-slate-800">
                  {[
                    ['x₁₂ (P.Montería → CD-Med)','60 ton', '$8k', '$480k'],
                    ['x₁₁ (P.Montería → CD-Bog)','60 ton', '$12k', '$720k'],
                    ['x₂₁ (P.Sincelejo → CD-Bog)','10 ton', '$6k', '$60k'],
                    ['x₂₃ (P.Sincelejo → CD-Cali)','70 ton', '$9k', '$630k'],
                    ['x₃₄ (P.Cartagena → CD-Baq)','80 ton', '$5k', '$400k'],
                    ['x₃₃ (P.Cartagena → CD-Cali)','20 ton', '$13k', '$260k'],
                  ].map(([ruta, qty, cost, sub]) => (
                    <tr key={ruta} className="hover:bg-slate-800/50">
                      <td className="py-2 text-slate-400">{ruta}</td>
                      <td className="py-2 text-right text-slate-300">{qty}</td>
                      <td className="py-2 text-right text-emerald-400">{cost}</td>
                      <td className="py-2 text-right text-yellow-400">{sub}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-slate-700 mt-3 pt-3 text-right">
                <span className="text-sm text-slate-400">Z inicial (VAM) = </span>
                <span className="text-lg font-black font-mono text-yellow-400">$2.550.000</span>
              </div>
            </div>

            <div className="card border-emerald-500/30">
              <h4 className="font-bold text-emerald-400 mb-3">Solución Óptima (tras MODI)</h4>
              <table className="w-full text-xs font-mono">
                <tbody className="divide-y divide-slate-800">
                  {[
                    ['x₁₂','60 ton', '$8k', '$480k'],
                    ['x₂₁','70 ton', '$6k', '$420k'],
                    ['x₂₃','10 ton', '$9k', '$90k'],
                    ['x₃₃','80 ton', '$13k','$1.040k'],
                    ['x₃₄','80 ton', '$5k', '$400k'],
                    ['x₁₁','10 ton', '$12k','$120k'],
                  ].map(([ruta, qty, cost, sub]) => (
                    <tr key={ruta} className="hover:bg-slate-800/50">
                      <td className="py-2 text-slate-400">{ruta}</td>
                      <td className="py-2 text-right text-slate-300">{qty}</td>
                      <td className="py-2 text-right text-emerald-400">{cost}</td>
                      <td className="py-2 text-right text-yellow-400">{sub}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-emerald-700 mt-3 pt-3 text-right">
                <span className="text-sm text-slate-400">Z* óptimo = </span>
                <span className="text-lg font-black font-mono text-emerald-400">$2.550.000</span>
                <p className="text-xs text-slate-500 mt-1">(VAM produjo ya la solución óptima en este caso)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PSEUDO ── */}
      {tab === 'pseudo' && (
        <div className="space-y-5">
          <Section title="Algoritmos de Solución">
            <p>Los tres métodos para obtener la SBFI más el algoritmo de optimización MODI.</p>
          </Section>
          {[
            {
              title: 'Aproximación de Vogel (VAM)',
              code: `VOGEL(S[m], D[n], C[m][n]):
  activo_fila[] = {1,…,m}; activo_col[] = {1,…,n}
  WHILE hay filas o columnas activas:
    Para cada fila i activa:
      penalty_fila[i] = 2do_min(C[i][*]) - min(C[i][*])
    Para cada col j activa:
      penalty_col[j] = 2do_min(C[*][j]) - min(C[*][j])
    k = argmax(penalty_fila ∪ penalty_col)
    (i*, j*) = celda de costo min en la fila/col k
    x[i*][j*] = min(S[i*], D[j*])
    S[i*] -= x[i*][j*]; D[j*] -= x[i*][j*]
    Si S[i*]=0: desactivar fila i*
    Si D[j*]=0: desactivar columna j*
  RETURN X`
            },
            {
              title: 'MODI — Verificación y Mejora',
              code: `MODI(X, C, m, n):
  // Calcular multiplicadores u[], v[]
  u[1] = 0
  REPEAT hasta convergencia:
    Para toda celda básica (i,j): cij = u[i] + v[j]
    Para toda celda no básica (i,j):
      d_bar[i][j] = C[i][j] - u[i] - v[j]
    Si min(d_bar) >= 0: RETURN X  // óptimo
    // Celda entrante: (p,q) = argmin(d_bar)
    LOOP = encontrar_ciclo(X, p, q)
    theta = min{ x[i][j] : (i,j) en posición negativa del LOOP }
    Actualizar x[i][j] ± theta en el ciclo
  RETURN X`
            },
          ].map(({ title, code }) => (
            <div key={title} className="card">
              <h4 className="font-bold text-slate-200 mb-3">{title}</h4>
              <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-emerald-400 font-mono leading-relaxed overflow-x-auto">{code}</pre>
            </div>
          ))}

          <div className="card">
            <h4 className="font-bold text-slate-200 mb-3">Complejidad Computacional</h4>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-700 text-slate-400 text-xs">
                <th className="py-2 text-left">Algoritmo</th>
                <th className="py-2 text-center">Fase</th>
                <th className="py-2 text-center">Complejidad</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {[
                  ['Esquina Noroeste','SBFI','O(m+n)'],
                  ['Costo Mínimo','SBFI','O(m·n·log(m·n))'],
                  ['Vogel (VAM)','SBFI','O(m·n·(m+n))'],
                  ['MODI','Optimización','O(m·n) / iteración'],
                  ['Hungarian Alg.','Asignación (m=n)','O(n³)'],
                ].map(([alg, fase, comp]) => (
                  <tr key={alg} className="hover:bg-slate-800/50">
                    <td className="py-2 text-slate-300">{alg}</td>
                    <td className="py-2 text-center text-slate-400 text-xs">{fase}</td>
                    <td className="py-2 text-center font-mono text-emerald-400">{comp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
