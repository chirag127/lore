"""
Fix YAML frontmatter in 00-index.mdx files.
The main issue: description fields with unclosed quotes or unquoted strings containing colons.
"""
import os
import re

knowledge_root = r"C:\AM\GitHub\BookAtlas\knowledge"

fixed = 0
for dirpath, dirnames, filenames in os.walk(knowledge_root):
    index_file = os.path.join(dirpath, "00-index.mdx")
    if not os.path.exists(index_file):
        continue
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not content.startswith('---'):
        continue
    
    end_idx = content.find('\n---', 3)
    if end_idx == -1:
        continue
    
    frontmatter_raw = content[3:end_idx]
    body = content[end_idx:]
    
    # Parse and fix each line
    lines = frontmatter_raw.split('\n')
    new_lines = []
    changed = False
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check for description field
        if line.startswith('description:'):
            value = line[len('description:'):].strip()
            
            # Case 1: Starts with " but doesn't end with "
            if value.startswith('"') and not value.endswith('"'):
                # Add closing quote
                new_lines.append(line + '"')
                changed = True
                i += 1
                continue
            
            # Case 2: Doesn't start with quote and contains a colon
            if not value.startswith('"') and not value.startswith("'") and ':' in value:
                new_lines.append(f'description: "{value}"')
                changed = True
                i += 1
                continue
            
            # Case 3: Starts with ' but doesn't end with '
            if value.startswith("'") and not value.endswith("'"):
                new_lines.append(line + "'")
                changed = True
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    if changed:
        new_frontmatter = '\n'.join(new_lines)
        new_content = '---' + new_frontmatter + body
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        rel = os.path.relpath(index_file, knowledge_root)
        fixed += 1
        print(f"  Fixed: {rel}")

print(f"\nFixed YAML in {fixed} files")
