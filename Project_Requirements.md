# Husain Hakim — Offensive Security Portfolio

## 1. Project Objective

Build a highly polished, professional personal portfolio for **Husain Hakim**, a:

> **Cybersecurity Student | Offensive Security**

The portfolio should communicate a clear interest in **white-hat hacking, ethical hacking, penetration testing, vulnerability research, reconnaissance, exploitation, and security research**.

The defining feature of this portfolio is that it should behave like a **custom cybersecurity workspace / Linux-inspired file manager**.

The portfolio must have two interfaces:

1. **GUI Mode — default**
2. **CLI Mode — optional**

Both interfaces must expose the **same underlying portfolio content and navigation structure**.

The GUI is the primary experience and must be immediately understandable to recruiters and non-technical visitors.

The CLI is an optional alternative interface intended for technically inclined visitors.

---

# 2. Critical Design Principle

DO NOT turn this into a conventional developer portfolio.

Do NOT create:

- Hero → About → Skills → Project Cards → Contact
- Generic landing-page sections
- Generic cybersecurity template aesthetics
- Cyberpunk UI
- Matrix rain
- Neon green hacker effects
- Glowing skulls
- Fake "ACCESS GRANTED" animations
- Excessive terminal windows
- Excessive glassmorphism
- Random 3D objects
- Generic AI-generated dashboard layouts

The filesystem/workspace concept is the **core information architecture**, not merely a visual theme.

The experience should feel like:

> "This is Husain's cybersecurity workspace."

It should feel technically interesting without becoming childish or gimmicky.

---

# 3. Visual Identity

## Overall aesthetic

Create a visual language inspired by:

- Modern Linux desktop environments
- Technical workstations
- Security research environments
- Developer tools
- Editorial technical documentation
- Clean productivity software

But DO NOT directly copy GNOME, KDE, Windows Explorer, macOS Finder, VS Code, or any other existing interface.

Create an original interface.

The design should be:

- Minimal
- Technical
- Sophisticated
- Spacious
- Highly readable
- Professional
- Slightly unconventional
- Functional before decorative

The interface should feel designed by a human designer, not generated from a generic UI template.

---

# 4. Theme System

Implement both:

- Light Mode
- Dark Mode

The user must be able to switch between them.

Do not force light mode for GUI and dark mode for CLI.

Both GUI and CLI must respect the selected global theme.

## Light theme

Use:

- Warm/off-white background
- Dark charcoal typography
- Subtle borders
- Muted gray secondary text
- Dark maroon accent

## Dark theme

Use:

- Deep charcoal / near-black background
- Off-white typography
- Subtle dark borders
- Muted gray secondary text
- Same dark-maroon/red accent

Avoid neon colors.

Avoid excessive gradients.

Avoid pure black everywhere.

The theme switch should be subtle and polished.

Persist the user's theme preference locally.

Respect `prefers-color-scheme` on first visit.

---

# 5. Personal Branding

Display prominently:

**Husain Hakim**

Professional positioning:

**Cybersecurity Student | Offensive Security**

The portfolio should communicate that Husain is developing his skills toward ethical hacking / offensive security.

Do not claim:

- Professional penetration tester
- Red team operator
- Security researcher
- Certified ethical hacker

unless explicitly provided later.

The portfolio should demonstrate progression through actual projects, labs, writeups, and learning.

---

# 6. Root Filesystem

The root of the portfolio should conceptually be:

```text
/home/husain
```

The primary GUI should visually represent this directory.

Initial structure:

```text
/home/husain

├── about/
├── projects/
├── writeups/
├── blogs/
├── learning/
├── experience/
├── contact/
└── resume.pdf
```

This is a **virtual portfolio filesystem**.

Do NOT attempt to access the user's real operating-system filesystem.

Do NOT build an actual shell.

Do NOT build a real file manager.

The filesystem exists only inside the web application.

---

# 7. GUI Mode

GUI mode is the default experience.

The homepage should open directly into the virtual filesystem.

Example conceptual layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ HUSAIN HAKIM                              GUI   CLI   THEME │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ /home/husain                                                │
│                                                             │
│  📁 ABOUT        📁 PROJECTS        📁 EXPERIENCE            │
│                                                             │
│  📁 WRITEUPS     📁 BLOGS           📁 LEARNING              │
│                                                             │
│  📁 CONTACT      📄 RESUME.PDF                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

This is only a conceptual representation.

Create a significantly more polished actual design.

---

# 8. File Manager Navigation

Users should be able to:

- Click directories
- Enter directories
- Return to previous directory
- Use breadcrumbs
- Double-click or single-click consistently
- Open files
- Navigate backward
- Navigate forward where appropriate
- Return to `/home/husain`

The breadcrumb should reflect the current virtual path.

