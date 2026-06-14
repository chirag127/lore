"""
Rename category 01-index.mdx to 00-index.mdx.
Book 01-index.mdx stays as is.
This separates category pages from book overview pages.
"""
import os

knowledge_root = r"C:\AM\GitHub\BookAtlas\knowledge"

renamed = 0
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    old_path = os.path.join(dirpath, "01-index.mdx")
    new_path = os.path.join(dirpath, "00-index.mdx")
    
    if os.path.exists(old_path) and not os.path.exists(new_path):
        # Check if this is a category (has subdirs with books) or a book (has meta.json)
        meta = os.path.join(dirpath, "meta.json")
        has_meta = os.path.exists(meta) and os.path.getsize(meta) > 0
        
        if not has_meta:
            # This is a category - rename to 00-index.mdx
            os.rename(old_path, new_path)
            rel = os.path.relpath(new_path, knowledge_root)
            renamed += 1

print(f"Renamed {renamed} category 01-index.mdx -> 00-index.mdx files")
