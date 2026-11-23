import { readFile } from 'node:fs/promises';
import express from 'express';

async function wczytajSentencje() {
  const tekst = await readFile(new URL('../dane/sentencje.json', import.meta.url), 'utf8');
  return JSON.parse(tekst);
}

const trasy = express.Router();

trasy.get('/api/powitanie', (req, res) => {
  res.send('Witaj z Expressa!');
});

trasy.get('/api/sentencje', async (req, res) => {
  const sentencje = await wczytajSentencje();
  res.json(sentencje);
});

trasy.get('/api/sentencje/:numer', async (req, res) => {
  const sentencje = await wczytajSentencje();
  const { numer } = req.params;
  const tekst = /^\d+$/.test(numer) ? sentencje[Number(numer)] : undefined;

  if (tekst === undefined) {
    res.status(404).json({ blad: 'Nie ma sentencji o takim numerze' });
    return;
  }

  res.json({ tekst });
});

trasy.get('/api/losowa', async (req, res) => {
  const sentencje = await wczytajSentencje();
  const numer = Math.floor(Math.random() * sentencje.length);
  res.json({ numer, tekst: sentencje[numer] });
});

export default trasy;
