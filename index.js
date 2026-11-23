import { readFile } from 'node:fs/promises';
import express from 'express';
import { sledzenie } from './lib/siedzenie.js';

const PORT = 3000;
const app = express();
app.use(express.static('public'));
app.use(sledzenie);

async function wczytajSentencje() {
  const tekst = await readFile(new URL('./dane/sentencje.json', import.meta.url), 'utf8');
  return JSON.parse(tekst);
}

app.get('/api/powitanie', (req, res) => {
  res.send('Witaj z Expressa!');
});

app.get('/api/sentencje', async (req, res) => {
  const sentencje = await wczytajSentencje();
  res.json(sentencje);
});

app.get('/api/sentencje/:numer', async (req, res) => {
  const sentencje = await wczytajSentencje();
  const { numer } = req.params;
  const tekst = /^\d+$/.test(numer) ? sentencje[Number(numer)] : undefined;

  if (tekst === undefined) {
    res.status(404).json({ blad: 'Nie ma sentencji o takim numerze' });
    return;
  }

  res.json({ tekst });
});

app.use((req, res) => {
  res.status(404).send('Nie znaleziono strony.');
});

const server = app.listen(PORT);
server.on('listening', () => {
  console.log(`Serwer działa: http://localhost:${PORT}/test.html`);
});
