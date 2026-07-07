import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src', 'pages', 'static');
const htmlDir = process.argv[2] || '/tmp/empire-html';

const pages = [
  { file: 'empirehomepath-v8.html', exportName: 'homePage', out: 'homePage.js' },
  { file: 'empirehomepath-demo.html', exportName: 'demoPage', out: 'demoPage.js' },
  { file: 'empirehomepath-search.html', exportName: 'searchPage', out: 'searchPage.js' },
  { file: 'empirehomepath-privacy.html', exportName: 'privacyPage', out: 'privacyPage.js' },
  { file: 'empirehomepath-terms.html', exportName: 'termsPage', out: 'termsPage.js' },
  { file: 'empirehomepath-disclaimer.html', exportName: 'disclaimerPage', out: 'disclaimerPage.js' },
];

function transformLinks(content) {
  return content
    .replace(/href="index\.html#([^"]+)"/g, 'href="/#$1"')
    .replace(/href='index\.html#([^']+)'/g, "href='/#$1'")
    .replace(/href="index\.html"/g, 'href="/"')
    .replace(/href='index\.html'/g, "href='/'")
    .replace(/window\.location='index\.html#pricing'/g, "window.location='/#pricing'")
    .replace(/window\.location="index\.html#pricing"/g, 'window.location="/#pricing"')
    .replace(/empirehomepath-demo\.html/g, '/demo')
    .replace(/empirehomepath-search\.html/g, '/search')
    .replace(/empirehomepath-privacy\.html/g, '/privacy')
    .replace(/empirehomepath-terms\.html/g, '/terms')
    .replace(/empirehomepath-disclaimer\.html/g, '/disclaimer');
}

function parseHtml(htmlPath) {
  const raw = fs.readFileSync(htmlPath, 'utf8');
  const titleMatch = raw.match(/<title>([^<]*)<\/title>/i);
  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);

  if (!bodyMatch) throw new Error(`Missing body in ${htmlPath}`);

  let body = bodyMatch[1].trim();
  const scriptMatch = body.match(/<script>([\s\S]*?)<\/script>\s*$/i);
  let scripts = '';
  if (scriptMatch) {
    scripts = scriptMatch[1].trim();
    body = body.slice(0, scriptMatch.index).trim();
  }

  return {
    title: titleMatch ? titleMatch[1].trim() : 'Empire HomePath',
    css: transformLinks(styleMatch ? styleMatch[1].trim() : ''),
    html: transformLinks(body),
    scripts: transformLinks(scripts),
  };
}

function escapeForTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

fs.mkdirSync(srcDir, { recursive: true });

for (const page of pages) {
  const parsed = parseHtml(path.join(htmlDir, page.file));
  const content = `const ${page.exportName} = {
  title: ${JSON.stringify(parsed.title)},
  css: \`${escapeForTemplate(parsed.css)}\`,
  html: \`${escapeForTemplate(parsed.html)}\`,
  scripts: \`${escapeForTemplate(parsed.scripts)}\`,
};

export default ${page.exportName};
`;

  fs.writeFileSync(path.join(srcDir, page.out), content);
  console.log(`Wrote ${page.out} (${(content.length / 1024).toFixed(1)} KB)`);
}
