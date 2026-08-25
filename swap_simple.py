with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'r') as f:
    lines = f.readlines()

# Let's verify line ranges (0-indexed)
# 278 is index 277: {/* ROW 2: PROJECTS (Span 6, Swapped into Experience place) & WRITEUPS (Span 6, Swapped into Learning place) */}
# 279 is index 278: {experienceNode && (
# 340 is index 339:         )}
# 342 is index 341: {learningNode && (
# 385 is index 384:         )}
# 387 is index 386: {/* ROW 3: ... */}
# 388 is index 387: {projectsNode && (
# 422 is index 421:         )}
# 424 is index 423: {writeupsNode && (
# 458 is index 457:         )}

# Experience block: 278 to 340 (index 278:340) -> wait, index 278 to 339 included means lines[278:340]
exp_lines = lines[278:340]
# Learning block: 341 to 385
learn_lines = lines[341:385]
# Projects block: 387 to 422
proj_lines = lines[387:422]
# Writeups block: 423 to 458
write_lines = lines[423:458]

# Change classes
exp_text = "".join(exp_lines).replace("styles.bentoTileRow2", "styles.bentoTileRow3")
learn_text = "".join(learn_lines).replace("styles.bentoTileRow2", "styles.bentoTileRow3")
proj_text = "".join(proj_lines).replace("styles.bentoTileRow3", "styles.bentoTileRow2")
write_text = "".join(write_lines).replace("styles.bentoTileRow3", "styles.bentoTileRow2")

# Reconstruct
row2_comment = "        {/* ROW 2: PROJECTS (Span 6, Swapped into Experience place) & WRITEUPS (Span 6, Swapped into Learning place) */}\n"
row3_comment = "        {/* ROW 3: EXPERIENCE (Span 3), LEARNING (Span 3), BLOGS (Span 3), CONTACT (Span 3) */}\n"

new_content = "".join(lines[:277]) + row2_comment + proj_text + "\n" + write_text + "\n" + row3_comment + exp_text + "\n" + learn_text + "".join(lines[458:])

with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
    f.write(new_content)

print("Swapped successfully")
