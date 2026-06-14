import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const MDX_DIR = 'C:\\AM\\GitHub\\BookAtlas\\mdx';

const files = [
  '03-money-markets-and-wealth\\15-investment-theory-and-principles\\01-100-baggers-christopher-mayer\\01-index.mdx',
  '03-money-markets-and-wealth\\15-investment-theory-and-principles\\04-what-works-on-wall-street-james-oshaughnessy\\01-index.mdx',
  '04-computers-ai-and-software\\03-system-design-and-distributed-systems\\07-system-design-interview-volume-2-alex-xu\\01-index.mdx',
  '05-business-strategy-and-organizations\\01-entrepreneurship-and-startups\\03-founders-at-work-jessica-livingston\\01-index.mdx',
  '05-business-strategy-and-organizations\\03-leadership-and-executive-management\\06-the-first-90-days-michael-watkins\\01-index.mdx',
  '05-business-strategy-and-organizations\\06-product-development-and-innovation\\03-change-function-pip-coburn\\01-index.mdx',
];

for (const rel of files) {
  const fp = join(MDX_DIR, rel);
  let content = readFileSync(fp, 'utf-8');
  // Strip UTF-8 BOM if present
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  if (!content.startsWith('---')) {
    if (new RegExp('^\\s*---').test(content)) {
      // Has frontmatter with leading whitespace
    } else {
      console.log(`No frontmatter in ${rel}`);
      continue;
    }
  }
  const end = content.indexOf('---', 3);
  if (end === -1) {
    console.log(`Malformed frontmatter in ${rel}`);
    continue;
  }
  const body = content.slice(end + 3).trim();
  if (body.length < 10) {
    console.log(`Empty body after frontmatter in ${rel}`);
    continue;
  }
  writeFileSync(fp, body + '\n', 'utf-8');
  console.log(`Stripped frontmatter: ${rel}`);
}
