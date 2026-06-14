"""
Complete fix: identify all books, rename their files correctly.
A book directory = has meta.json OR 05-meta.json with content > 0.
Book files should be: 01-index.mdx, 02-content.mdx, 03-analysis.mdx, 04-narration.mdx, meta.json
Category files should be: 00-index.mdx
"""
import os
import shutil

knowledge_root = r"C:\AM\GitHub\BookAtlas\knowledge"

def is_book_dir(path):
    """Check if directory is a book (has meta.json with content)."""
    for name in ["meta.json", "05-meta.json", "meta.json"]:
        p = os.path.join(path, name)
        if os.path.exists(p) and os.path.getsize(p) > 0:
            return True
    return False

def get_book_slug(path):
    """Get the book slug from directory name."""
    return os.path.basename(path)

# Step 1: Find all book directories at depth 3
print("Step 1: Finding all books at depth 3...")
books = []
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    rel = os.path.relpath(dirpath, knowledge_root)
    parts = rel.split(os.sep)
    if len(parts) == 3 and is_book_dir(dirpath):
        books.append(dirpath)

print(f"  Found {len(books)} books at depth 3")

# Step 2: Fix file names in each book
print("\nStep 2: Fixing file names in books...")
fixed = 0
for book_path in books:
    rel = os.path.relpath(book_path, knowledge_root)
    
    # Possible current file names -> target names
    # After the mess of renames, files could be in various states
    current_files = os.listdir(book_path)
    
    # Map of target_name -> current_name possibilities
    target_map = {
        "01-index.mdx": ["index.mdx", "01-index.mdx"],
        "02-content.mdx": ["01-content.mdx", "02-content.mdx", "content.mdx"],
        "03-analysis.mdx": ["02-analysis.mdx", "03-analysis.mdx", "analysis.mdx"],
        "04-narration.mdx": ["03-narration.mdx", "04-narration.mdx", "narration.mdx"],
        "meta.json": ["05-meta.json", "meta.json"],
    }
    
    book_fixed = False
    for target, possibilities in target_map.items():
        target_path = os.path.join(book_path, target)
        if os.path.exists(target_path):
            continue  # Already correct
        
        for poss in possibilities:
            poss_path = os.path.join(book_path, poss)
            if os.path.exists(poss_path):
                os.rename(poss_path, target_path)
                book_fixed = True
                break
    
    if book_fixed:
        fixed += 1

print(f"  Fixed {fixed} books")

# Step 3: Verify
print("\nStep 3: Verification...")
ok = 0
bad = 0
for book_path in books:
    expected = {"01-index.mdx", "02-content.mdx", "03-analysis.mdx", "04-narration.mdx", "meta.json"}
    actual = set(os.listdir(book_path))
    # Remove category index if present
    actual.discard("00-index.mdx")
    if expected.issubset(actual):
        ok += 1
    else:
        missing = expected - actual
        extra = actual - expected
        rel = os.path.relpath(book_path, knowledge_root)
        print(f"  BAD: {rel}")
        if missing:
            print(f"    Missing: {missing}")
        if extra:
            print(f"    Extra: {extra}")
        bad += 1

print(f"\n  OK: {ok}, Bad: {bad}")
print(f"  Total books: {len(books)}")
