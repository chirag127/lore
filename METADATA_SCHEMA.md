# METADATA_SCHEMA.md

# BookAtlas Metadata Schema

## meta.json Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| slug | string | Yes | lowercase-kebab unique identifier |
| title | string | Yes | Full book title |
| subtitle | string | No | Book subtitle |
| authors | string[] | Yes | Array of author names |
| publicationYear | number | No | Year of publication |
| publisher | string | No | Publisher name |
| isbn13 | string | No | 13-digit ISBN |
| isbn10 | string | No | 10-digit ISBN |
| isbn | string | No | Either ISBN format |
| language | string | No | Language code (default: `en`) |
| pages | number | No | Page count |
| difficulty | string | No | `easy`, `medium`, `hard`, `dense` |
| estimatedReadingHours | number | No | Estimated reading time |
| estimatedListeningMinutes | number | No | Estimated listening time |
| genres | string[] | No | Genre classifications |
| subjects | string[] | No | Subject areas |
| themes | string[] | No | Major themes |
| tags | string[] | No | Searchable tags |
| category | string | Yes | Top-level category slug |
| subcategory | string | Yes | Discipline subcategory slug |
| subtopic | string | Yes | Leaf category/topic slug |
| categoryPath | string[] | No | Full `[category, subcategory, subtopic]` path |

## Example

```json
{
  "slug": "thinking-fast-and-slow-daniel-kahneman",
  "title": "Thinking, Fast and Slow",
  "authors": ["Daniel Kahneman"],
  "publicationYear": 2011,
  "publisher": "Farrar, Straus and Giroux",
  "isbn13": "9780374533557",
  "pages": 499,
  "language": "en",
  "difficulty": "intermediate",
  "estimatedReadingHours": 12,
  "estimatedListeningMinutes": 900,
  "genres": ["Psychology", "Non-Fiction"],
  "subjects": ["Behavioral Economics", "Cognitive Science"],
  "themes": ["Decision Making", "Cognitive Biases", "Heuristics"],
  "tags": ["psychology", "economics", "decision-making", "biases"],
  "category": "07-money-markets-and-wealth",
  "subcategory": "02-behavioral-finance",
  "subtopic": "01-behavioral-economics",
  "categoryPath": ["07-money-markets-and-wealth", "02-behavioral-finance", "01-behavioral-economics"]
}
```

## Slug Generation Rules

1. Start with the book title (lowercase, kebab-case)
2. Append author last name(s)
3. Remove special characters
4. Keep under 80 characters
5. Must be unique across the entire knowledge base

Examples:
- `thinking-fast-and-slow-daniel-kahneman`
- `clean-code-robert-martin`
- `the-pragmatic-programmer-andrew-hunt`