Example:

```text
/home/husain/projects/network-scanner
```

The navigation should feel fast and natural.

Do not make users perform unnecessary interactions just to access content.

---

# 9. Projects Directory

Create:

```text
/home/husain/projects/
```

Populate it initially with Husain's existing projects:

```text
password-audit/
network-device-scanner/
file-signature-detector/
```

Use the real project information provided in the project data.

Do not invent technical claims.

Each project should have a professional project detail view containing:

- Project name
- Short description
- Purpose
- Technologies
- Security concepts
- Current status
- GitHub link
- Writeup link when available
- Screenshots/demo when available
- Lessons learned
- Future improvements

Projects should be presented as evidence of progression.

Do not falsely rebrand existing projects as penetration-testing projects.

Future offensive-security projects can be added later without restructuring the application.

---

# 10. Writeups Directory

Create:

```text
/home/husain/writeups/
```

Writeups must be stored as **Markdown/MDX content files** inside the repository.

Recommended structure:

```text
content/
└── writeups/
    ├── linux/
    ├── network/
    ├── web/
    ├── privilege-escalation/
    └── ctf/
```

The system should automatically render these into polished technical articles.

Each writeup should support:

- Title
- Category
- Date
- Tags
- Reading time
- Table of contents
- Markdown/MDX content
- Code blocks
- Command blocks
- Images
- Links
- Previous/next navigation

Recommended writeup structure:

```text
Objective
Background
Reconnaissance
Enumeration
Initial Access
Exploitation
Privilege Escalation
Analysis
Root Cause
Mitigation
Lessons Learned
Future Improvements
```

Not every writeup must contain every section.

Do not force a rigid template when it doesn't make sense.

---

# 11. Blogs Directory

Create:

```text
/home/husain/blogs/
```

Husain will primarily write blogs on Medium.

Therefore the portfolio should NOT duplicate full Medium articles.

Instead, create blog entries containing:

- Title
- Short description
- Date
- Topics
- Medium link
- Optional thumbnail/image
- Reading time if supplied

Clicking the blog should open the Medium article.

Structure the data so new Medium posts can easily be added later.

Do NOT implement Medium API/RSS integration in version 1 unless necessary.

---

# 12. Learning Directory

Create:

```text
/home/husain/learning/
```

This should represent Husain's progression toward offensive security.

The learning path should visually communicate:

```text
Foundations
    ↓
Linux
    ↓
Networking
    ↓
Reconnaissance
    ↓
Enumeration
    ↓
Web Security
    ↓
Exploitation
    ↓
Privilege Escalation
    ↓
Active Directory
    ↓
Advanced Offensive Security
```

Do NOT pretend all of these are completed.

Use statuses such as:

- Completed
- Currently Learning
- Next
- Planned

The learning path should eventually be expandable.

Whenever possible, connect learning topics to:

- Projects
- Writeups
- Blogs

This creates the relationship:

```text
LEARN → BUILD → TEST → DOCUMENT
```

---

# 13. Experience Directory

Create:

```text
/home/husain/experience/
```

Present professional experience in a clean technical format.

Do not invent experience.

Use only the information supplied in the project data or later provided by Husain.

---

# 14. About Directory

Create:

```text
/home/husain/about/
```

This should explain:

- Who Husain is
- Current education
- Interest in cybersecurity
- Interest in white-hat / ethical hacking
- Offensive-security direction
- Technical areas being explored

Keep it professional and concise.

Do not write exaggerated claims.

Avoid generic phrases such as:

> "passionate tech enthusiast"

unless they actually contribute meaningful information.

---

# 15. Contact Directory

Create:

```text
/home/husain/contact/
```

Current contact information:

Email:

```text
husain.m.hakim.533@gmail.com
```

GitHub:

```text
https://github.com/husainhakim
```

LinkedIn:

```text
https://www.linkedin.com/in/husainhakim/
```

Present these cleanly.

Email should use a `mailto:` link.

GitHub and LinkedIn should open externally.

---

# 16. Resume

The portfolio will contain:

```text
/home/husain/resume.pdf
```

The implementation must assume that Husain will place the actual `resume.pdf` file in the appropriate public/static directory.

Do not fabricate a resume.

When the file exists:

- Display it as a PDF document
- Allow it to be opened
- Provide a clear way to access it
- Make it accessible from the root filesystem

Do not create a fake PDF.

---

# 17. CLI Mode

CLI mode is OPTIONAL and must be accessible through a clear GUI/CLI toggle.

It should feel like the same virtual portfolio filesystem represented through a terminal.

Example:

```text
husain@portfolio:~$ help
```

Initial supported commands:

```text
help
ls
cd
pwd
cat
clear
whoami
tree
history
projects
writeups
blogs
learning
experience
resume
contact
```

