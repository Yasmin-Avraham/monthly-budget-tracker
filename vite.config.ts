import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/monthly-budget-tracker/',
  plugins: [react()],
});
