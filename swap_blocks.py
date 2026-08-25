import re

with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'r') as f:
    content = f.read()

# Extract the four blocks using regex
exp_match = re.search(r'        \{experienceNode && \([\s\S]*?          </div>\n        \)\}\n', content)
learn_match = re.search(r'        \{learningNode && \([\s\S]*?          </div>\n        \)\}\n', content)
proj_match = re.search(r'        \{projectsNode && \([\s\S]*?          </div>\n        \)\}\n', content)
write_match = re.search(r'        \{writeupsNode && \([\s\S]*?          </div>\n        \)\}\n', content)

if not (exp_match and learn_match and proj_match and write_match):
    print("Error: Could not find all blocks")
    exit(1)

exp_text = exp_match.group(0).replace('styles.bentoTileRow2', 'styles.bentoTileRow3')
learn_text = learn_match.group(0).replace('styles.bentoTileRow2', 'styles.bentoTileRow3')
proj_text = proj_match.group(0).replace('styles.bentoTileRow3', 'styles.bentoTileRow2')
write_text = write_match.group(0).replace('styles.bentoTileRow3', 'styles.bentoTileRow2')

# Now reconstruct the middle part
# Find where the blocks start and end
start_idx = exp_match.start(0)
end_idx = write_match.end(0)

# The new order: proj, write, exp, learn
new_middle = proj_text + "\n" + write_text + "\n" + exp_text + "\n" + learn_text

# Replace comments as well (lazy way: just replace the entire chunk)
# Let's find the exact string from start of comment to end of writeups
full_match = re.search(r'        \{/\* ROW 2:.*?\n[\s\S]*?        \{writeupsNode && \([\s\S]*?          </div>\n        \)\}\n', content)

if full_match:
    new_full = "        {/* ROW 2: PROJECTS (Span 6) & WRITEUPS (Span 6) */}\n" + proj_text + "\n" + write_text + "\n        {/* ROW 3: EXPERIENCE (Span 3), LEARNING (Span 3), BLOGS (Span 3), CONTACT (Span 3) */}\n" + exp_text + "\n" + learn_text
    
    new_content = content[:full_match.start(0)] + new_full + content[full_match.end(0):]
    
    with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Could not find full match")

