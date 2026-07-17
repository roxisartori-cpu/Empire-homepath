// scripts/check-program-links.js
//
// Checks every program's official_url in src/data/programs.json to confirm
// it still returns a valid page (not a 404, not a server error, not a
// domain that's stopped resolving).
//
// This does NOT check whether the page's *content* still matches what our
// data claims (e.g., income limits, county eligibility) — that requires a
// human to actually read the page. This only catches dead/broken links.
//
// Usage: node scripts/check-program-links.js
// Exits with code 1 if any link is broken, so this can gate a CI job.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRAMS_PATH = path.join(__dirname, '..', 'src', 'data', 'programs.json');

async function checkUrl(url) {
  if (!url || !url.startsWith('http')) {
    return { skipped: true };
  }

  try {
    const coroller = new AbortController();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    if (res.status === 403) {
      return { inconclusive: true, status: res.status };
    }

    return { ok: res.ok, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  const programs = JSON.parse(fs.readFileSync(PROGRAMS_PATH, 'utf-8'));

  const results = [];
  for (const program of programs) {
    const url = program.official_url;
    const result = await checkUrl(url);
    results.push({ name: program.program_name, url, ...result });
  }

  const broken = results.filter((r) => !r.skipped && !r.inconclusive && !r.ok);
  const inconclusive = results.filter((r) => r.inconclusive);
  const skipped = results.filter((r) => r.skipped);
  const ok = results.filter((r) => !r.skipped && !r.inconclusive && r.ok);

  console.log(`\nChecked ${results.length} programs:`);
  console.log(`  ${ok.length} confirmed OK`);
  console.log(`  ${inconclusive.length} inconclusive (blocked by bot-protection, not necessarily broken)`);
  console.log(`  ${skipped.length} skipped (not a real URL)`);
  console.log(`  ${broken.length} CONFIRMED BROKEN\n`);

  if (inconclusive.length > 0) {
    console.log('INCONCLUSIVE (got HTTP 403 — likely bot-protection, not proof the link is dead):');
    for (const i of inconclusive) {
      console.log(`  - ${i.name}: ${i.url}`);
  }
    console.log('');
  }

  if (broken.length > 0) {
    console.log('CONFIRMED BROKEN LINKS (these need real attention):');
    for (const b of broken) {
      console.log(`  - ${b.name}`);
      console.log(`    URL: ${b.url}`);
      console.log(`    ${b.status ? `HTTP ${b.status}` : b.error}`);
    }
    console.log('');
    process.exit(1);
  }

  console.log('No confirmed-broken links. (Inconclusive results above are worth a periodic manual glance, but are not failures.)');
  process.exit(0);
}

main();
