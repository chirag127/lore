import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const MDX = 'C:\\AM\\GitHub\\BookAtlas\\mdx';

function getBooks(subPath) {
  const books = [];
  try {
    for (const d of readdirSync(subPath, { withFileTypes: true }).filter(d => d.isDirectory())) {
      const mp = join(subPath, d.name, 'meta.json');
      if (existsSync(mp)) {
        try {
          const meta = JSON.parse(readFileSync(mp, 'utf-8'));
          books.push({ dir: d.name, title: meta.title || d.name, slug: meta.slug || d.name });
        } catch { books.push({ dir: d.name, title: d.name, slug: d.name }); }
      }
    }
  } catch {}
  return books;
}

function toTitle(s) {
  const t = s.replace(/^\d+-/, '').replace(/[-_]/g, ' ');
  return t.replace(/\b\w/g, c => c.toUpperCase());
}

function toSlug(s) { return s.replace(/^\d+-/, '').replace(/[^a-z0-9-]/g, ''); }

function extractCatNum(name) { const m = name.match(/^(\d+)/); return m ? parseInt(m[1]) : 99; }

const catDescriptions = {
  'body-health-and-life-sciences': 'How the human body works - from cellular mechanisms and organ systems to nutrition, fitness, sleep, medicine, and public health. This category covers the biological sciences that explain our physical existence.',
  'money-markets-and-wealth': 'The principles of finance and investing - from personal wealth building and behavioral finance to value investing, risk management, quantitative trading, and market history.',
  'computers-ai-and-software': 'The art and science of software engineering - from programming fundamentals and system design to artificial intelligence, machine learning, cybersecurity, and technical leadership.',
  'business-strategy-and-organizations': 'How organizations are built, led, and grown - from entrepreneurship and corporate strategy to marketing, operations, negotiation, and organizational culture.',
  'philosophy-religion-and-indian-thought': 'The great questions of existence - from ancient Greek philosophy and Eastern meditation to ethics, epistemology, comparative religion, and Indian philosophical traditions.',
  'mathematics-logic-and-science': 'The foundational sciences - from pure mathematics and statistics to physics, chemistry, biology, ecology, and the scientific method itself.',
  'society-history-and-power': 'How human civilizations are organized - from sociology and political science to geopolitics, media studies, urban planning, history, and military strategy.',
  'communication-writing-and-creativity': 'The tools of human expression - from writing craft and storytelling to rhetoric, public speaking, design, photography, music, and visual arts.',
  'fiction-and-literature': 'The imaginative worlds of narrative - from science fiction and fantasy to historical fiction, mystery, poetry, short stories, and literary criticism.',
  'reference-and-general-knowledge': 'The essential reference works - from encyclopedias and dictionaries to atlases, biographical references, fact books, and general knowledge handbooks.'
};

function genCatIndex(catName, catNum) {
  const display = toTitle(catName);
  const cleanName = catName.replace(/^\d+-/, '');
  const desc = catDescriptions[cleanName] || `A comprehensive collection of books about ${display.toLowerCase()}.`;
  const subs = readdirSync(join(MDX, catName), { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

  let subRows = '';
  for (const [i, sub] of subs.entries()) {
    const bCount = getBooks(join(MDX, catName, sub)).length;
    subRows += `| ${i+1} | ${toTitle(sub)} | ${bCount} | See subcategory |\n`;
  }

  const frontmatter = `---
title: "${String(catNum).padStart(2, '0')} - ${display}"
slug: "${catName}"
position: ${catNum}
description: "${desc}"
---`;

  const body = `# ${String(catNum).padStart(2, '0')} - ${display}

${desc}

## Scope

This category covers books on the fundamental principles and practices of ${display.toLowerCase()}, including its subdisciplines, history, and modern applications.

## What Belongs Here

Books that provide foundational knowledge, practical skills, and deep understanding of ${display.toLowerCase()} - from introductory overviews to advanced specialized works.

## What Does NOT Belong Here

Books that primarily belong in other categories are not included here, even if they touch on related topics. Each book is placed in the category that best represents its core subject matter.

## Reading Path

| Phase | Subcategories | Purpose |
|-------|--------------|---------|
${subs.slice(0, Math.min(3, Math.ceil(subs.length/3))).map((s, i) => `| **${['Foundation','Application','Mastery'][i] || 'Further Reading'}** | ${subs.slice(i*Math.ceil(subs.length/3), (i+1)*Math.ceil(subs.length/3)).map(toTitle).join(', ')} | Progressive learning path |`).join('\n')}

## Subcategories

| # | Subcategory | Books | Focus |
|---|-------------|-------|-------|
${subRows}`;

  return `${frontmatter}\n\n${body}\n`;
}

function genSubIndex(catName, subName, books) {
  const display = toTitle(subName);
  const cleanSub = subName.replace(/^\d+-/, '');
  const catDisplay = toTitle(catName);
  
  const desc = `A curated selection of books on ${display.toLowerCase()}, covering essential concepts, practical applications, and advanced topics within ${catDisplay.toLowerCase()}.`;

  const readingOrder = books.map((b, i) => `${i + 1}. **${b.title}** - ${b.slug.replace(/-/g, ' ')}`).join('\n');

  const frontmatter = `---
title: "${display}"
slug: "${toSlug(subName)}"
order: ${extractCatNum(subName)}
description: "${desc}"
---`;

  const body = `## Overview

${display} is a key subcategory within ${catDisplay}. This shelf brings together the essential books that define, explain, and advance our understanding of this field.

## What's In This Shelf

This shelf contains books that address:

- Core concepts and foundational knowledge
- Practical applications and methodologies
- Advanced topics and emerging research
- Critical analysis and historical context
- Integration with other domains

## What's Not In This Shelf

Books that focus on specialized subtopics beyond the scope of this shelf are placed in their respective subcategories. The focus here is on the essential works that every student of ${display.toLowerCase()} should know.

## Reading Order

${readingOrder || 'No books currently assigned to this shelf.'}

## Contribution to the Knowledge Tree

This shelf contributes to the broader ${catDisplay.toLowerCase()} category by providing a structured path through its most important ideas. Understanding the books here builds a strong foundation for further exploration across related subcategories.`;

  return `${frontmatter}\n\n${body}\n`;
}

// --- Main execution ---
const cats = readdirSync(MDX, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

let created = { cat: 0, sub: 0 };

for (const cat of cats) {
  const catNum = extractCatNum(cat);
  const catPath = join(MDX, cat);
  const catIndex = join(catPath, '00-index.mdx');

  if (!existsSync(catIndex)) {
    writeFileSync(catIndex, genCatIndex(cat, catNum));
    created.cat++;
    console.log(`Created: ${cat}/00-index.mdx`);
  }

  for (const sub of readdirSync(catPath, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name)) {
    const subPath = join(catPath, sub);
    const subIndex = join(subPath, '00-index.mdx');

    // Check for existing index (custom named or standard)
    const hasStandard = existsSync(subIndex);
    if (hasStandard) continue;

    const books = getBooks(subPath);
    writeFileSync(subIndex, genSubIndex(cat, sub, books));
    created.sub++;
    console.log(`  Created: ${sub}/00-index.mdx (${books.length} books)`);
  }
}

console.log(`\nDone! Created ${created.cat} category and ${created.sub} subcategory index files.`);
