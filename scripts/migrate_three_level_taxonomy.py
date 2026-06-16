#!/usr/bin/env python3
import argparse
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MDX = ROOT / "mdx"

TOP_MAPPING = {
    "01-mind-behavior-and-human-performance": "02-mind-brain-and-behavior",
    "02-body-health-and-life-sciences": "03-body-health-and-life-sciences",
    "03-money-markets-and-wealth": "07-money-markets-and-wealth",
    "04-computers-ai-and-software": "09-computers-ai-and-software",
    "05-business-strategy-and-organizations": "06-business-strategy-and-organizations",
    "06-philosophy-religion-and-indian-thought": "04-philosophy-religion-and-worldviews",
    "07-mathematics-logic-and-science": "08-mathematics-science-and-technology",
    "08-society-history-and-power": "05-society-history-and-power",
    "09-communication-writing-and-creativity": "10-communication-writing-and-creativity",
    "10-fiction-and-literature": "12-fiction-literature-and-story",
    "11-reference-and-general-knowledge": "01-general-knowledge-reference-and-language",
}

ART_SUBCATEGORIES = {
    "07-visual-arts-and-art-history",
    "08-design-theory-and-ergonomics",
    "09-architecture-and-spatial-design",
    "10-photography-and-cinematography",
    "11-music-theory-and-acoustics",
}

TOP_DESCRIPTIONS = {
    "01-general-knowledge-reference-and-language": "Reference works, language resources, general knowledge, timelines, and knowledge companions. This top-level shelf follows the broad BISAC Reference/Language Study pattern and Dewey's general works and language divisions.",
    "02-mind-brain-and-behavior": "Psychology, neuroscience, cognition, behavior, relationships, development, and human performance. This shelf reflects BISAC Psychology, Health & Fitness, and Social Science boundaries while keeping behavioral mind science separate from clinical medicine.",
    "03-body-health-and-life-sciences": "Anatomy, physiology, medicine, nutrition, fitness, sleep, genetics, immunity, public health, and the biological sciences that explain the human body.",
    "04-philosophy-religion-and-worldviews": "Philosophy, ethics, epistemology, Indian thought, Buddhist thought, Jain thought, comparative religion, theology, spirituality, and practical wisdom traditions.",
    "05-society-history-and-power": "Sociology, political science, geopolitics, public policy, media studies, urban systems, human evolution, history, military history, and civilization studies.",
    "06-business-strategy-and-organizations": "Entrepreneurship, corporate strategy, leadership, operations, marketing, product development, management thinking, negotiation, sales, business models, and organizational culture.",
    "07-money-markets-and-wealth": "Personal finance, behavioral finance, investing, portfolio theory, risk management, quantitative finance, macro markets, financial history, alternatives, real estate, venture capital, private equity, fixed income, and derivatives.",
    "08-mathematics-science-and-technology": "Mathematics, statistics, logic, game theory, modeling, physics, chemistry, biology, earth science, ecology, environmental science, complexity science, and scientific reasoning.",
    "09-computers-ai-and-software": "Programming, software engineering, system design, databases, networking, operating systems, compilers, algorithms, artificial intelligence, machine learning, cybersecurity, cryptography, cloud, DevOps, and technical leadership.",
    "10-communication-writing-and-creativity": "Writing craft, storytelling, rhetoric, public speaking, linguistics, editing, publishing, creativity, and idea generation.",
    "11-arts-design-and-culture": "Visual arts, design theory, architecture, photography, cinematography, music theory, acoustics, and cultural artifacts. These shelves align with BISAC Art, Architecture, Photography, Music, and Design categories.",
    "12-fiction-literature-and-story": "Fiction genres, literary forms, mythology, folklore, poetry, short stories, novellas, and literary criticism. Critical works about fiction remain with literature rather than under the fiction subject heading.",
}

