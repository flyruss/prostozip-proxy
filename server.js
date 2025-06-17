import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api/')) return next();

  const target = 'https://auc.pakdv.ru' + req.originalUrl.replace('/api', '');

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'kupi-moto-proxy'
      }
    });
    const body = await upstream.text();
    res.status(upstream.status).send(body);
  } catch (e) {
    res.status(502).json({ error: 'Ошибка при проксировании', details: e.message });
  }
});

app.get('/', (req, res) => {
  res.send('Proxy работает 💪');
});

app.listen(PORT, () => console.log(`🚀 Proxy запущен на порту ${PORT}`));
