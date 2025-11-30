import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { QuadraticResult, QuadraticParams } from '../types';
import { Card, Badge } from './UIComponents';
import { generateGraphData, formatEquation } from '../services/mathUtils';

interface ResultsViewProps {
  params: QuadraticParams;
  result: QuadraticResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ params, result }) => {
  const data = generateGraphData(params);
  const formattedEq = formatEquation(params);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solution Card */}
        <Card className="md:col-span-1 h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
          </div>
          
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Ecuación</h3>
          <div className="text-2xl font-mono text-gray-800 mb-6 truncate">{formattedEq}</div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Resultados</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-500 text-sm">Discriminante (Δ):</span>
              <span className="ml-2 font-mono font-bold">{result.discriminant}</span>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
               {result.roots.type === 'real' && (
                 <div className="flex justify-between items-center">
                   <div className="flex flex-col">
                     <span className="text-xs text-blue-500 font-bold uppercase">X₁</span>
                     <span className="text-2xl font-bold text-blue-700">{Number(result.roots.x1).toFixed(2)}</span>
                   </div>
                   <div className="h-8 w-px bg-blue-200 mx-4"></div>
                   <div className="flex flex-col items-end">
                     <span className="text-xs text-blue-500 font-bold uppercase">X₂</span>
                     <span className="text-2xl font-bold text-blue-700">{Number(result.roots.x2).toFixed(2)}</span>
                   </div>
                 </div>
               )}
               {result.roots.type === 'double' && (
                 <div className="text-center">
                   <span className="text-xs text-blue-500 font-bold uppercase">Solución Doble</span>
                   <div className="text-3xl font-bold text-blue-700">{Number(result.roots.x1).toFixed(2)}</div>
                 </div>
               )}
               {result.roots.type === 'complex' && (
                 <div className="text-center text-gray-600 font-medium">
                   No tiene soluciones reales
                 </div>
               )}
            </div>

            <div className="flex justify-between items-center pt-2">
               <span className="text-sm text-gray-500">Vértice:</span>
               <Badge>({Number(result.vertex.x).toFixed(2)}, {Number(result.vertex.y).toFixed(2)})</Badge>
            </div>
          </div>
        </Card>

        {/* Graph Card */}
        <Card className="md:col-span-2 h-[400px]" title="Gráfica de la Función">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="x" type="number" domain={['auto', 'auto']} allowDataOverflow tick={{fontSize: 12}} />
              <YAxis domain={['auto', 'auto']} allowDataOverflow tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: '#0071e3', fontWeight: 600 }}
                labelStyle={{ color: '#666' }}
              />
              <ReferenceLine y={0} stroke="#000" strokeOpacity={0.2} />
              <ReferenceLine x={0} stroke="#000" strokeOpacity={0.2} />
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#0071e3" 
                strokeWidth={3} 
                dot={false}
                animationDuration={1000}
              />
              {/* Highlight Roots */}
              {result.roots.type !== 'complex' && (
                <ReferenceLine x={result.roots.x1 || 0} stroke="#ef4444" strokeDasharray="3 3" />
              )}
               {result.roots.type === 'real' && (
                <ReferenceLine x={result.roots.x2 || 0} stroke="#ef4444" strokeDasharray="3 3" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};