SUB_ORDER_OVERRIDES = {
    "10-communication-writing-and-creativity": [
        "01-writing-craft-and-prose",
        "02-storytelling-and-narrative-structure",
        "03-rhetoric-persuasion-and-negotiation",
        "04-public-speaking-and-presentation",
        "05-linguistics-and-language-origins",
        "06-editing-and-publishing",
        "12-creativity-and-idea-generation",
    ],
    "11-arts-design-and-culture": [
        "07-visual-arts-and-art-history",
        "08-design-theory-and-ergonomics",
        "09-architecture-and-spatial-design",
        "10-photography-and-cinematography",
        "11-music-theory-and-acoustics",
    ],
}

GENERIC_LEAF_TERMS = {
    "nonfiction",
    "non-fiction",
    "general",
    "reference",
    "science",
    "popular-science",
    "psychology",
    "business",
    "philosophy",
    "history",
    "technology",
    "self-help",
    "selfhelp",
    "classics",
    "classic-literature",
    "literary-theory",
    "literary-criticism",
    "fiction",
    "textbook",
    "interviews",
    "career",
    "leadership",
    "communication",
    "strategy",
    "management",
    "marketing",
    "design",
    "biography",
}


def slugify(value):
    value = str(value or "").strip().lower()
    value = value.replace("&", " and ")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value


def title_from_slug(slug):
    text = re.sub(r"^\d+-", "", slug).replace("-", " ")
    replacements = {
        "ai": "AI",
        "devops": "DevOps",
        "eq": "EQ",
        "pm": "PM",
        "seo": "SEO",
        "api": "API",
        "ui": "UI",
        "ux": "UX",
    }
    words = []
    for word in text.split():
        words.append(replacements.get(word, word[0].upper() + word[1:] if word else word))
    return " ".join(words)


def unique_slug(base, used):
    if base not in used:
        used.add(base)
        return base
    i = 2
    while f"{base}-{i}" in used:
        i += 1
    used.add(f"{base}-{i}")
    return f"{base}-{i}"


def author_text(authors):
    if isinstance(authors, list):
        return ", ".join(a.get("name", str(a)) if isinstance(a, dict) else str(a) for a in authors)
    return str(authors)


def load_book(path):
    meta_path = path / "meta.json"
    if not meta_path.exists():
        return None
    try:
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None
    meta.setdefault("slug", path.name)
    meta.setdefault("title", title_from_slug(path.name))
    return {"path": path, "meta": meta}


def load_books():
    books = []
    for category in sorted(p for p in MDX.iterdir() if p.is_dir()):
        for subcategory in sorted(p for p in category.iterdir() if p.is_dir()):
            for book_path in sorted(p for p in subcategory.iterdir() if p.is_dir()):
                book = load_book(book_path)
                if book:
                    books.append(book)
    return books


def choose_leaf_slug(meta, subcategory_slug):
    candidates = []
    if meta.get("subtopic"):
        candidates.append(meta["subtopic"])
    for key in ("subjects", "themes", "genres"):
        for value in meta.get(key) or []:
            candidates.append(value)
    for title_part in re.split(r"[:;—–-]", str(meta.get("title", ""))):
        candidates.append(title_part.strip())
    for candidate in candidates:
        slug = slugify(candidate)
        if slug and slug not in GENERIC_LEAF_TERMS:
            return slug
    parts = [p for p in subcategory_slug.replace("-", " ").split() if p not in {"and", "the", "of"}]
    if len(parts) >= 2:
        return slugify(" ".join(parts[-2:]))
    return "general"


def build_subcategory_order(old_category_slug):
    if old_category_slug in SUB_ORDER_OVERRIDES:
        return SUB_ORDER_OVERRIDES[old_category_slug]
    subcategories = []
    old_category = MDX / old_category_slug
    if old_category.exists():
        for path in sorted(p for p in old_category.iterdir() if p.is_dir()):
            if path.name != "00-index.mdx":
                subcategories.append(path.name)
    return subcategories


