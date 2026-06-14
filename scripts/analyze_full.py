"""
Comprehensive analysis of the knowledge directory structure.
Identifies: depth issues, sub-sub-categories, ordering problems.
"""
import os
import json

root = r"C:\AM\GitHub\BookAtlas\knowledge"

print("=" * 80)
print("KNOWLEDGE DIRECTORY STRUCTURE ANALYSIS")
print("=" * 80)

# Walk the full tree
for dirpath, dirnames, filenames in sorted(os.walk(root)):
    rel = os.path.relpath(dirpath, root)
    depth = rel.count(os.sep) + 1 if rel != '.' else 0
    
    # Check if this is a book (has meta.json with content)
    meta = os.path.join(dirpath, "meta.json")
    is_book = os.path.exists(meta) and os.path.getsize(meta) > 0
    
    # Check if it has 05-meta.json (renamed meta)
    meta5 = os.path.join(dirpath, "05-meta.json")
    is_book_renamed = os.path.exists(meta5) and os.path.getsize(meta5) > 0
    
    # Check if it has book content files
    has_content = any(f.endswith('.mdx') for f in filenames)
    
    # Count subdirectories
    subdirs = [d for d in os.listdir(dirpath) if os.path.isdir(os.path.join(dirpath, d))]
    
    if depth <= 4:  # Only show first 4 levels
        prefix = "  " * depth
        if is_book or is_book_renamed:
            print(f"{prefix}[BOOK] {rel}/ ({len(filenames)} files)")
        elif subdirs:
            print(f"{prefix}[DIR]  {rel}/ ({len(subdirs)} subdirs)")
        elif filenames:
            print(f"{prefix}[DIR]  {rel}/ ({len(filenames)} files, no subdirs)")

print("\n" + "=" * 80)
print("PROBLEM AREAS")
print("=" * 80)

# Find books deeper than level 3 (knowledge/top/leaf/book = depth 3)
print("\n1. BOOKS AT WRONG DEPTH (should be at depth 3: knowledge/top/leaf/book):")
for dirpath, dirnames, filenames in os.walk(root):
    rel = os.path.relpath(dirpath, root)
    depth = rel.count(os.sep) + 1 if rel != '.' else 0
    
    meta = os.path.join(dirpath, "meta.json")
    meta5 = os.path.join(dirpath, "05-meta.json")
    is_book = (os.path.exists(meta) and os.path.getsize(meta) > 0) or \
              (os.path.exists(meta5) and os.path.getsize(meta5) > 0)
    
    if is_book and depth != 3:
        print(f"   DEPTH {depth}: {rel}")

# Find sub-sub-categories (directories at depth 4+ that contain books)
print("\n2. SUB-SUB-CATEGORIES (depth 4+ directories containing books):")
for dirpath, dirnames, filenames in os.walk(root):
    rel = os.path.relpath(dirpath, root)
    depth = rel.count(os.sep) + 1 if rel != '.' else 0
    
    if depth >= 4:
        # Check if this directory contains books
        has_book = False
        for sub in os.listdir(dirpath):
            sub_path = os.path.join(dirpath, sub)
            if os.path.isdir(sub_path):
                m1 = os.path.join(sub_path, "meta.json")
                m2 = os.path.join(sub_path, "05-meta.json")
                if (os.path.exists(m1) and os.path.getsize(m1) > 0) or \
                   (os.path.exists(m2) and os.path.getsize(m2) > 0):
                    has_book = True
                    break
        
        if has_book:
            print(f"   DEPTH {depth}: {rel}")

# Find leaf categories and their book counts
print("\n3. LEAF CATEGORIES (depth 2, containing books):")
leaf_cats = {}
for dirpath, dirnames, filenames in os.walk(root):
    rel = os.path.relpath(dirpath, root)
    depth = rel.count(os.sep) + 1 if rel != '.' else 0
    
    if depth == 2:
        book_count = 0
        for sub in os.listdir(dirpath):
            sub_path = os.path.join(dirpath, sub)
            if os.path.isdir(sub_path):
                m1 = os.path.join(sub_path, "meta.json")
                m2 = os.path.join(sub_path, "05-meta.json")
                if (os.path.exists(m1) and os.path.getsize(m1) > 0) or \
                   (os.path.exists(m2) and os.path.getsize(m2) > 0):
                    book_count += 1
        
        if book_count > 0:
            leaf_cats[rel] = book_count

for cat, count in sorted(leaf_cats.items()):
    print(f"   {cat}: {count} books")

# Find top-level categories
print("\n4. TOP-LEVEL CATEGORIES:")
for item in sorted(os.listdir(root)):
    item_path = os.path.join(root, item)
    if os.path.isdir(item_path):
        subdirs = [d for d in os.listdir(item_path) if os.path.isdir(os.path.join(item_path, d))]
        print(f"   {item}/ ({len(subdirs)} subdirs)")

print("\n" + "=" * 80)
