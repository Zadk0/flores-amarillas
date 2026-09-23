import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Servir la carpeta dist compilada
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Servir carpeta public para archivos standalone o assets
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Fallback SPA: Cualquier ruta que no coincida con un archivo estático devuelve dist/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor iniciado y escuchando en el puerto ${PORT}`);
});