def build_current_tree():
    grouped = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for meta_path in sorted(MDX.rglob("meta.json")):
        book_path = meta_path.parent
        parts = book_path.relative_to(MDX).parts
        if len(parts) != 4:
            continue
        top_slug, sub_slug, leaf_slug, _book_dir = parts
        book = load_book(book_path)
        if book:
            grouped[top_slug][sub_slug][leaf_slug].append(book)
    moves = []
    subcategory_names_by_top = defaultdict(list)
    for top_slug in sorted(grouped):
        for sub_slug in sorted(grouped[top_slug]):
            subcategory_names_by_top[top_slug].append(sub_slug)
            for leaf_slug in sorted(grouped[top_slug][sub_slug]):
                for book in grouped[top_slug][sub_slug][leaf_slug]:
                    moves.append({
                        "book": book,
                        "new_top": top_slug,
                        "new_sub": sub_slug,
                        "new_leaf": leaf_slug,
                    })
    return subcategory_names_by_top, moves


def build_plan():
    books = load_books()
    subcategory_names_by_top = defaultdict(list)
    used_sub_slugs = defaultdict(set)
    old_to_new_sub = {}
    for old_top in sorted(TOP_MAPPING):
        new_top = TOP_MAPPING[old_top]
        for old_sub in build_subcategory_order(old_top):
            if old_top == "09-communication-writing-and-creativity" and old_sub in ART_SUBCATEGORIES:
                new_top = "11-arts-design-and-culture"
            sub_slug = re.sub(r"^\d+-", "", old_sub)
            if new_top == "11-arts-design-and-culture" and old_sub not in ART_SUBCATEGORIES:
                continue
            if new_top == "10-communication-writing-and-creativity" and old_sub in ART_SUBCATEGORIES:
                continue
            new_sub = unique_slug(f"{len(subcategory_names_by_top[new_top]) + 1:02d}-{sub_slug}", used_sub_slugs[new_top])
            subcategory_names_by_top[new_top].append(new_sub)
            old_to_new_sub[(old_top, old_sub)] = new_sub

    moves = []
    grouped = defaultdict(lambda: defaultdict(list))
    for book in books:
        meta = book["meta"]
        old_top = meta.get("category") or book["path"].parent.parent.name
        old_sub = meta.get("subcategory") or book["path"].parent.name
        if old_top not in TOP_MAPPING:
            raise RuntimeError(f"Unknown category for {book['path']}: {old_top}")
        new_top = TOP_MAPPING[old_top]
        if old_top == "09-communication-writing-and-creativity" and old_sub in ART_SUBCATEGORIES:
            new_top = "11-arts-design-and-culture"
        new_sub = old_to_new_sub.get((old_top, old_sub))
        if not new_sub:
            if old_top == "09-communication-writing-and-creativity" and old_sub in ART_SUBCATEGORIES:
                new_sub = old_to_new_sub[(old_top, old_sub)]
            else:
                raise RuntimeError(f"No new subcategory for {old_top}/{old_sub}")
        leaf_slug = choose_leaf_slug(meta, old_sub)
        grouped[(new_top, new_sub)][leaf_slug].append(book)

    used_leaf_slugs = defaultdict(set)
    leaf_display = {}
    for (new_top, new_sub), leaves in sorted(grouped.items()):
        for leaf_slug, leaf_books in sorted(leaves.items()):
            leaf_base = slugify(leaf_slug) or "general"
            new_leaf = unique_slug(f"{len(used_leaf_slugs[(new_top, new_sub)]) + 1:02d}-{leaf_base}", used_leaf_slugs[(new_top, new_sub)])
            leaf_display[(new_top, new_sub, new_leaf)] = title_from_slug(new_leaf)
            for book in leaf_books:
                moves.append({
                    "book": book,
                    "old_top": old_top,
                    "old_sub": old_sub,
                    "new_top": new_top,
                    "new_sub": new_sub,
                    "new_leaf": new_leaf,
                    "leaf_display": leaf_display[(new_top, new_sub, new_leaf)],
                })
    return books, subcategory_names_by_top, moves, leaf_display


