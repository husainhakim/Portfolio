export interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  status: "Active" | "Completed" | "In Development" | "Research";
  category: "Offensive Security Tool" | "Network Security" | "Forensics & Analysis" | "Backend Systems";
  securityConcepts: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  date: string;
  summary: string;
  problemStatement: string;
  architectureDetails: string[];
  keyFeatures: string[];
  cliUsageExample?: string;
  lessonsLearned: string[];
  futureRoadmap: string[];
  writeupPath?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "file-identifier",
    slug: "file-identifier",
    name: "File Signature Identifier",
    tagline: "Web-based forensics tool for true file type detection and spoofing analysis",
    status: "Completed",
    category: "Forensics & Analysis",
    securityConcepts: [
      "File Signatures (Magic Numbers)",
      "Spoofing & Masquerading Detection",
      "Polyglot File Analysis",
      "Binary Data Parsing",
    ],
    technologies: ["React", "Vite", "Vanilla CSS", "Python", "FastAPI"],
    githubUrl: "https://github.com/husainhakim/FileTypeIdentifier",
    demoUrl: "https://file-sign-identifier.vercel.app/",
    date: "2024",
    summary:
      "A cybersecurity tool designed to identify the true file type of a file by analyzing its 'magic numbers' (file signatures) rather than relying on its file extension. Includes a forensic hex viewer and spoofing detection.",
    problemStatement:
      "In the real world, file extensions are just superficial labels. Attackers exploit this by renaming malicious executables to look like harmless documents. This tool bypasses the extension entirely, reads the raw binary data, and flags any deceptive spoofing attempts.",
    architectureDetails: [
      "Backend Pipeline: Python FastAPI handles file uploads in-memory, reading binary headers safely without disk writes.",
      "Hex Dump Generator: Calculates memory offsets, formats hex pairs, and decodes readable ASCII characters.",
      "Spoofing Logic: Compares detected magic numbers against the user-provided filename extension to programmatically detect spoofing.",
      "Frontend UI: Custom-built, brutalist React frontend designed to look like a true terminal/forensics tool, completely avoiding generic web templates.",
    ],
    keyFeatures: [
      "True File Type Detection using a database of 30+ common file signatures.",
      "Automatic Spoofing Detection alerting users to extension mismatches.",
      "Forensics Hex Viewer displaying a raw hex dump of the file's first 256 bytes.",
      "Asymmetric Forensics-Lab UI designed specifically for security professionals.",
    ],
    lessonsLearned: [
      "Gained hands-on experience parsing raw binary data and formatting hex dumps in Python.",
      "Deepened understanding of how attackers mask files using spoofing and polyglots.",
      "Learned how to connect a modern React/Vite frontend to a Python backend using FormData for file uploads.",
      "Focused on building UI/UX specifically for security tools, reinforcing the technical nature of the application.",
    ],
    futureRoadmap: [
      "Implement YARA rule scanning for advanced payload detection.",
      "Add support for analyzing nested ZIP/Archive files without extracting to disk.",
      "Create a browser extension variant to automatically scan downloads.",
    ],
    writeupPath: "/home/husain/writeups/file-identifier.md",
  },
  {
    id: "network-device-scanner",
    slug: "network-device-scanner",
    name: "CYBER // SONAR (Network Scanner)",
    tagline: "Tactical intranet telemetry appliance with a 60 FPS HTML5 Canvas Sonar Radar",
    status: "Completed",
    category: "Network Security",
    securityConcepts: [
      "Layer 2 ARP Discovery",
      "OUI Hardware Fingerprinting",
      "mDNS & ZeroConf Resolution",
      "Network Telemetry Auditing",
    ],
    technologies: ["Python 3", "FastAPI", "SQLite WAL", "HTML5 Canvas", "Asyncio"],
    githubUrl: "https://github.com/husainhakim/NetworkDeviceScanner",
    date: "2024",
    summary:
      "CYBER // SONAR is a lightweight, zero-dependency, tactical intranet telemetry appliance designed to discover, track, audit, and visualize every physical device active on your local network in real-time.",
    problemStatement:
      "Understanding what is connected to a local network is the first step in network security. Operating systems don't continuously maintain a complete table of all devices, IP leases change dynamically via DHCP, and modern mobile devices intentionally randomize their Wi-Fi MAC addresses to prevent tracking.",
    architectureDetails: [
      "Scanner Engine: Leverages asyncio and parallel ICMP & socket sweeps to force hosts to respond, then parses the kernel ARP cache to capture authentic physical MAC addresses.",
      "Identity Resolution: Uses an offline IEEE OUI lookup database to identify hardware vendors and dns-sd/Bonjour to resolve human-readable device names.",
      "Persistence Layer: Employs SQLite in WAL mode with a custom state-diffing algorithm to track devices across DHCP lease shifts without locking errors.",
      "Frontend Dashboard: Uses a FastAPI REST core to serve a bespoke cyber-themed tactical UI featuring a 60 FPS HTML5 Canvas Sonar Radar.",
    ],
    keyFeatures: [
      "Interactive 60 FPS Sonar Topology Radar mapping devices to concentric range rings.",
      "Device Matrix providing real-time connection status, resolved hostnames, and open ports.",
      "Device Telemetry Inspector for assigning custom nicknames and categorizing hardware.",
      "Real-Time Chronological Event Stream tracking device joins, leaves, and IP changes.",
      "Zero-dependency high-concurrency discovery sweeping a /24 subnet in 1.5 to 3.5 seconds.",
    ],
    cliUsageExample: `# Run the scanner with automatic port detection
$ python3 start.py

# Run on a custom port
$ python3 start.py --port 9000

# Run in headless / server mode (no browser auto-open)
$ python3 start.py --no-browser`,
    lessonsLearned: [
      "Mastered the distinction between Layer 2 (Data Link) and Layer 3 (Network), using physical MAC addresses as robust primary keys.",
      "Learned to detect randomized 'Private Wi-Fi Addresses' by inspecting the U/L bit of the MAC address.",
      "Utilized Multicast DNS (mDNS/Bonjour) to resolve service names without a dedicated local DNS server.",
      "Engineered a SQLite state diffing engine utilizing WAL mode to prevent database locks during high-frequency parallel writes.",
      "Built procedural audio synthesizers and optimized HTML5 Canvas coordinate math for a high-performance UI.",
    ],
    futureRoadmap: [
      "Implement passive packet sniffing for silent device detection.",
      "Integrate automated vulnerability scanning against discovered open ports.",
      "Add custom webhook alerts for unrecognized device connections.",
    ],
    writeupPath: "/home/husain/writeups/network-scanner.md"
  },
  {
    id: "passguard",
    slug: "passguard",
    name: "Password Strength Checker",
    tagline: "Privacy-first, locally-processing web application for password security analysis and entropy estimation",
    status: "Completed",
    category: "Offensive Security Tool",
    securityConcepts: [
      "k-Anonymity Breach Checking",
      "Shannon Entropy Estimation",
      "Pattern & Dictionary Detection",
      "Cryptographically Secure Generation",
      "Local Processing Architecture",
    ],
    technologies: ["React", "Vite", "Tailwind CSS v4", "Python", "FastAPI", "Web Crypto API"],
    githubUrl: "https://github.com/husainhakim/PasswordStrengthChecker",
    demoUrl: "https://password-audit.vercel.app/",
    date: "2024",
    summary:
      "PassGuard is a privacy-first, locally-processing web application designed to analyze password security, estimate entropy, simulate cyber attacks, and generate cryptographically secure passwords.",
    problemStatement:
      "Standard regex-based password meters fail to detect predictable patterns like keyboard walks or dictionary words. Furthermore, sending sensitive passwords to a backend server for analysis breaks the threat model entirely. PassGuard solves this by performing rigorous analysis 100% locally.",
    architectureDetails: [
      "Local Analysis Engine: All password strength, pattern detection, and entropy calculations happen entirely within the browser.",
      "k-Anonymity Integration: Securely checks passwords against the Have I Been Pwned database by locally hashing with SHA-1 and only sending a 5-character prefix.",
      "Pattern Detection Algorithms: Custom logic to flag dictionary words, keyboard walks (qwerty, asdf), sequential characters, and repeated substrings.",
      "Educational Simulator: Built-in interactive attack simulation visualizing brute-force, dictionary, and pattern-based attacks.",
    ],
    keyFeatures: [
      "100% Local Processing ensuring passwords never leave the browser.",
      "Advanced Entropy Estimation calculating both Shannon entropy and effective bit strength.",
      "k-Anonymity Breach Checking against known leaked databases.",
      "Cryptographically Secure Generator using crypto.getRandomValues().",
    ],
    lessonsLearned: [
      "Ensured zero state persistence across reloads requiring careful frontend state management.",
      "Gained hands-on experience using the Web Crypto API for secure generation and hashing.",
      "Optimized pattern detection algorithms to run efficiently against long strings on every keystroke using debouncing.",
      "Implemented a professional security console aesthetic using Tailwind CSS v4 semantic coloring.",
    ],
    futureRoadmap: [
      "Implement multithreaded Web Worker offloading for complex dictionary attack simulations.",
      "Add support for custom localized wordlists for pattern detection.",
      "Introduce advanced zxcvbn-style probabilistic guessing models.",
    ],
  },
];
