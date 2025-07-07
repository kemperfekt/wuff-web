import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Endpoint to serve runtime configuration
app.get('/config', (req, res) => {
  res.json({
    apiUrl: process.env.VITE_API_URL || 'http://localhost:8000'
  });
});

// Handle client-side routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WuffChat UI running on port ${PORT}`);
  console.log(`Express server started successfully`);
  console.log(`Serving static files from: ${path.join(__dirname, 'dist')}`);
});