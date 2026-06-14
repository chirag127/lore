import { readFileSync, writeFileSync, readdirSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';

const MDX_DIR = join(import.meta.dirname, '..', 'mdx');

function getDirs(parent) {
  try { return readdirSync(parent, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); }
  catch { return []; }
}

function getFiles(dir) {
  try { return readdirSync(dir, { withFileTypes: true }).filter(d => d.isFile()).map(d => d.name); }
  catch { return []; }
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('---', 3);
  if (end === -1) return null;
  const fm = content.slice(3, end).trim();
  const body = content.slice(end + 3).trim();
  const data = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)/);
    if (m) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d+$/.test(val)) val = parseInt(val);
      data[m[1]] = val;
    }
  }
  return { data, body };
}

let stats = { metaCreated: 0, frontmatterStripped: 0, filesRenamed: 0, subcategoryIndexesRenamed: 0 };

function stripFrontmatter(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const parsed = parseFrontmatter(content);
  if (!parsed) return null;
  writeFileSync(filePath, parsed.body + '\n', 'utf-8');
  stats.frontmatterStripped++;
  return parsed.data;
}

function processBookDir(bookPath, bookName, parentCat, parentSub) {
  let files = getFiles(bookPath);
  const hasMeta = files.includes('meta.json');
  const index00 = files.includes('00-index.mdx');
  const index01 = files.includes('01-index.mdx');

  // Rename 00-index.mdx to 01-index.mdx at book level (BEFORE stripping)
  if (index00 && !index01) {
    try {
      renameSync(join(bookPath, '00-index.mdx'), join(bookPath, '01-index.mdx'));
      stats.filesRenamed++;
      files = getFiles(bookPath); // re-read after rename
    } catch (e) { console.error(`  Rename failed: ${bookName}/00-index.mdx -> 01-index.mdx`, e.message); }
  }

  // Strip frontmatter from book-level MDX files
  for (const f of files) {
    if (f.endsWith('.mdx')) {
      stripFrontmatter(join(bookPath, f));
    }
  }

  // Create meta.json if missing
  if (!hasMeta) {
    const idxPath = join(bookPath, '01-index.mdx');
    const contentPath = join(bookPath, '02-content.mdx');
    const analysisPath = join(bookPath, '03-analysis.mdx');

    let title = bookName.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    let author = '';
    let year = '';
    let excerpt = '';

    // Try to extract from 01-index.mdx content
    if (existsSync(idxPath)) {
      const content = readFileSync(idxPath, 'utf-8');
      const lines = content.split('\n').slice(0, 20);
      for (const line of lines) {
        const titleMatch = line.match(/\*{1,2}(.+?)\*{1,2}\s*\((\d{4})/);
        if (titleMatch) { title = titleMatch[1]; year = parseInt(titleMatch[2]); }
        else {
          const parenMatch = line.match(/\*([^*]+)\*\s*\((\d{4})/);
          if (parenMatch && !author) { title = parenMatch[1]; year = parseInt(parenMatch[2]); }
        }
        const authorMatch = line.match(/by\s+(.+?)(?:[,.]|$)/i);
        if (authorMatch) author = authorMatch[1].trim();
      }
      excerpt = content.split('\n\n').filter(p => p.trim().length > 40)[0] || content.slice(0, 200);
      if (excerpt) excerpt = excerpt.replace(/^#+\s*/, '').trim().slice(0, 300);
    }

    const slug = bookName.replace(/^\d+-/, '').replace(/[^a-z0-9-]/g, '');

    const meta = {
      slug,
      title,
      author: author || undefined,
      year: year || undefined,
      publicationYear: year || undefined,
      language: 'en',
      difficulty: 'medium',
      excerpt: excerpt || `A comprehensive exploration of ${title.toLowerCase()}.`,
      category: parentCat?.replace(/^\d+-/, '').replace(/-/g, ' ') || '',
      subcategory: parentSub?.replace(/^\d+-/, '').replace(/-/g, ' ') || '',
      addedAt: Date.now(),
      tags: [parentSub?.replace(/^\d+-/, '').replace(/-/g, '-') || ''],
      genres: [],
      whoShouldRead: [],
      whoShouldSkip: [],
      keyIdeas: [],
      keyTakeaways: [],
      relatedBooks: [],
    };

    try {
      writeFileSync(join(bookPath, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf-8');
      stats.metaCreated++;
      console.log(`  Created meta.json for: ${bookName}`);
    } catch (e) {
      console.error(`  Failed to create meta.json for ${bookName}:`, e.message);
    }
  }
}

function processSubcategoryDir(subPath, subName, catName) {
  const files = getFiles(subPath);
  const index01 = files.find(f => f === '01-index.mdx');
  const index00 = files.find(f => f === '00-index.mdx');

  // Rename 01-index.mdx to 00-index.mdx at subcategory level
  if (index01 && !index00) {
    const src = join(subPath, index01);
    const dst = join(subPath, '00-index.mdx');
    try {
      renameSync(src, dst);
      stats.subcategoryIndexesRenamed++;
      console.log(`  Renamed: ${subName}/01-index.mdx -> 00-index.mdx`);
    } catch (e) {
      console.error(`  Rename failed for ${subName}:`, e.message);
    }
  } else if (index01 && index00) {
    // Both exist - remove 01-index.mdx
    try { renameSync(join(subPath, '01-index.mdx'), join(subPath, '01-index.mdx.bak')); }
    catch {}
  }

  // Process book directories within this subcategory
  const bookDirs = getDirs(subPath);
  for (const bookDir of bookDirs) {
    const bookPath = join(subPath, bookDir);
    processBookDir(bookPath, bookDir, catName, subName);
  }
}

function processCategoryDir(catPath, catName) {
  console.log(`\nCategory: ${catName}`);

  // Handle category-level index
  const files = getFiles(catPath);
  const catIndex = files.find(f => f === '01-index.mdx');
  if (catIndex && !files.includes('00-index.mdx')) {
    try {
      renameSync(join(catPath, '01-index.mdx'), join(catPath, '00-index.mdx'));
      stats.subcategoryIndexesRenamed++;
      console.log(`  Renamed category index: 01-index.mdx -> 00-index.mdx`);
    } catch {}
  }

  const subDirs = getDirs(catPath);
  for (const subDir of subDirs) {
    const subPath = join(catPath, subDir);
    processSubcategoryDir(subPath, subDir, catName);
  }
}

// Main
console.log('Starting BookAtlas cleanup...\n');
const categories = getDirs(MDX_DIR);
for (const cat of categories) {
  const catPath = join(MDX_DIR, cat);
  processCategoryDir(catPath, cat);
}

console.log('\n--- Cleanup Complete ---');
console.log(`Meta.json files created: ${stats.metaCreated}`);
console.log(`Frontmatter stripped from: ${stats.frontmatterStripped} files`);
console.log(`Book-level 00-index.mdx -> 01-index.mdx renamed: ${stats.filesRenamed}`);
console.log(`Subcategory 01-index.mdx -> 00-index.mdx renamed: ${stats.subcategoryIndexesRenamed}`);
