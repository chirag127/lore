import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const MDX = join(dirname(fileURLToPath(import.meta.url)), '..', 'mdx');

function getBooks(subPath) {
  const books = [];
  try {
    for (const d of readdirSync(subPath, { withFileTypes: true }).filter(d => d.isDirectory())) {
      const mp = join(subPath, d.name, 'meta.json');
      if (existsSync(mp)) {
        try {
          const meta = JSON.parse(readFileSync(mp, 'utf-8'));
          books.push({ dir: d.name, title: meta.title || d.name, slug: meta.slug || d.name });
        } catch {
          books.push({ dir: d.name, title: d.name, slug: d.name });
        }
      }
    }
  } catch {}
  return books;
}

function toTitle(s) {
  const cleaned = s.replace(/^\d+-/, '').replace(/[-_]/g, ' ');
  return cleaned.replace(/\b\w/g, c => (['ai', 'eq', 'ui', 'ux', 'api', 'seo', 'devops'].includes(c.toLowerCase() + (c.match(/\w*/)?.[0] || '').slice(1).toLowerCase()) ? c.toUpperCase() : c.toUpperCase()));
}

function toSlug(s) {
  return s.replace(/^\d+-/, '').replace(/[^a-z0-9-]/g, '');
}

function extractOrder(name) {
  const m = name.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : 99;
}

function safeDescription(text) {
  return text.replace(/"/g, "'");
}

function genTopIndex(catPath, catName) {
  const display = toTitle(catName);
  const subs = readdirSync(catPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => extractOrder(a.name) - extractOrder(b.name))
    .map(d => d.name);
  const rows = subs.map((sub, i) => {
    const subPath = join(catPath, sub);
    const leaves = readdirSync(subPath, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
    const books = leaves.flatMap(leaf => getBooks(join(subPath, leaf)));
    return `| ${String(i + 1).padStart(2, '0')} | [${toTitle(sub)}](/categories/${toSlug(catName)}/${toSlug(sub)}) | ${leaves.length} | ${books.length} |`;
  }).join('\n');
  const totalBooks = subs.flatMap(sub => readdirSync(join(catPath, sub), { withFileTypes: true }).filter(d => d.isDirectory()).flatMap(leaf => getBooks(join(catPath, sub, leaf.name)))).length;
  const totalLeaves = subs.flatMap(sub => readdirSync(join(catPath, sub), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)).length;

  return `---
title: "${display}"
slug: "${toSlug(catName)}"
position: ${extractOrder(catName)}
description: "A three-level BookAtlas category for ${display.toLowerCase()}."
---

# ${display}

This category uses the BookAtlas three-level structure: category, subcategory, and topic leaf.

## Shelf Map

| # | Subcategory | Leaf categories | Books |
|---|-------------|-----------------|-------|
${rows}

**Total: ${totalBooks} books across ${subs.length} subcategories and ${totalLeaves} leaf categories.**
`;
}

function genSubIndex(catPath, catName, subName) {
  const display = toTitle(subName);
  const subPath = join(catPath, subName);
  const leaves = readdirSync(subPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => extractOrder(a.name) - extractOrder(b.name))
    .map(d => d.name);
  const rows = leaves.map((leaf, i) => `| ${String(i + 1).padStart(2, '0')} | [${toTitle(leaf)}](/categories/${toSlug(catName)}/${toSlug(subName)}/${toSlug(leaf)}) | ${getBooks(join(subPath, leaf)).length} |`).join('\n');
  const totalBooks = leaves.flatMap(leaf => getBooks(join(subPath, leaf))).length;

  return `---
title: "${display}"
slug: "${toSlug(subName)}"
order: ${extractOrder(subName)}
description: "Books on ${display.toLowerCase()}."
---

# ${display}

This subcategory is organized into focused topic leaves.

## Leaf Categories

| # | Leaf category | Books |
|---|---------------|-------|
${rows}

**Total: ${totalBooks} books across ${leaves.length} leaf categories.**
`;
}

function genLeafIndex(catPath, catName, subName, leafName) {
  const display = toTitle(leafName);
  const books = getBooks(join(catPath, subName, leafName)).sort((a, b) => a.title.localeCompare(b.title));
  const rows = books.map((book, i) => `| ${String(i + 1).padStart(2, '0')} | [${book.title}](/books/${book.slug}) |`).join('\n');

  return `---
title: "${display}"
slug: "${toSlug(leafName)}"
order: ${extractOrder(leafName)}
description: "Books on ${display.toLowerCase()}."
---

# ${display}

## Books

| # | Book |
|---|------|
${rows || '| - | No books assigned yet. |'}

**Total: ${books.length} books.**
`;
}

const cats = readdirSync(MDX, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .sort((a, b) => extractOrder(a.name) - extractOrder(b.name))
  .map(d => d.name);

let created = { top: 0, sub: 0, leaf: 0 };

for (const cat of cats) {
  const catPath = join(MDX, cat);
  const topIndex = join(catPath, '00-index.mdx');
  writeFileSync(topIndex, genTopIndex(catPath, cat));
  created.top++;

  const subs = readdirSync(catPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .sort((a, b) => extractOrder(a.name) - extractOrder(b.name))
    .map(d => d.name);

  for (const sub of subs) {
    const subPath = join(catPath, sub);
    const subIndex = join(subPath, '00-index.mdx');
    writeFileSync(subIndex, genSubIndex(catPath, cat, sub));
    created.sub++;

    const leaves = readdirSync(subPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .sort((a, b) => extractOrder(a.name) - extractOrder(b.name))
      .map(d => d.name);

    for (const leaf of leaves) {
      const leafIndex = join(subPath, leaf, '00-index.mdx');
      writeFileSync(leafIndex, genLeafIndex(catPath, cat, sub, leaf));
      created.leaf++;
    }
  }
}

console.log(`Done! Wrote ${created.top} category, ${created.sub} subcategory, and ${created.leaf} leaf index files.`);
