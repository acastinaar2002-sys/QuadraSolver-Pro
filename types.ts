export interface QuadraticParams {
  a: number;
  b: number;
  c: number;
}

export interface QuadraticResult {
  roots: { x1: number | null; x2: number | null; type: 'real' | 'complex' | 'double' | 'none' };
  vertex: { x: number; y: number };
  discriminant: number;
  equationType: 'complete' | 'incomplete-b' | 'incomplete-c' | 'linear';
}

export interface GraphPoint {
  x: number;
  y: number;
}

declare global {
  interface Window {
    jspdf: any;
  }
}

// Ensure process.env is typed correctly for the client-side code
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      [key: string]: string | undefined;
    }
  }
}

export {};