import sys

with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'r') as f:
    lines = f.readlines()

# Verify where things are
for i, line in enumerate(lines):
    if "ROW 2: " in line:
        print(f"Row 2 comment at {i}")
    if "{experienceNode" in line:
        print(f"experienceNode at {i}")
    if "{projectsNode" in line:
        print(f"projectsNode at {i}")

with open('/Users/husainhakim/cyber/Portfolio/new_block.tsx', 'r') as f:
    new_block_lines = f.readlines()

# Instead of using hardcoded numbers, let's find the boundaries dynamically
start_idx = -1
for i, line in enumerate(lines):
    if "ROW 2: " in line and start_idx == -1:
        start_idx = i

end_idx = -1
for i, line in enumerate(lines):
    if "{blogsNode && (" in line and end_idx == -1:
        end_idx = i

if start_idx != -1 and end_idx != -1:
    lines = lines[:start_idx] + new_block_lines + lines[end_idx:]
    with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
        f.writelines(lines)
    print(f"Successfully replaced from {start_idx} to {end_idx}")
else:
    print("Failed to find boundaries")
