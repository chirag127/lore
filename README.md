# BookAtlas

A research-grade personal knowledge library built around books.

## Structure

```text
mdx/
  NN-top-category/
    00-index.mdx
    NN-discipline-subcategory/
      00-index.mdx
      NN-topic-leaf/
        00-index.mdx
        NNN-book-slug/
          01-index.mdx
          02-content.mdx
          03-analysis.mdx
          04-narration.mdx
          meta.json
```

## Three-Level Taxonomy

BookAtlas uses:

1. **Top category** — broad domain of knowledge.
2. **Subcategory** — discipline or field.
3. **Leaf category** — focused topic, method, or reader problem.

Books live directly inside leaf categories and `meta.json` stores:

```json
{
  "category": "02-mind-brain-and-behavior",
  "subcategory": "01-learning-science-and-education",
  "subtopic": "01-learning"
}
```

## Active Categories

1. General Knowledge, Reference and Language
2. Mind, Brain and Behavior
3. Body, Health and Life Sciences
4. Philosophy, Religion and Worldviews
5. Society, History and Power
6. Business, Strategy and Organizations
7. Money, Markets and Wealth
8. Mathematics, Science and Technology
9. Computers, AI and Software
10. Communication, Writing and Creativity
11. Arts, Design and Culture
12. Fiction, Literature and Story

## Naming Convention

| Level | Format | Example |
|-------|--------|---------|
| Category | `NN-name` | `02-mind-brain-and-behavior` |
| Subcategory | `NN-name` | `01-learning-science-and-education` |
| Leaf category | `NN-name` | `01-learning` |
| Book | `NNN-slug` | `001-make-it-stick-peter-brown` |

## Stats

- 466 books
- 12 top category folders
- 128 subcategory folders
- 376 leaf category folders

## Useful Scripts

```bash
python scripts/migrate_three_level_taxonomy.py
node scripts/gen-indexes.mjs
pnpm build
```
