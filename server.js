import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '10000', 10);
const HOST = '0.0.0.0';

// Health check endpoints for Render Web Service monitoring
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'GovFlow AI Web Service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Security and compression headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve static assets from Vite production build (dist directory)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
}));

// SPA Catch-All: Send index.html for any unhandled route to support React Router
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.log(`=============================================`);
  console.log(`🏛️ GovFlow AI Web Service Started`);
  console.log(`🌐 Listening on http://${HOST}:${PORT}`);
  console.log(`✅ Health check at http://${HOST}:${PORT}/healthz`);
  console.log(`=============================================`);
});

// Handle graceful termination
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
