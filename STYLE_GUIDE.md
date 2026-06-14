# STYLE_GUIDE.md

# BookAtlas Style Guide

## MDX Formatting

- Use GitHub-flavored markdown
- Use emojis for section headers (e.g., `# 📚 Overview`)
- Use tables for structured data
- Use Mermaid diagrams for frameworks and flows
- Use admonitions for callouts
- Use blockquotes for key quotes
- Keep lines under 80 characters where possible

## File Naming

- Book folders: `book-slug-author-name` (lowercase kebab-case)
- Category folders: `leaf-category-name` (lowercase kebab-case)
- Top categories: `NN-category-name` (numbered prefix)
- Book files: `index.mdx`, `01-content.mdx`, `02-analysis.mdx`, `03-narration.mdx`, `meta.json`

## Metadata

- `slug`: lowercase-kebab-case, unique per book
- `title`: Full book title
- `authors`: Array of author names
- `year`: Publication year (number)
- `isbn13` or `isbn`: ISBN identifier
- `difficulty`: `easy`, `medium`, `hard`, or `dense`
- `tags`: Array of lowercase tags
- `category`: Top-level category name
- `subcategory`: Leaf category name

## Content Guidelines

### index.mdx
- Orientation, not deep explanation
- Executive summary in 2-3 sentences
- Key takeaways as bullet points
- Who should read/skip
- Difficulty and time estimates
- Related books
- Final verdict

### 01-content.mdx
- Deep understanding, largest file
- Core concepts, frameworks, mental models
- Chapter-by-chapter insights
- Real-world examples
- Practical applications
- Actionable lessons and action plan
- No criticism

### 02-analysis.mdx
- Critical thinking and evaluation
- Strengths and weaknesses
- Named criticisms from real reviewers
- Counterarguments
- Scientific evidence
- Historical context
- Similar books comparison
- Long-term relevance
- Final assessment

### 03-narration.mdx
- Audio-first learning
- No headings in body
- No bullet lists
- No dialogue
- Natural flowing paragraphs
- Sounds like an audiobook

## Anti-Duplication Rules

Each file has one responsibility:
- `index.mdx` → Orientation
- `01-content.mdx` → Understanding
- `02-analysis.mdx` → Evaluation
- `03-narration.mdx` → Audio consumption
- `meta.json` → Facts

Never rewrite the same thing five times.
