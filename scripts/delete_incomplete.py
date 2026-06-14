"""
Delete incomplete books that are missing required content files.
A complete book must have: 01-index.mdx, 02-content.mdx, 03-analysis.mdx, 04-narration.mdx, meta.json
"""
import os
import shutil

knowledge_root = r"C:\AM\GitHub\BookAtlas\knowledge"

required = {"01-index.mdx", "02-content.mdx", "03-analysis.mdx", "04-narration.mdx", "meta.json"}

deleted = 0
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    rel = os.path.relpath(dirpath, knowledge_root)
    parts = rel.split(os.sep)
    
    if len(parts) != 3:
        continue
    
    meta = os.path.join(dirpath, "meta.json")
    if not os.path.exists(meta) or os.path.getsize(meta) == 0:
        continue
    
    actual = set(filenames)
    if not required.issubset(actual):
        missing = required - actual
        print(f"DELETING: {rel} (missing: {missing})")
        shutil.rmtree(dirpath)
        deleted += 1

print(f"\nDeleted {deleted} incomplete books")
