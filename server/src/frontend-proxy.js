import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const clientDist = process.env.CLIENT_DIST || path.join(__dirname, '..', 'client', 'dist');
const API_PORT = process.env.API_PORT || 5000;

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return createProxyMiddleware({
      target: `http://127.0.0.1:${API_PORT}`,
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' }
    })(req, res, next);
  }
  next();
});

app.use(express.static(clientDist));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  } else {
    next();
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend proxy on port ${PORT}, API proxied to ${API_PORT}`);
});