Do NOT implement:

```text
sudo
chmod
grep
find
nmap
ssh
```

or other fake system commands in version 1.

Those can be added later.

---

# 18. CLI Behavior

The CLI must maintain a current virtual working directory.

Example:

```text
husain@portfolio:~$ cd projects

husain@portfolio:~/projects$ ls

network-device-scanner/
password-audit/
file-signature-detector/
```

Then:

```text
husain@portfolio:~/projects$ cd network-device-scanner

husain@portfolio:~/projects/network-device-scanner$
```

The CLI and GUI must use the same underlying navigation/content model.

This is extremely important.

---

# 19. GUI ↔ CLI State Synchronization

If a user is currently browsing:

```text
/home/husain/projects/network-device-scanner
```

and switches from GUI → CLI, the CLI should open at:

```text
husain@portfolio:~/projects/network-device-scanner$
```

If the user is in CLI mode at:

```text
~/writeups/linux
```

and switches back to GUI mode, the GUI should display:

```text
/home/husain/writeups/linux
```

Both interfaces are two views of the SAME virtual filesystem.

Do not implement them as independent navigation systems.

---

# 20. CLI Interaction Quality

The CLI should support:

- Command history
- Arrow-key history
- Up/down command navigation
- Tab completion where practical
- Clear error messages
- Unknown command handling
- Invalid path handling
- Responsive terminal input
- Keyboard accessibility

Example:

```text
husain@portfolio:~$ cd does-not-exist

cd: no such directory: does-not-exist
```

Unknown command:

```text
husain@portfolio:~$ hello

Command not found: hello

Type 'help' to see available commands.
```

Keep errors professional.

---

# 21. Mobile Experience

The portfolio must be fully responsive.

Do NOT simply shrink the desktop file manager.

Desktop:

- Grid-based file manager
- Breadcrumbs
- Toolbar
- Larger navigation areas

Mobile:

- Vertical directory listing
- Touch-friendly targets
- Simplified toolbar
- Compact breadcrumbs
- Bottom or top GUI/CLI switch
- Responsive file previews
- Proper mobile CLI experience

The mobile version should still clearly feel like the same cybersecurity workspace.

CLI mode on mobile should become a proper full-screen or near-full-screen terminal experience with a mobile-friendly input area.

Do not create tiny desktop UI elements that require zooming.

Minimum touch target should be approximately 44px.

---

# 22. GUI / CLI Toggle

Provide a persistent but unobtrusive toggle:

```text
GUI   CLI
```

It should be available in the primary navigation/header.

The active mode must be visually obvious.

Switching modes should be smooth but fast.

Do not create an unnecessary loading screen.

---

# 23. Motion & Animation

Use moderate animation.

Desired:

- Folder opening transition
- Subtle page transitions
- Hover states
- Smooth breadcrumb transitions
- CLI command appearance
- Small interface transitions
- Modal open/close animations

Avoid:

- Excessive parallax
- Large animated backgrounds
- Constant floating objects
- Matrix effects
- Cursor trails
- Excessive terminal typing
- Long loading animations

The interface should feel fast.

Animation should communicate state changes, not exist merely to show off.

---

# 24. Typography

Use a strong modern sans-serif for normal UI.

Use a monospace font selectively for:

- CLI
- File paths
- Technical metadata
- Commands
- Code
- Security terminology where appropriate

Do NOT make the entire website monospace.

Typography should be highly readable.

---

# 25. Accessibility

Implement proper:

- Keyboard navigation
- Focus states
- Semantic HTML
- ARIA labels where necessary
- Accessible buttons
- Sufficient color contrast
- Reduced-motion support
- Screen-reader-friendly navigation

The CLI must not be the only way to access information.

---

# 26. Performance

Prioritize performance.

Avoid unnecessary dependencies.

Use:

- Next.js optimizations
- Lazy loading where appropriate
- Optimized images
- Static generation for content
- Minimal client-side JavaScript where possible

The portfolio should feel instant.

Do not introduce a huge animation library if native CSS can handle the animation.

---

# 27. SEO

Implement:

- Proper page titles
- Meta descriptions
- Open Graph metadata
- Twitter/X metadata
- Semantic headings
- Canonical URLs
- Sitemap
- Robots.txt

Root metadata should represent:

**Husain Hakim — Cybersecurity Student | Offensive Security**

Do not stuff keywords.

---

# 28. Architecture

Use a clean architecture that separates:

```text
UI
↓
Virtual Filesystem
↓
Content
```

The virtual filesystem should not contain huge amounts of hardcoded JSX.

Create a structured data model for:

- Directories
- Files
- Projects
- Writeups
- Blogs
- Learning items
- Experience
- Contact information

GUI and CLI should consume the same model.

