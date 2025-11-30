import { QuadraticParams, QuadraticResult, GraphPoint } from '../types';

export const solveQuadratic = ({ a, b, c }: QuadraticParams): QuadraticResult => {
  if (a === 0) {
    // Linear equation: bx + c = 0 => x = -c/b
    return {
      roots: { x1: -c / b, x2: null, type: 'real' },
      vertex: { x: 0, y: c }, // Not strictly a parabola vertex, but y-intercept
      discriminant: 0,
      equationType: 'linear',
    };
  }

  const discriminant = b * b - 4 * a * c;
  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  let roots: QuadraticResult['roots'] = { x1: null, x2: null, type: 'none' };

  if (discriminant > 0) {
    const sqrtDelta = Math.sqrt(discriminant);
    roots = {
      x1: (-b + sqrtDelta) / (2 * a),
      x2: (-b - sqrtDelta) / (2 * a),
      type: 'real',
    };
  } else if (discriminant === 0) {
    roots = {
      x1: -b / (2 * a),
      x2: -b / (2 * a),
      type: 'double',
    };
  } else {
    roots = {
      x1: null,
      x2: null,
      type: 'complex',
    };
  }

  let equationType: QuadraticResult['equationType'] = 'complete';
  if (b === 0) equationType = 'incomplete-b';
  else if (c === 0) equationType = 'incomplete-c';

  return {
    roots,
    vertex: { x: vertexX, y: vertexY },
    discriminant,
    equationType,
  };
};

export const generateGraphData = ({ a, b, c }: QuadraticParams, range = 10): GraphPoint[] => {
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const start = Math.floor(vertexX - range);
  const end = Math.ceil(vertexX + range);
  const data: GraphPoint[] = [];

  // Create smooth curve points
  for (let x = start; x <= end; x += 0.5) {
    data.push({
      x: Number(x.toFixed(1)),
      y: Number((a * x * x + b * x + c).toFixed(2)),
    });
  }
  return data;
};

export const formatEquation = ({ a, b, c }: QuadraticParams): string => {
  const formatTerm = (coef: number, variable: string, isFirst: boolean) => {
    if (coef === 0) return '';
    const sign = coef > 0 ? (isFirst ? '' : ' + ') : ' - ';
    const absCoef = Math.abs(coef);
    const value = absCoef === 1 && variable ? '' : absCoef;
    return `${sign}${value}${variable}`;
  };

  const aTerm = formatTerm(a, 'x²', true);
  const bTerm = formatTerm(b, 'x', a === 0);
  const cTerm = c !== 0 ? (c > 0 ? ` + ${c}` : ` - ${Math.abs(c)}`) : '';
  
  // Handle case where everything is 0
  if (!aTerm && !bTerm && !cTerm) return '0 = 0';

  return `${aTerm}${bTerm}${cTerm} = 0`;
};