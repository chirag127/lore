"""
Fix YAML frontmatter in all 00-index.mdx files.
The issue is unquoted strings containing colons, e.g.:
  description: "Some text: with colon"
Should be:
  description: "Some text: with colonel"
Or the entire description should be properly quoted.
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
    
    # Parse frontmatter
    if not content.startswith('---'):
        continue
    
    # Find end of frontmatter
    end_idx = content.find('---', 3)
    if end_idx == -1:
        continue
    
    frontmatter = content[3:end_idx]
    body = content[end_idx+3:]
    
    # Fix lines with unquoted strings containing colons
    lines = frontmatter.split('\n')
    new_lines = []
    changed = False
    
    for line in lines:
        # Match key: value patterns where value contains a colon but isn't quoted
        match = re.match(r'^(\s*)([\w-]+):\s*(.+)$', line)
        if match:
            indent, key, value = match.groups()
            # If value contains a colon and isn't already quoted
            if ':' in value and not (value.startswith('"') or value.startswith("'")):
                # Check if it's not a number
                try:
                    float(value)
                    new_lines.append(line)
                except ValueError:
                    value = f'"{value}"'
                    changed = True
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
    
    if changed:
        new_frontmatter = '\n'.join(new_lines)
        new_content = f'---\n{new_frontmatter}\n---{body}'
        with open(index_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        rel = os.path.relpath(index_file, knowledge_root)
        fixed += 1

print(f"Fixed YAML in {fixed} files")
