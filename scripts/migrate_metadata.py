import json
import os
import re
import yaml
from datetime import date, datetime

MDX_ROOT = r"C:\AM\GitHub\BookAtlas\mdx"


def serialize_val(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: serialize_val(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [serialize_val(i) for i in obj]
    return obj

def parse_frontmatter(content):
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
    if not match:
        return None, content
    try:
        data = yaml.safe_load(match.group(1))
        return data if isinstance(data, dict) else {}, match.group(2)
    except yaml.YAMLError:
        return None, content

def merge_fm_into_meta(fm, meta):
    changed = False

    mappings = {
        'slug': 'slug',
        'title': 'title',
        'year': 'year',
        'excerpt': 'excerpt',
        'tags': 'tags',
        'addedAt': 'addedAt',
    }

    for fm_k, meta_k in mappings.items():
        if fm_k in fm and fm[fm_k] is not None:
            if meta_k not in meta or meta[meta_k] is None or meta[meta_k] == '':
                meta[meta_k] = fm[fm_k]
                changed = True

    if 'author' in fm and fm['author'] is not None:
        if 'authors' not in meta or not meta['authors']:
            if isinstance(fm['author'], list):
                meta['authors'] = fm['author']
            else:
                meta['authors'] = [a.strip() for a in re.split(r'\s*(?:,|\band\b|&)\s*', str(fm['author'])) if a.strip()]
            changed = True

    for key in ['cover', 'keyIdeas', 'keyTakeaways', 'whoShouldRead', 'whoShouldSkip', 'relatedBooks']:
        if key in fm and fm[key] is not None:
            if key not in meta or meta[key] is None or meta[key] == '' or (isinstance(meta[key], list) and not meta[key]):
                meta[key] = fm[key]
                changed = True

    return changed

stats = {'parsed': 0, 'no_frontmatter': 0, 'meta_created': 0, 'meta_updated': 0, 'body_written': 0}

for cat in sorted(os.listdir(MDX_ROOT)):
    cat_path = os.path.join(MDX_ROOT, cat)
    if not os.path.isdir(cat_path):
        continue
    for sub in sorted(os.listdir(cat_path)):
        sub_path = os.path.join(cat_path, sub)
        if not os.path.isdir(sub_path):
            continue
        for book in sorted(os.listdir(sub_path)):
            book_path = os.path.join(sub_path, book)
            if not os.path.isdir(book_path):
                continue

            index_path = os.path.join(book_path, '01-index.mdx')
            meta_path = os.path.join(book_path, 'meta.json')

            if not os.path.exists(index_path):
                continue

            with open(index_path, 'r', encoding='utf-8') as f:
                content = f.read()

            fm_data, body = parse_frontmatter(content)
            if fm_data is None:
                stats['no_frontmatter'] += 1
                continue

            stats['parsed'] += 1
            has_meta = os.path.exists(meta_path)

            if has_meta:
                with open(meta_path, 'r', encoding='utf-8') as f:
                    try:
                        meta = json.load(f)
                    except json.JSONDecodeError:
                        meta = {}
            else:
                meta = {}

            changed = merge_fm_into_meta(fm_data, meta)

            if changed or not has_meta:
                meta = serialize_val(meta)
                with open(meta_path, 'w', encoding='utf-8') as f:
                    json.dump(meta, f, indent=2, ensure_ascii=False)
                if not has_meta:
                    stats['meta_created'] += 1
                else:
                    stats['meta_updated'] += 1

            body = body.strip()
            body_only = body + '\n'
            with open(index_path, 'w', encoding='utf-8') as f:
                f.write(body_only)
            stats['body_written'] += 1

print(f"Books with frontmatter parsed: {stats['parsed']}")
print(f"No frontmatter found:         {stats['no_frontmatter']}")
print(f"Meta.json created:            {stats['meta_created']}")
print(f"Meta.json updated:            {stats['meta_updated']}")
print(f"Index body written:           {stats['body_written']}")
