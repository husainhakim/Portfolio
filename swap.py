import re

with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'r') as f:
    lines = f.readlines()

# find indices
# row 2 comment: 277 (0-indexed)
# row 3 comment: 386
# end of writeups: 457 (after })\n)

start_row2 = 277
start_row3 = 386
end_row3 = 457

row2_lines = lines[start_row2:start_row3]
row3_lines = lines[start_row3:end_row3+1]

# In row3_lines, we want to extract projectsNode and writeupsNode (lines 387-458 of original file, which is index 386 to 457)
# And replace 'bentoTileRow3' with 'bentoTileRow2'
projects_and_writeups_text = "".join(row3_lines).replace('styles.bentoTileRow3', 'styles.bentoTileRow2')
# Change the comment
projects_and_writeups_text = projects_and_writeups_text.replace('ROW 3: PROJECTS (Span 3, Swapped into About place), WRITEUPS (Span 3, Swapped into Experience place), BLOGS (Span 3), CONTACT (Span 3)', 'ROW 2: PROJECTS (Span 6) & WRITEUPS (Span 6)')


# In row2_lines, we want to extract experienceNode and learningNode
# And replace 'bentoTileRow2' with 'bentoTileRow3'
experience_and_learning_text = "".join(row2_lines).replace('styles.bentoTileRow2', 'styles.bentoTileRow3')
# Change the comment
experience_and_learning_text = experience_and_learning_text.replace('ROW 2: PROJECTS (Span 6, Swapped into Experience place) & WRITEUPS (Span 6, Swapped into Learning place)', 'ROW 3: EXPERIENCE (Span 3), LEARNING (Span 3)')
experience_and_learning_text = experience_and_learning_text.replace('ROW 2: EXPERIENCE (Span 6, Swapped into Writeups place) & LEARNING (Span 6)', 'ROW 3: EXPERIENCE (Span 3), LEARNING (Span 3)')

# Construct new array
new_lines = lines[:start_row2] + [projects_and_writeups_text] + [experience_and_learning_text] + lines[end_row3+1:]

with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
    f.writelines(new_lines)