This is a major requirement.

---

# 29. Content Architecture

Recommended:

```text
app/
components/
content/
    projects/
    writeups/
    blogs/
    learning/
data/
    filesystem/
public/
    resume.pdf
```

Use MDX/Markdown for long-form content.

Keep navigation metadata separate from content when appropriate.

The system should make adding a new project or writeup straightforward.

---

# 30. Current Project Data

Start with these projects:

### Password Audit

Use the actual existing Password Audit project information.

Do not invent functionality that doesn't exist.

### Network Device Scanner

Use the existing concept:

A network discovery/security tool designed to identify devices on a local network and provide useful information about discovered hosts.

Only describe functionality that actually exists in the implementation.

### File Signature Detector

Use the existing magic-number/file-signature project.

Describe it as a tool for identifying file types based on their actual file signatures rather than trusting extensions.

Again, do not fabricate completed features.

---

# 31. Future Expansion

The architecture must make it easy to add future offensive-security projects such as:

```text
recon-tool/
web-security-lab/
linux-enumeration-tool/
privilege-escalation-lab/
authentication-security-lab/
network-enumeration-tool/
```

These are placeholders for future work only.

Do not create fake projects or fake writeups.

---

# 32. Security Positioning

The portfolio should communicate interest in:

- White-hat hacking
- Ethical hacking
- Offensive security
- Penetration testing
- Reconnaissance
- Enumeration
- Vulnerability discovery
- Exploitation
- Privilege escalation
- Security tooling
- Security research

However, do not falsely claim professional pentesting experience.

The portfolio should communicate:

> learning + building + testing + documenting

rather than:

> pretending to already be an experienced offensive-security professional.

---

# 33. Content Safety / Authorization

All offensive-security content represented by the portfolio should be framed around:

- Authorized testing
- Personal labs
- CTFs
- Intentionally vulnerable environments
- Systems where permission has been granted

The site should not encourage unauthorized access.

---

# 34. Easter Eggs

DO NOT implement Easter eggs in version 1.

The architecture should make them possible later.

Potential future functionality may include hidden commands or directories, but do not add them now.

---

# 35. What NOT To Do

Do not:

- Invent achievements
- Invent certifications
- Invent work experience
- Invent projects
- Invent security findings
- Invent blog posts
- Invent writeups
- Add fake statistics
- Add fake GitHub stars
- Add fake skill percentages
- Add "98% Linux" progress bars
- Add unnecessary dashboards
- Add unnecessary charts
- Add fake terminal hacking animations
- Add Matrix rain
- Add neon green cyberpunk styling
- Turn every element into a glowing card
- Use generic stock imagery
- Make the interface look AI-generated

If information is missing, create a clean placeholder/data structure rather than inventing content.

---

# 36. UX Philosophy

The portfolio should feel like a **real product**.

Every interaction should have a reason.

The filesystem metaphor should make navigation more memorable, not more difficult.

A visitor should be able to understand the site within seconds.

A recruiter should be able to find:

- About
- Projects
- Experience
- Resume
- Contact

without knowing Linux.

A technical visitor should discover:

- CLI mode
- Filesystem navigation
- Writeups
- Learning path
- Technical blogs

and feel rewarded for exploring.

The portfolio should be approachable to beginners while containing depth for technical users.

---

# 37. First-Visit Experience

Do NOT add a long cinematic boot sequence.

The user should reach the portfolio quickly.

If a tiny transition is used, keep it under a fraction of a second and make it skippable.

The first screen should immediately show:

**Husain Hakim**

**Cybersecurity Student | Offensive Security**

and the virtual filesystem.

---

# 38. Final Quality Standard

Before considering the project complete, verify:

- GUI is the default
- CLI is optional
- GUI and CLI share the same navigation state
- Light/dark mode works
- Desktop works
- Mobile works
- File navigation works
- Breadcrumbs work
- CLI commands work
- Markdown/MDX writeups render correctly
- Blog links work
- Resume works when `resume.pdf` is added
- GitHub link works
- LinkedIn link works
- Email link works
- Keyboard navigation works
- No fake content exists
- No generic cybersecurity template styling exists
- No unnecessary animations exist
- Performance is good
- SEO metadata exists

---

# 39. Definition of Success

The finished portfolio should make someone think:

> "I've never seen a portfolio presented like this."

But after exploring it, they should also think:

> "This isn't just a gimmick. The interface reflects how this person works with technical systems, and there is actual security work behind it."

That is the goal.

Build the experience around:

**LEARN → BUILD → TEST → DOCUMENT**

Do not sacrifice usability for novelty.

Do not sacrifice content quality for visual effects.

Do not redesign the core concept into a conventional portfolio.

The **cybersecurity workspace / virtual filesystem** is the identity of the product.