"""
Fix all YAML frontmatter issues in 00-index.mdx files.
- Unclosed quotes
- order field as string instead of number
- Any other YAML parse errors
"""
import os
import re
import yaml

knowledge_root = r"C:\AM\GitHub\BookAtlas\knowledge"

fixed = 0
errors = 0

for dirpath, dirnames, filenames in os.walk(knowledge_root):
    index_file = os.path.join(dirpath, "00-index.mdx")
    if not os.path.exists(index_file):
        continue
    
    with open(index_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if not content.startswith('---'):
        continue
    
    # Find the closing ---
    end_idx = content.find('\n---', 3)
    if end_idx == -1:
        continue
    
    frontmatter_str = content[3:end_idx]
    body = content[end_idx:]
    
    # Try to parse YAML
    try:
        data = yaml.safe_load(frontmatter_str)
    except yaml.YAMLError:
        # YAML parse error - try to fix
        lines = frontmatter_str.split('\n')
        new_lines = []
        changed = False
        
        for line in lines:
            # Fix unclosed quotes on description
            if line.startswith('description:'):
                value = line[len('description:'):].strip()
                if value.startswith('"') and not value.endswith('"'):
                    line = line + '"'
                    changed = True
                elif value.startswith("'") and not value.endswith("'"):
                    line = line + "'"
                    changed = True
                elif not value.startswith('"') and not value.startswith("'") and ':' in value:
                    line = f'description: "{value}"'
                    changed = True
            
            # Fix order as string
            if line.startswith('order:'):
                value = line[len('order:'):].strip()
                if value.startswith("'") or value.startswith('"'):
                    line = f"order: {value[1:-1]}"
                    changed = True
            
            new_lines.append(line)
        
        if changed:
            new_frontmatter = '\n'.join(new_lines)
            new_content = '---' + new_frontmatter + body
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            rel = os.path.relpath(index_file, knowledge_root)
            fixed += 1
            print(f"  Fixed: {rel}")
        else:
            rel = os.path.relpath(index_file, knowledge_root)
            print(f"  Can't fix: {rel}")
            errors += 1
        continue
    
    # Check if order is a string
    if 'order' in data and isinstance(data['order'], str):
        try:
            data['order'] = int(data['order'])
            # Rebuild frontmatter
            new_frontmatter = yaml.dump(data, default_flow_style=False, allow_unicode=True)
            new_content = '---\n' + new_frontmatter + body
            with open(index_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            rel = os.path.relpath(index_file, knowledge_root)
            fixed += 1
            print(f"  Fixed order: {rel}")
        except:
            pass

print(f"\nFixed {fixed} files, {errors} errors remaining")
