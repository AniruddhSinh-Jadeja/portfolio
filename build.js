/**
 * build.js — inlines section HTML into index.html for SEO
 *
 * Why: sections are loaded via fetch() at runtime, so crawlers and
 * SEO tools see an empty shell. This script replaces the placeholders
 * in index.html with the actual section markup so the deployed HTML
 * is fully indexable. Idempotent — safe to re-run.
 *
 * Usage:  npm run build
 */

const fs   = require('fs');
const path = require('path');

const ROOT     = __dirname;
const INDEX    = path.join(ROOT, 'index.html');
const SECTIONS = ['hero', 'about', 'stack', 'projects', 'experience', 'contact'];

const START_MARKER = '<!-- BUILD:SECTIONS:START -->';
const END_MARKER   = '<!-- BUILD:SECTIONS:END -->';

function indent(text, spaces) {
  const pad = ' '.repeat(spaces);
  return text.split('\n').map(line => line.length ? pad + line : line).join('\n');
}

function main() {
  let html = fs.readFileSync(INDEX, 'utf8');

  const startIdx = html.indexOf(START_MARKER);
  const endIdx   = html.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.error(`✗ Could not find build markers in index.html`);
    console.error(`  Expected:  ${START_MARKER}  …  ${END_MARKER}`);
    process.exit(1);
  }

  const inlined = SECTIONS.map(name => {
    const file = path.join(ROOT, 'sections', `${name}.html`);
    if (!fs.existsSync(file)) {
      console.warn(`⚠ Skipping missing section: ${name}.html`);
      return '';
    }
    const raw = fs.readFileSync(file, 'utf8').trim();
    return `<!-- @section:${name} -->\n${indent(raw, 4)}`;
  }).filter(Boolean).join('\n\n');

  const before = html.slice(0, startIdx + START_MARKER.length);
  const after  = html.slice(endIdx);

  const next = `${before}\n${indent(inlined, 4)}\n    ${after}`;

  fs.writeFileSync(INDEX, next);
  const kb = (Buffer.byteLength(next, 'utf8') / 1024).toFixed(1);
  console.log(`✓ Inlined ${SECTIONS.length} sections into index.html  (${kb} KB)`);
}

main();
