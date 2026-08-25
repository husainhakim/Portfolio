with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'r') as f:
    text = f.read()

with open('/Users/husainhakim/cyber/Portfolio/new_block.tsx', 'r') as f:
    new_block = f.read()

import re

# Find the exact block we want to replace
pattern = r'        \{/\* ROW 2: PROJECTS \(Span 6.*?        \{writeupsNode && \([\s\S]*?          </div>\n        \)\}\n'
match = re.search(pattern, text)
if match:
    # We found it, now replace it
    new_text = text[:match.start()] + new_block + "\n" + text[match.end():]
    with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
        f.write(new_text)
    print("Replaced successfully!")
else:
    # Try the other possible pattern (if it's still the old string)
    pattern2 = r'        \{/\* ROW 2: EXPERIENCE \(Span 6.*?        \{writeupsNode && \([\s\S]*?          </div>\n        \)\}\n'
    match2 = re.search(pattern2, text)
    if match2:
        new_text = text[:match2.start()] + new_block + "\n" + text[match2.end():]
        with open('/Users/husainhakim/cyber/Portfolio/src/components/gui/DirectoryGrid.tsx', 'w') as f:
            f.write(new_text)
        print("Replaced successfully! (pattern 2)")
    else:
        print("Could not find the block to replace")
