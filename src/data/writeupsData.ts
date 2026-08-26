export interface WriteupItem {
  id: string;
  slug: string;
  category: "linux" | "network" | "web" | "privilege-escalation" | "ctf";
  categoryLabel: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Informational";
  targetSystem: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
  tableOfContents: string[];
  markdownContent?: string;
  content?: {
    objective: string;
    background: string;
    reconnaissance: string;
    enumeration: string;
    vulnerabilityAnalysis: string;
    exploitationSteps: {
      stepNumber: number;
      title: string;
      command?: string;
      explanation: string;
      output?: string;
    }[];
    postExploitation: string;
    mitigation: string[];
    rootCause: string;
    lessonsLearned: string[];
  };
}

export const WRITEUPS_DATA: WriteupItem[] = [
  {
    id: "file-identifier-writeup",
    slug: "file-identifier",
    category: "linux",
    categoryLabel: "Forensics & Reverse Engineering",
    title: "File Type Identifier: Technical Postmortem",
    difficulty: "Medium",
    targetSystem: "Linux CLI",
    date: "2026-08-25",
    readTime: "3 min read",
    tags: ["FORENSICS", "MAGIC NUMBERS", "C++"],
    summary: "A deep dive into why relying on file extensions is a security flaw, and how I built a custom magic number identifier from scratch.",
    tableOfContents: [
      "The Problem: Extension Spoofing",
      "Why Magic Numbers, Not Extensions",
      "The Signature Database Tradeoff",
      "Where Binary Handling Got Messy",
      "What I'd Do Differently",
      "The Actual Takeaway"
    ],
    markdownContent: `## The Problem: Extension Spoofing

In the real world, file extensions are essentially meaningless labels. Operating systems like Windows heavily rely on them to determine how a file should be opened, which creates a massive blind spot. Threat actors frequently exploit this by taking a malicious executable (\`payload.exe\`), renaming it to something benign (\`invoice.pdf\`), and deploying it via phishing campaigns. 

To the untrained eye—and unfortunately, to many naive email filters and endpoint security tools—it looks like a harmless document. When the victim double-clicks it, Windows simply executes the malware. To counter this, defenders cannot trust the filename; they must look at the actual bytes.

## Why Magic Numbers, Not Extensions

The starting assumption behind this project was simple: extensions are metadata, not truth. I wanted to build something that reads the actual bytes instead of trusting the filename, the same way \`file\` on Linux does, but with a forensics-lab presentation layered on top so the tool felt purpose-built rather than like a script with a UI bolted on.

## The Signature Database Tradeoff

The first real design decision was how to store and match file signatures. I could have pulled in an existing Python library that already maps magic numbers to file types — there are a few solid ones. I chose to hand-build a signature database of 30+ common formats instead, mapping raw hex sequences to file types myself.

That was slower to build and definitely less comprehensive than a mature library would be — I'm covering the common cases (PDF, PNG, ZIP, ELF, MZ, etc.), not the long tail. But it meant I actually understood every signature I was matching against, instead of treating file detection as a black box I called into. For a security tool specifically, I wanted to know exactly what triggered a "spoofed" flag rather than trusting a dependency's internal logic I hadn't read.

## Where Binary Handling Got Messy

Reading files in binary mode sounds trivial until you're building the hex dump view. Formatting offsets, aligning hex pairs, and rendering the ASCII sidebar (with non-printable bytes masked) took more iteration than I expected — mostly around edge cases like files shorter than the byte window I was reading, and getting the offset formatting to actually line up visually instead of drifting after a few rows.

I also made a deliberate choice to analyze files entirely in memory rather than writing them to disk first. That was partly a performance decision and partly a security one — a forensics tool that writes untrusted uploads to disk before inspecting them is introducing exactly the kind of risk it's supposed to help catch. In hindsight, that constraint shaped a lot of the backend logic more than I initially planned for.

## What I'd Do Differently

Polyglot detection is thinner than I'd like. Right now the tool can flag a basic extension mismatch, but true polyglot files (valid in multiple formats simultaneously — a ZIP appended to an executable, for example) need more than a single signature check at offset zero. I understand the concept better now than when I started, but the current implementation only scratches the surface of actually detecting them reliably.

Test coverage was an afterthought. I built and validated this mostly by hand — dragging in real files and checking the output looked right. That worked for a solo project on a deadline, but it's not how I'd want to ship something people might actually rely on for a real spoofing check. A proper test suite with known-good and deliberately malformed sample files is the obvious next step.

The UI came before the edge cases. I'm genuinely happy with how the forensics-lab aesthetic turned out — it does what I wanted, which was make the tool feel like something built for the job rather than a generic upload form. But I spent real time on that visual layer before hardening the backend against malformed or truncated files, and a couple of early bugs (crashes on files under my byte-read threshold) were a direct result of that ordering. Next time, correctness first, presentation second.

## The Actual Takeaway

This project taught me more about the gap between "detecting something" and "detecting something reliably" than I expected going in. Matching a magic number is easy. Matching it correctly, handling the edge cases, and being honest about what the tool can't catch yet (polyglots, more exotic formats, deliberately crafted evasions) is the harder and more interesting problem — and it's the part I want to keep pushing on.`
  },
  {
    id: "network-scanner-writeup",
    slug: "network-device-scanner",
    category: "network",
    categoryLabel: "Network Security & Telemetry",
    title: "CYBER // SONAR: Technical Postmortem",
    difficulty: "Medium",
    targetSystem: "Local Intranet",
    date: "2026-08-25",
    readTime: "4 min read",
    tags: ["PYTHON", "ARP", "ASYNCIO", "SQLITE"],
    summary: "Reflections on building a tactical intranet telemetry appliance, managing MAC addresses without root privileges, and SQLite concurrent loads.",
    tableOfContents: [
      "Why MAC Addresses, Not IPs",
      "Getting MAC Addresses Without Root",
      "The Randomized MAC Problem",
      "Concurrency Was Not Optional",
      "SQLite Under Concurrent Load",
      "What I'd Do Differently",
      "The Actual Takeaway"
    ],
    markdownContent: `## Why MAC Addresses, Not IPs

The first real decision on this project happened before I wrote any scanning code — deciding what a "device" actually is. My first instinct was to key everything off IP address, since that's what you see when you check your router's device list. That's wrong, and I only realized it once I started testing: DHCP leases shift, so a phone that's 192.168.1.15 today can be 192.168.1.30 tomorrow. If IP is your primary key, the same physical device silently becomes a "new" device in your database every time its lease renews, and your history just fragments.

Switching the primary key to MAC address fixed that, but it meant rebuilding the discovery logic around Layer 2, not Layer 3 — which is a meaningfully different problem than I'd originally scoped.

## Getting MAC Addresses Without Root

The harder constraint I set for myself was doing this without requiring root or raw sockets. Most ARP scanning tools assume elevated privileges because they're crafting raw ARP packets directly. I didn't want this to require sudo to run a home network scan.

The workaround was indirect: fire parallel ICMP pings and TCP socket probes across all 254 addresses in the subnet, and let the operating system's own networking stack do the ARP resolution for me as a side effect of routing those probes. Then I read the kernel's ARP table (\`arp -a\` / \`/proc/net/arp\`) afterward instead of building my own ARP requests. It works, but it's a workaround, not a clean solution — it depends on the OS populating that table reliably, which isn't something I control directly.

## The Randomized MAC Problem

I didn't anticipate this going in: modern phones (iOS 14+, Android 10+, recent macOS) intentionally randomize their MAC address per network specifically to prevent tracking — which is exactly the kind of tracking this tool does. So a meaningful fraction of devices on any real network show up with a MAC that's deliberately not tied to their actual hardware identity.

Detecting this required understanding a very specific bit — the U/L (Universal/Local) bit in the first byte of a MAC address. If it's set, the address is locally administered, i.e., randomized, not manufacturer-assigned. Once I could detect that, I could at least label these correctly instead of misidentifying them against my OUI vendor table. But detection isn't resolution — a randomized MAC still doesn't tell you which iPhone it is. That's where I leaned on mDNS/Bonjour service discovery to recover human-readable names like "Husain's MacBook Air" as a second, independent signal, since the MAC alone wasn't going to get me there.

## Concurrency Was Not Optional

Scanning 254 addresses sequentially, even at a 1-second timeout each, is over 4 minutes per sweep — completely unusable for anything that's supposed to feel real-time. Moving to asyncio with a ThreadPoolExecutor cut that to 1.5–3.5 seconds, which was the difference between a toy script and something that actually functions like a dashboard.

The tradeoff was concurrency bugs I hadn't dealt with before — specifically, overlapping scans competing for the same sockets and stepping on each other's database writes. I added an \`asyncio.Lock()\` around scan execution to serialize sweeps, which is a blunt fix (you lose true overlapping scans) but a correct one, and correctness mattered more than squeezing out more speed at that point.

## SQLite Under Concurrent Load

Default SQLite locks the entire file on write, which becomes a real problem the moment you have a background auto-scan job writing while the API is also trying to read. I hit \`database is locked\` errors early and fixed it by switching to WAL mode (\`PRAGMA journal_mode = WAL\`), which allows concurrent reads during writes. This was one of the smaller changes in terms of lines of code and one of the more important ones in terms of the app actually being usable continuously rather than just for single manual scans.

## What I'd Do Differently

The Layer 2 constraint limits deployment more than I initially accounted for. Because this depends on reading the local ARP table and doing subnet-local socket probing, it fundamentally can't run on serverless infrastructure like Vercel — it needs to run on the actual physical network, or at minimum in a container with host networking. I designed around this correctly, but I underestimated early on how much that one constraint would shape every deployment decision downstream.

Test coverage came late relative to how stateful this system is. The state-diff engine (detecting joins, leaves, and IP changes between scans) is exactly the kind of logic that's easy to get subtly wrong — off-by-one errors in "missing from this sweep" logic, or race conditions between a scan finishing and a manual purge triggering. I wrote tests, but retroactively, after the core logic existed rather than test-driving the diff engine itself. I'd build the tests alongside the diffing logic next time, not after.

The polar-coordinate radar visualization was fun but not rigorously validated. Mapping IP octet and latency to radius/angle looks compelling on screen, but I didn't spend much time validating that the visual mapping is actually meaningful vs. just aesthetically pleasing — it's closer to a stylistic choice than a data-accurate representation, and I should be honest about that distinction rather than implying the radar position encodes something more precise than it does.

## The Actual Takeaway

This project taught me that "scan a network" sounds like one problem but is actually four or five loosely related ones stacked together — physical layer discovery, hardware identity resolution, privacy-aware MAC handling, concurrent state management, and real-time visualization. Each of those had its own wrong-turn-then-correction moment, and the parts I'm most confident in now (WAL mode, the MAC-as-primary-key decision, the ARP-cache-warming approach) are the ones I got wrong first and had to actually understand before fixing.`
  },
  {
    id: "quickref-writeup",
    slug: "quickref",
    category: "linux",
    categoryLabel: "CLI Tooling & Python",
    title: "QuickRef: Technical Postmortem",
    difficulty: "Informational",
    targetSystem: "Linux / macOS Terminal",
    date: "2026-08-25",
    readTime: "5 min read",
    tags: ["PYTHON", "CLI", "ANSI", "PACKAGING"],
    summary: "How I built a zero-dependency terminal command reference tool, why raw ANSI beats every pretty-printing library, and what Python packaging actually teaches you about import resolution.",
    tableOfContents: [
      "The Problem: Context-Switching Kills Flow",
      "Why Not Just Use tldr?",
      "The Real Challenge: Making a Terminal Readable",
      "Raw ANSI vs. Libraries Like Rich",
      "The Packaging Problem Nobody Warns You About",
      "The JSON Data Layer Decision",
      "What I'd Do Differently",
      "The Actual Takeaway"
    ],
    markdownContent: `## The Problem: Context-Switching Kills Flow

There's a specific kind of frustration that accumulates when you're deep in a terminal session — you're mid-command, halfway through piping something together — and you forget the exact flag syntax for \`chmod\`, or which \`netstat\` option shows listening ports. So you stop. You open a browser. You type the query. You wait for Google to load. You scan a Stack Overflow page, ignore three ads, find the answer in a comment, and then try to carry that context back into what you were doing.

It sounds minor. After the fifth or sixth time in a session, it's not. That dead time and context-shift is real, and I wanted to eliminate it entirely.

## Why Not Just Use tldr?

\`tldr\` is a good tool. But it's built for general coverage rather than the specific things I was actively learning. When I was going through Linux fundamentals, networking basics, and Git workflows simultaneously, I wanted a reference that matched my current knowledge gaps — not a pre-packaged summary built for an imagined generic user.

More importantly, I wanted to understand what I was looking up. The QuickRef data layer is hand-authored. Writing each command entry myself means I actually have to know what every field means — flags, use-cases, examples. It's a study tool as much as a reference tool, and \`tldr\` can't be that because I didn't build it.

## The Real Challenge: Making a Terminal Readable

The lookup logic itself is not interesting — it's a dictionary key match against a JSON file. The interesting problem was the output. When you dump structured data to a terminal naively, you get a wall of noise. Everything the same color, no visual hierarchy, no way to scan it at a glance.

The goal was output that could be read in under three seconds. Name at the top. Description. Flags scannable in a column. Examples visually separated from explanations. That meant building a real formatter, not just \`print()\`-ing fields in order.

## Raw ANSI vs. Libraries Like Rich

The obvious move here is to import \`rich\` or \`colorama\` and use their formatting primitives. I specifically chose not to do that, for two reasons.

First, the dependency story. QuickRef's whole value is that it runs anywhere, immediately, after a \`pip install\`. Adding a dependency means adding a thing that can be missing, or out of date, or version-conflicting with something else in the environment. The standard library only approach eliminates an entire class of "it worked on my machine" problems.

Second, I wanted to understand what those libraries are actually doing. ANSI escape codes are not complicated — they're just specific byte sequences the terminal interprets as formatting instructions: \`\\033[1m\` for bold, \`\\033[0m\` to reset, \`\\033[32m\` for green. Writing them directly means I control exactly what happens and why. I built a small set of helper functions — \`bold()\`, \`dim()\`, \`accent()\`, \`code()\` — that wrap strings in the right escape sequences, and that's the entire "formatting library."

The harder part was whitespace. Padding columns so they line up. Choosing when to add blank lines and when not to. Getting indentation levels right so the visual hierarchy is obvious without being loud. That's not code — that's taste, and it required more iteration than the actual string formatting.

## The Packaging Problem Nobody Warns You About

This was the most genuinely surprising part of the project. Getting \`quickref\` to run as a global command — not \`python quickref.py\`, but just \`quickref\` from anywhere in the filesystem — sounds like it should be a one-liner. It's not.

The problem is how Python resolves paths to package data. During development, when you run the script directly from the project folder, \`__file__\` gives you a path that's relative to your current directory, and \`commands.json\` is sitting right next to the script. Everything works.

After \`pip install\`, the script is installed to something like \`/usr/local/bin/quickref\` and the JSON data is sitting in a completely different location inside \`site-packages\`. If your code loads the data file with a path relative to the working directory — \`open("commands.json")\` — it breaks immediately because the working directory is wherever the user happens to be when they type \`quickref\`, not where the package was installed.

The fix is \`importlib.resources\` (or \`pkg_resources\` in older Python). You declare the JSON as package data in \`setup.cfg\`, tell setuptools to include it in the installed package, and load it using \`importlib.resources.files(__package__).joinpath("commands.json").read_text()\`. That resolves the path relative to the installed package, not the working directory.

That's a small fix. But getting there meant understanding the difference between *developing* a Python package and *installing* one — a distinction that's completely invisible until you get it wrong.

## The JSON Data Layer Decision

Storing commands as JSON rather than in a database or a Python dict was deliberate. JSON is human-readable, which means the data layer is also the authoring interface. Adding a new command means opening \`commands.json\` and writing a new object. No schema migrations. No ORM. No \`INSERT INTO\`. The data and the format are both trivially auditable.

The tradeoff is that search is naive — it's a linear scan over every entry for a substring match. For 50–100 commands, this is instant. If the dataset ever grew to thousands of entries, I'd need to rethink it. For the scope this tool is designed for, the tradeoff is completely correct.

## What I'd Do Differently

The search is too literal. If you type \`quickref search "file permissions"\`, you only get results where "file permissions" appears as a substring in the entry. Concept-level search — where "permissions" returns \`chmod\`, \`chown\`, \`umask\`, and \`ls -l\` because they're semantically related — is much more useful and not much harder to build with a pre-tagged taxonomy. That's the obvious next iteration.

The data authoring is also more friction than it needs to be. I wrote every command entry by hand, which was fine as a study exercise but doesn't scale well if I want to add a whole new domain quickly. A small CLI tool to scaffold new entries — prompting for name, description, flags, examples — would make the data layer much easier to extend.

## The Actual Takeaway

QuickRef ended up teaching me more about Python's module system and packaging than I expected when I started. The lookup logic took an afternoon. The formatter took a day of iteration. But the packaging problem — getting it to actually work as a proper installed CLI tool rather than a script you run from its own directory — that one required me to properly understand how Python resolves imports and data files at runtime.

The lesson underneath all of it: **the boring infrastructure problems are usually where the real learning is.** The formatter is what you see. The packaging is what makes it actually work.`
  }
];
