import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// 1. API endpoint
// This must come before the static middleware and the wildcard.
app.get('/config', (req, res) => {
  res.json({
    apiUrl: process.env.VITE_API_URL || 'http://localhost:8000'
  });
});

// 2. Static assets
// Serve files from the 'dist' directory (our build output).
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Wildcard fallback for client-side routing
// This must be the last route. It sends index.html for any request
// that didn't match an API endpoint or a static file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WuffChat UI running on port ${PORT}`);
  console.log(`Express server started successfully`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
});
