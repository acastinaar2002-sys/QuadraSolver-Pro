import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using (process as any).cwd() to avoid TS errors in some environments
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Stringify the API key to inject it into the client code safely
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});