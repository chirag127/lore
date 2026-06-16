# BookAtlas Category Guide

## Category Hierarchy

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

BookAtlas uses a three-level taxonomy:

1. **Top category** — broad domain of knowledge.
2. **Subcategory** — discipline or field inside that domain.
3. **Leaf category** — focused topic, method, or reader problem.

Books live directly inside leaf categories.

## Active Top Categories

1. **01-general-knowledge-reference-and-language** — Reference, language resources, general knowledge, timelines.
2. **02-mind-brain-and-behavior** — Psychology, neuroscience, cognition, behavior, relationships, performance.
3. **03-body-health-and-life-sciences** — Anatomy, physiology, medicine, nutrition, fitness, sleep, genetics, public health.
4. **04-philosophy-religion-and-worldviews** — Philosophy, ethics, epistemology, Indian thought, Buddhism, Jainism, comparative religion, spirituality.
5. **05-society-history-and-power** — Sociology, politics, geopolitics, public policy, media, urban systems, history, civilization.
6. **06-business-strategy-and-organizations** — Entrepreneurship, strategy, leadership, operations, marketing, product, management, negotiation, sales, business models, culture.
7. **07-money-markets-and-wealth** — Personal finance, investing, markets, risk, macro, quantitative finance, alternatives, real estate, venture capital, fixed income, derivatives.
8. **08-mathematics-science-and-technology** — Mathematics, statistics, logic, modeling, physics, chemistry, biology, earth science, ecology, complexity, scientific reasoning.
9. **09-computers-ai-and-software** — Programming, software engineering, systems, databases, networks, operating systems, algorithms, AI, machine learning, security, cloud, DevOps, technical leadership.
10. **10-communication-writing-and-creativity** — Writing, storytelling, rhetoric, speaking, linguistics, editing, publishing, creativity, idea generation.
11. **11-arts-design-and-culture** — Visual arts, design, architecture, photography, cinematography, music, cultural artifacts.
12. **12-fiction-literature-and-story** — Fiction genres, literary forms, mythology, folklore, poetry, short stories, novellas, literary criticism.

## Taxonomy Basis

The structure is adapted from broad web consensus across:

- BISAC Subject Headings, especially the 2025 edition's major sections and multi-level subject descriptors.
- Dewey Decimal Classification main classes and hierarchy principle.
- Library of Congress Classification outline.
- Reader browsing needs, learning-path sequencing, and reference lookup.

## Category Boundaries

Categories should be mutually exclusive at the top level:

- **Mind vs Body**: behavioral psychology, cognition, and neuroscience of behavior belong in Mind; clinical medicine, anatomy, physiology, genetics, and public health belong in Body.
- **Money vs Business**: investing, markets, personal finance, and wealth belong in Money; entrepreneurship, management, marketing, sales, operations, and organizations belong in Business.
- **Computers vs Mathematics/Science**: software, systems, AI engineering, databases, security, and DevOps belong in Computers; math, statistics, physics, chemistry, biology, earth science, and scientific reasoning belong in Mathematics/Science.
- **Society vs History**: social science, politics, policy, media, urban systems, and civilization studies belong in Society; historical periods, military history, and historical biography belong in Society's history shelves.
- **Communication vs Arts**: writing, rhetoric, language, editing, publishing, and creativity belong in Communication; visual art, design, architecture, photography, music, and cultural artifacts belong in Arts.
- **Philosophy vs Fiction/Literature**: philosophy and religion belong in Philosophy; literary criticism and fiction genres belong in Fiction/Literature.
- **Reference vs Domain Books**: reference works, dictionaries, atlases, encyclopedias, and general knowledge handbooks belong in Reference; domain-specific books belong in their subject category.

## Creating a New Category

1. Create a new category only when it improves browsing or learning.
2. Keep the hierarchy to three levels: category, subcategory, leaf.
3. Use kebab-case slugs with numeric ordering.
4. Add `00-index.mdx` at every category, subcategory, and leaf level.
5. Keep leaf categories focused enough that a reader understands what belongs there.
6. Avoid duplicate books across categories. Use related links instead of duplication.

## Book Placement

Books go directly in leaf categories:

```text
mdx/
  02-mind-brain-and-behavior/
    01-learning-science-and-education/
      01-learning/
        make-it-stick-peter-brown/
          01-index.mdx
          02-content.mdx
          03-analysis.mdx
          04-narration.mdx
          meta.json
```

Each book's `meta.json` must include:

```json
{
  "category": "02-mind-brain-and-behavior",
  "subcategory": "01-learning-science-and-education",
  "subtopic": "01-learning"
}
```

## Index Files

Every category level should have `00-index.mdx`:

- Top category index: explains scope and lists subcategories.
- Subcategory index: explains the discipline and lists leaf categories.
- Leaf index: explains the focused topic and lists books.

## Cross-Links

Category indexes should link to:

- Parent category.
- Child subcategories or leaf categories.
- 2-3 closely related categories when useful.
- Essential books only when they anchor the category.

## Migration

Use `scripts/migrate_three_level_taxonomy.py` when restructuring categories:

```bash
python scripts/migrate_three_level_taxonomy.py
```

The script can also regenerate indexes for an already-migrated three-level tree.