def render_top_index(top_slug, subcategories, books):
    display = title_from_slug(top_slug)
    desc = TOP_DESCRIPTIONS.get(top_slug, f"A curated BookAtlas collection on {display.lower()}.")
    rows = []
    for index, sub in enumerate(subcategories, 1):
        sub_books = [b for b in books if b["new_sub"] == sub]
        leaf_count = len({b["new_leaf"] for b in sub_books})
        book_count = len(sub_books)
        rows.append(f"| {index:02d} | [{title_from_slug(sub)}](/categories/{top_slug}/{sub}) | {leaf_count} | {book_count} |")
    total_books = len(books)
    total_subs = len(subcategories)
    total_leaves = len({b["new_leaf"] for b in books})
    return f"""---
title: "{re.sub(r'^[0-9]+-', '', top_slug).split('-', 1)[0]} — {display}"
slug: "{top_slug}"
position: {int(top_slug.split('-', 1)[0])}
description: "{desc}"
---

# {re.sub(r'^[0-9]+-', '', top_slug).split('-', 1)[0]} — {display}

{desc}

## Scope

This category is organized as a three-level BookAtlas shelf: top category, discipline subcategory, and topic leaf. The structure is based on broad web consensus from BISAC subject headings, Dewey Decimal Classification main classes, and the Library of Congress Classification outline, then adapted for reader browsing, learning paths, and reference use.

## What Belongs Here

Books whose primary subject, discipline, or reader intent belongs to {display.lower()}. Cross-disciplinary books are placed where the main learning value is strongest.

## What Does NOT Belong Here

Books whose main subject belongs to another top-level category are linked from related shelves instead of duplicated here.

## Reading Path

| Level | Purpose |
|-------|---------|
| Category | Choose the broad domain of knowledge |
| Subcategory | Choose the discipline or field within that domain |
| Leaf category | Choose the specific topic, method, or reader problem |

## Shelf Map

| # | Subcategory | Leaf categories | Books |
|---|-------------|-----------------|-------|
{chr(10).join(rows)}

**Total: {total_books} books across {total_subs} subcategories and {total_leaves} leaf categories.**
"""


def render_sub_index(top_slug, sub_slug, books):
    display = title_from_slug(sub_slug)
    top_display = title_from_slug(top_slug)
    leaf_groups = defaultdict(list)
    for book in books:
        leaf_groups[book["new_leaf"]].append(book)
    rows = []
    for index, leaf in enumerate(sorted(leaf_groups), 1):
        count = len(leaf_groups[leaf])
        rows.append(f"| {index:02d} | [{title_from_slug(leaf)}](/categories/{top_slug}/{sub_slug}/{leaf}) | {count} |")
    order_val = int(re.match(r'^(\d+)-', sub_slug).group(1)) if re.match(r'^[0-9]+-', sub_slug) else 99
    return f"""---
title: "{display}"
slug: "{sub_slug}"
order: {order_val}
description: "Books on {display.lower()} within {top_display.lower()}."
---

# {display}

{display} is a discipline shelf within **{top_display}**. It is organized into topic leaf categories so readers can move from broad field to specific problem without losing context.

## Leaf Categories

| # | Leaf category | Books |
|---|---------------|-------|
{chr(10).join(rows)}

**Total: {sum(len(v) for v in leaf_groups.values())} books across {len(leaf_groups)} leaf categories.**
"""


def render_leaf_index(top_slug, sub_slug, leaf_slug, books):
    display = title_from_slug(leaf_slug)
    sub_display = title_from_slug(sub_slug)
    top_display = title_from_slug(top_slug)
    rows = []
    for index, move in enumerate(sorted(books, key=lambda b: b["book"]["meta"].get("title", b["book"]["path"].name)), 1):
        meta = move["book"]["meta"]
        path = move["book"]["path"]
        slug = meta.get("slug") or path.name
        title = meta.get("title") or path.name
        authors = meta.get("authors") or ([meta["author"]] if meta.get("author") else [])
        author_text_value = author_text(authors)
        rows.append(f"| {index:02d} | [{title}](/books/{slug}) | {author_text_value} |")
    order_val = int(re.match(r'^(\d+)-', leaf_slug).group(1)) if re.match(r'^[0-9]+-', leaf_slug) else 99
    return f"""---
title: "{display}"
slug: "{leaf_slug}"
order: {order_val}
description: "Books on {display.lower()} within {sub_display.lower()}."
---

# {display}

{display} is a topic leaf within **{sub_display}** under **{top_display}**. The books here share a focused reader problem, method, or subject boundary.

## Books

| # | Book | Author |
|---|------|--------|
{chr(10).join(rows)}

**Total: {len(books)} books.**
"""


