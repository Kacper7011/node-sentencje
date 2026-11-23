import { readFileSync } from 'node:fs';
import express from 'express';

const PORT = 3000;
const app = express();
app.use(express.static('public'));

const sentencje = JSON.parse(
  readFileSync(new URL('./dane/sentencje.json', import.meta.url), 'utf8'),
);

app.use((req, res, next) => {
  console.log(`2. serwer: odebrano żądanie ${req.method} ${req.path}`);
  res.on('finish', () => {
    console.log(`3. serwer: wysłano odpowiedź, status ${res.statusCode}`);
  });
  next();
});

app.get('/api/powitanie', (req, res) => {
  res.send('Witaj z Expressa!');
});

app.get('/api/sentencje', (req, res) => {
  res.json(sentencje);
});

app.get('/api/sentencje/:indeks', (req, res) => {
  const { indeks } = req.params;
  const numer = Number(indeks);

  if (!/^\d+$/.test(indeks) || numer >= sentencje.length) {
    return res.status(404).send('Nie znaleziono sentencji.');
  }

  res.json(sentencje[numer]);
});

app.use((req, res) => {
  res.status(404).send('Nie znaleziono strony.');
});

const server = app.listen(PORT);
server.on('listening', () => {
  console.log(`Serwer działa: http://localhost:${PORT}/test.html`);
});
