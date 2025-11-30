import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, InputGroup, Badge } from './components/UIComponents';
import { ResultsView } from './components/ResultsView';
import { solveQuadratic, formatEquation } from './services/mathUtils';
import { getGeminiExplanation } from './services/geminiService';
import { QuadraticParams, QuadraticResult } from './types';

// Preset examples from the PDF content
const EXAMPLES = [
  { a: 1, b: 0, c: -9, label: "x² - 9 = 0 (Incompleta B)" },
  { a: 2, b: -32, c: 0, label: "2x² - 32x = 0 (Incompleta C)" }, // Note: OCR had error, assuming 2x^2-32=0 (b=0) or 2x^2-32x=0 based on typical prob. Let's stick to OCR page 5: 2x^2 - 32 = 0
  { a: 2, b: 0, c: -32, label: "2x² - 32 = 0 (Page 5)" },
  { a: 1, b: 7, c: 0, label: "x² + 7x = 0 (Page 5)" },
  { a: 1, b: -5, c: 6, label: "x² - 5x + 6 = 0 (Completa)" },
  { a: 2, b: -4, c: -7, label: "2x² - 4x - 7 = 0" },
];

const App: React.FC = () => {
  const [params, setParams] = useState<QuadraticParams>({ a: 1, b: -5, c: 6 });
  const [result, setResult] = useState<QuadraticResult>(solveQuadratic(params));
  const [explanation, setExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeTab, setActiveTab] = useState<'solver' | 'report'>('solver');
  
  // Ref for the content we want to capture in PDF
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResult(solveQuadratic(params));
    setExplanation(""); // Clear explanation on parameter change
  }, [params]);

  const handleExplain = async () => {
    setIsExplaining(true);
    const text = await getGeminiExplanation(params);
    setExplanation(text);
    setIsExplaining(false);
  };

  const handleDownloadPDF = () => {
    const { jspdf } = window;
    if (!jspdf) {
      alert("Error: jsPDF library not loaded.");
      return;
    }

    const doc = new jspdf.jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 113, 227); // Apple Blue
    doc.text("QuadraSolver Report", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, yPos);

    yPos += 20;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("1. Ecuación", 20, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont("courier", "bold");
    doc.text(formatEquation(params), 30, yPos);

    yPos += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("2. Resultados", 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Tipo: ${result.equationType.toUpperCase()}`, 30, yPos);
    yPos += 7;
    doc.text(`Discriminante: ${result.discriminant}`, 30, yPos);
    yPos += 7;
    doc.text(`Vértice: (${result.vertex.x.toFixed(2)}, ${result.vertex.y.toFixed(2)})`, 30, yPos);
    yPos += 7;
    
    let rootText = "";
    if (result.roots.type === 'real') rootText = `x1 = ${result.roots.x1?.toFixed(2)}, x2 = ${result.roots.x2?.toFixed(2)}`;
    else if (result.roots.type === 'double') rootText = `x = ${result.roots.x1?.toFixed(2)} (Doble)`;
    else rootText = "No tiene soluciones reales";
    
    doc.text(`Soluciones: ${rootText}`, 30, yPos);

    yPos += 20;
    if (explanation) {
      doc.setFontSize(16);
      doc.text("3. Explicación Paso a Paso", 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      
      const splitText = doc.splitTextToSize(explanation.replace(/\*\*/g, ''), pageWidth - 40);
      doc.text(splitText, 20, yPos);
    } else {
       doc.setFontSize(10);
       doc.setTextColor(150);
       doc.text("(No se generó explicación con IA para este reporte)", 20, yPos);
    }

    doc.save("ecuacion_reporte.pdf");
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-apple-blue rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              Q
            </div>
            <h1 className="text-xl font-semibold tracking-tight">QuadraSolver Pro</h1>
          </div>
          <div className="flex items-center space-x-4">
             <button 
               onClick={handleDownloadPDF}
               className="text-apple-blue hover:text-blue-700 font-medium text-sm flex items-center transition-colors"
             >
               <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
               Exportar PDF
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Input Section */}
        <section className="animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2 tracking-tight text-gray-900">Calculadora de Ecuaciones</h2>
            <p className="text-gray-500 text-lg">Resuelve ecuaciones de 2º grado, visualiza la función y aprende paso a paso.</p>
          </div>

          <Card className="max-w-3xl mx-auto backdrop-blur-xl bg-white/80 border border-white/40 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
               <InputGroup label="a (x²)" value={params.a} onChange={(v) => setParams(p => ({...p, a: v}))} color="text-purple-500" />
               <InputGroup label="b (x)" value={params.b} onChange={(v) => setParams(p => ({...p, b: v}))} color="text-blue-500" />
               <InputGroup label="c (término)" value={params.c} onChange={(v) => setParams(p => ({...p, c: v}))} color="text-green-500" />
            </div>
            
            <div className="mt-8 flex justify-center flex-wrap gap-2">
              {EXAMPLES.map((ex, idx) => (
                <button 
                  key={idx}
                  onClick={() => setParams({ a: ex.a, b: ex.b, c: ex.c })}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Dynamic Equation Preview Badge */}
        <div className="flex justify-center">
            <Badge color={
              result.equationType === 'complete' ? 'bg-purple-100 text-purple-700' : 
              result.equationType === 'linear' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }>
              {result.equationType === 'complete' && 'Ecuación Completa'}
              {result.equationType === 'incomplete-b' && 'Incompleta (Falta b)'}
              {result.equationType === 'incomplete-c' && 'Incompleta (Falta c)'}
              {result.equationType === 'linear' && 'Ecuación Lineal (a=0)'}
            </Badge>
        </div>

        {/* Results & Graph */}
        <ResultsView params={params} result={result} />

        {/* AI Tutor Section */}
        <section className="mt-12">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-2xl font-bold text-gray-900">Tutor Virtual</h3>
             <Button onClick={handleExplain} disabled={isExplaining || params.a === 0}>
                {isExplaining ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analizando...
                  </span>
                ) : "Explicar paso a paso con IA"}
             </Button>
           </div>
           
           <Card className="min-h-[200px] bg-gradient-to-br from-white to-gray-50 border border-white/60">
             {explanation ? (
               <div className="prose prose-blue max-w-none">
                 <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                   {explanation}
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                 <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
                 <p>Presiona el botón para recibir una explicación detallada del procedimiento.</p>
               </div>
             )}
           </Card>
        </section>

      </main>
    </div>
  );
};

export default App;