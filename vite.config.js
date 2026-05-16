import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Garante que o Vite vai usar a pasta "public" que está na raiz do seu projeto atual
  publicDir: path.resolve(__dirname, 'public'), 

  server: {
    fs: {
      // Permite que o navegador acesse os arquivos de dados locais sem bloqueio de segurança
      strict: false
    }
  },

  // 🛠️ Faz o Vite entregar o arquivo Parquet inteiro para o DuckDB sem corromper os bytes
  assetsInclude: ['**/*.parquet']
});