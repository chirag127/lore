"""
Fix: rename 00-index.mdx back to 01-index.mdx in book directories.
A book directory = has meta.json with content > 0.
"""
import os

knowledge_root = r"C:\AM\GitHub\BookAtlas\knowledge"

fixed = 0
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    rel = os.path.relpath(dirpath, knowledge_root)
    parts = rel.split(os.sep)
    
    # Only process depth-3 directories (knowledge/top/leaf/book)
    if len(parts) != 3:
        continue
    
    # Check if this is a book (has meta.json with content)
    meta = os.path.join(dirpath, "meta.json")
    if not os.path.exists(meta) or os.path.getsize(meta) == 0:
        continue
    
    # This is a book - fix the index file
    old_idx = os.path.join(dirpath, "00-index.mdx")
    new_idx = os.path.join(dirpath, "01-index.mdx")
    
    if os.path.exists(old_idx) and not os.path.exists(new_idx):
        os.rename(old_idx, new_idx)
        fixed += 1

print(f"Fixed {fixed} book index files (00-index.mdx -> 01-index.mdx)")

# Now also fix any remaining file naming issues in books
print("\nFixing remaining file naming issues...")
fixed2 = 0
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    rel = os.path.relpath(dirpath, knowledge_root)
    parts = rel.split(os.sep)
    
    if len(parts) != 3:
        continue
    
    meta = os.path.join(dirpath, "meta.json")
    if not os.path.exists(meta) or os.path.getsize(meta) == 0:
        continue
    
    # Fix content/analysis/narration files that might have wrong numbers
    renames = {
        "02-content.mdx": "02-content.mdx",  # already correct
        "03-analysis.mdx": "03-analysis.mdx",  # already correct  
        "04-narration.mdx": "04-narration.mdx",  # already correct
    }
    
    # Check for old-style names
    old_new_map = {
        "content.mdx": "02-content.mdx",
        "01-content.mdx": "02-content.mdx",
        "analysis.mdx": "03-analysis.mdx",
        "02-analysis.mdx": "03-analysis.mdx",
        "narration.mdx": "04-narration.mdx",
        "03-narration.mdx": "04-narration.mdx",
    }
    
    book_changed = False
    for old_name, new_name in old_new_map.items():
        old_path = os.path.join(dirpath, old_name)
        new_path = os.path.join(dirpath, new_name)
        if os.path.exists(old_path) and not os.path.exists(new_path):
            os.rename(old_path, new_path)
            book_changed = True
    
    if book_changed:
        fixed2 += 1

print(f"Fixed {fixed2} books with old-style file names")

# Final verification
print("\nFinal verification...")
ok = 0
bad = 0
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    rel = os.path.relpath(dirpath, knowledge_root)
    parts = rel.split(os.sep)
    
    if len(parts) != 3:
        continue
    
    meta = os.path.join(dirpath, "meta.json")
    if not os.path.exists(meta) or os.path.getsize(meta) == 0:
        continue
    
    expected = {"01-index.mdx", "02-content.mdx", "03-analysis.mdx", "04-narration.mdx", "meta.json"}
    actual = set(filenames)
    actual.discard("00-index.mdx")  # category index if present
    
    if expected.issubset(actual):
        ok += 1
    else:
        missing = expected - actual
        rel = os.path.relpath(dirpath, knowledge_root)
        print(f"  BAD: {rel} - missing: {missing}")
        bad += 1

print(f"\nOK: {ok}, Bad: {bad}, Total: {ok + bad}")