def write_indexes(subcategory_names_by_top, moves):
    grouped = defaultdict(list)
    for move in moves:
        grouped[(move["new_top"], move["new_sub"], move["new_leaf"])].append(move)
    for top_slug, subcategories in sorted(subcategory_names_by_top.items()):
        top_path = MDX / top_slug
        top_path.mkdir(parents=True, exist_ok=True)
        top_books = [m for m in moves if m["new_top"] == top_slug]
        (top_path / "00-index.mdx").write_text(render_top_index(top_slug, subcategories, top_books), encoding="utf-8")
        for sub_slug in subcategories:
            sub_path = top_path / sub_slug
            sub_path.mkdir(parents=True, exist_ok=True)
            sub_books = [m for m in moves if m["new_top"] == top_slug and m["new_sub"] == sub_slug]
            (sub_path / "00-index.mdx").write_text(render_sub_index(top_slug, sub_slug, sub_books), encoding="utf-8")
            for leaf_slug in sorted({m["new_leaf"] for m in sub_books}):
                leaf_path = sub_path / leaf_slug
                leaf_path.mkdir(parents=True, exist_ok=True)
                leaf_books = [m for m in sub_books if m["new_leaf"] == leaf_slug]
                (leaf_path / "00-index.mdx").write_text(render_leaf_index(top_slug, sub_slug, leaf_slug, leaf_books), encoding="utf-8")


def execute_moves(moves, execute):
    manifest = []
    for move in moves:
        book = move["book"]
        old_path = book["path"]
        new_path = MDX / move["new_top"] / move["new_sub"] / move["new_leaf"] / old_path.name
        if new_path.exists() and new_path.resolve() != old_path.resolve():
            raise RuntimeError(f"Destination already exists: {new_path}")
        meta = book["meta"]
        meta["category"] = move["new_top"]
        meta["subcategory"] = move["new_sub"]
        meta["subtopic"] = move["new_leaf"]
        meta["categoryPath"] = [move["new_top"], move["new_sub"], move["new_leaf"]]
        if execute:
            new_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(old_path), str(new_path))
            new_meta = new_path / "meta.json"
            new_meta.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        manifest.append({
            "old": str(old_path.relative_to(ROOT)),
            "new": str(new_path.relative_to(ROOT)),
            "title": meta.get("title"),
            "leaf": move["new_leaf"],
        })
    return manifest


def main():
    parser = argparse.ArgumentParser(description="Migrate BookAtlas mdx folders to a three-level taxonomy.")
    parser.add_argument("--execute", action="store_true", help="Actually move folders and rewrite metadata.")
    parser.add_argument("--manifest", default="taxonomy_migration_manifest.json", help="Manifest path relative to the repo root.")
    args = parser.parse_args()

    books, subcategory_names_by_top, moves, _leaf_display = build_plan()
    if not moves:
        current_subcategories, current_moves = build_current_tree()
        if current_moves:
            write_indexes(current_subcategories, current_moves)
            print(f"No pending moves; regenerated indexes for {len(current_moves)} existing three-level books.")
            print(f"Top categories: {len(current_subcategories)}")
            return

    manifest_path = ROOT / args.manifest
    manifest_path.write_text(json.dumps({"execute": args.execute, "moves": execute_moves(moves, False)}, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Planned moves: {len(moves)}")
    print(f"Top categories: {len(subcategory_names_by_top)}")
    print(f"Manifest written: {manifest_path.relative_to(ROOT)}")
    if args.execute:
        execute_moves(moves, True)
        write_indexes(subcategory_names_by_top, moves)
        print("Migration executed and indexes regenerated.")
    else:
        print("Dry run only. Re-run with --execute to move folders.")


if __name__ == "__main__":
    main()
