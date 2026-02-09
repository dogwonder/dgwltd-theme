// src/11ty/_data/lighthouseHistory.js
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_FILE = path.resolve(__dirname, '../../../lighthouse-history.jsonl');

const THRESHOLDS = {
  performance: 90,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
};

export default async function () {
  let raw;
  try {
    raw = await readFile(HISTORY_FILE, 'utf-8');
  } catch {
    return { hasData: false, runs: [], latest: {}, previous: {}, pages: [], thresholds: THRESHOLDS };
  }

  const runs = raw
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (runs.length === 0) {
    return { hasData: false, runs: [], latest: {}, previous: {}, pages: [], thresholds: THRESHOLDS };
  }

  // Latest run per page
  const latest = {};
  for (const run of runs) {
    if (!latest[run.page]) {
      latest[run.page] = run;
    }
  }

  // Previous run per page (for trend comparison)
  const previous = {};
  const seen = {};
  for (const run of runs) {
    if (!seen[run.page]) {
      seen[run.page] = true;
    } else if (!previous[run.page]) {
      previous[run.page] = run;
    }
  }

  const pages = [...new Set(runs.map((r) => r.page))];

  return { hasData: true, runs, latest, previous, pages, thresholds: THRESHOLDS };
}
