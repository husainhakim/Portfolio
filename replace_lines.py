with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'r') as f:
    lines = f.readlines()

with open('/Users/husainhakim/cyber/Portfolio/new_block.tsx', 'r') as f:
    new_lines = f.readlines()

lines[277:458] = new_lines

with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
    f.writelines(lines)
print("Replaced lines 277 to 458")
