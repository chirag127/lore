# BookAtlas

A research-grade personal knowledge library built around books.

## Project Structure

```
BookAtlas/
├── knowledge/                    # Main knowledge base
│   ├── 01-mind-behavior-and-human-performance/
│   ├── 02-body-health-and-life-sciences/
│   ├── 03-money-markets-and-wealth/
│   ├── 04-computers-ai-and-software/
│   ├── 05-business-strategy-and-organizations/
│   ├── 06-philosophy-religion-and-indian-thought/
│   ├── 07-math-logic-and-science/
│   ├── 08-society-history-and-power/
│   ├── 09-communication-writing-and-creativity/
│   └── 10-fiction-and-literature/
├── templates/                    # Book and category templates
├── scripts/                      # Migration and validation scripts
├── web/                          # Astro + React frontend
└── 02-AGENTS.md                  # Agent definitions
```

## Categories

| # | Category | Focus |
|---|----------|-------|
| 01 | Mind, Behavior & Human Performance | Learning, psychology, decision-making |
| 02 | Body, Health & Life Sciences | Medicine, nutrition, neuroscience |
| 03 | Money, Markets & Wealth | Investing, economics, personal finance |
| 04 | Computers, AI & Software | Programming, AI, system design |
| 05 | Business, Strategy & Organizations | Leadership, entrepreneurship, strategy |
| 06 | Philosophy, Religion & Indian Thought | Ethics, philosophy, wisdom traditions |
| 07 | Math, Logic & Science | Mathematics, scientific method |
| 08 | Society, History & Power | Social science, history, politics |
| 09 | Communication, Writing & Creativity | Rhetoric, writing, storytelling |
| 10 | Fiction & Literature | Literary fiction, poetry, drama |

## Book Structure

Each book contains exactly 5 files:

- `01-index.mdx` - Book overview and metadata
- `02-content.mdx` - Comprehensive summary
- `03-analysis.mdx` - Critical analysis
- `04-narration.mdx` - Audio-friendly version
- `meta.json` - Structured metadata

## Category Structure

Each leaf category contains:
- `00-index.mdx` - Category overview and scope

## Getting Started

1. Browse categories in `knowledge/`
2. Each leaf category has an `00-index.mdx` explaining the focus
3. Books live directly inside leaf categories (knowledge/top-cat/leaf-cat/book/)
4. Use the templates in `templates/` for new books
