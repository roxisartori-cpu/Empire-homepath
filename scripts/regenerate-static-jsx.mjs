import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { buildStaticPageComponent } from './static-page-codegen.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src', 'pages', 'static');

const pages = [
  { module: 'homePage.js', component: 'HomePage', out: 'HomePage.jsx' },
  { module: 'demoPage.js', component: 'DemoPage', out: 'DemoPage.jsx' },
  { module: 'searchPage.js', component: 'SearchPage', out: 'SearchPage.jsx' },
  { module: 'privacyPage.js', component: 'PrivacyPage', out: 'PrivacyPage.jsx' },
  { module: 'termsPage.js', component: 'TermsPage', out: 'TermsPage.jsx' },
  { module: 'disclaimerPage.js', component: 'DisclaimerPage', out: 'DisclaimerPage.jsx' },
];

for (const pageDef of pages) {
  const modulePath = path.join(srcDir, pageDef.module);
  const mod = await import(`${pathToFileURL(modulePath).href}?v=${Date.now()}`);
  const page = mod.default ?? mod;
  const content = buildStaticPageComponent({ component: pageDef.component, page });
  fs.writeFileSync(path.join(srcDir, pageDef.out), content);
  console.log(`Wrote ${pageDef.out} (${(content.length / 1024).toFixed(1)} KB)`);
}
