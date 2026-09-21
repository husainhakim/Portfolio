export interface TourStep {
  id: string;
  title: string;
  badge?: string;
  description: string;
  targetSelector: string;
  preferredPosition: "top" | "bottom" | "left" | "right" | "center";
  featureTips: string[];
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "navigation",
    title: "Simulated Linux Workstation",
    badge: "Step 1 of 7",
    description:
      "This portfolio functions as an interactive Linux desktop filesystem (/home/husain). Navigate via breadcrumbs, browse directories, or use search to find anything instantly.",
    targetSelector: '[data-tour="breadcrumb-bar"]',
    preferredPosition: "bottom",
    featureTips: [
      "Click any folder in the path bar to jump directly there",
      "Switch between Grid and List view in the ribbon toolbar",
      "Real-time search filters files and folders instantly",
    ],
  },
  {
    id: "quick-access",
    title: "Quick Access & Pinning Gestures",
    badge: "Step 2 of 7",
    description:
      "Keep your most important files within arm's reach. Quick Access supports up to 5 pinned items with rich drag-and-drop gestures.",
    targetSelector: '[data-tour="quick-access-section"]',
    preferredPosition: "bottom",
    featureTips: [
      "Drag any card from the grid into Quick Access to pin it",
      "Right-click any item to toggle 'Add to / Remove from Quick Access'",
      "Drag pinned cards downward to reveal the mobile-style remove drop zone",
    ],
  },
  {
    id: "file-ops",
    title: "Card Reordering & Context Menu",
    badge: "Step 3 of 7",
    description:
      "You have full control over the workstation. Rearrange items, inspect details, rename files, or clean up your workspace.",
    targetSelector: '[data-tour="directory-grid"]',
    preferredPosition: "top",
    featureTips: [
      "Drag and drop cards within folders to reorder them",
      "Right-click any file or folder to Open, Rename, Delete, or Download (.zip)",
      "Click 'Reset' in the Ribbon Toolbar anytime to undo all changes",
    ],
  },
  {
    id: "personal-vault",
    title: "The Personal Vault ('me beyond the resume')",
    badge: "Step 4 of 7",
    description:
      "A locked confidential archive containing Husain's unfiltered personal thoughts, side pursuits, and stories that don't belong on a standard CV.",
    targetSelector: '[data-tour="sidebar-vault-btn"]',
    preferredPosition: "right",
    featureTips: [
      "Answer any 1 of 3 trivia questions about me to unlock",
      "Watch the authentic 3D bank vault door decryption animation",
      "Press ESC anytime to skip the unlock animation",
    ],
  },
  {
    id: "cli-terminal",
    title: "Interactive CLI Terminal Shell",
    badge: "Step 5 of 7",
    description:
      "Prefer a keyboard-driven terminal? Switch to the full simulated Linux shell anytime to run commands against the virtual filesystem.",
    targetSelector: '[data-tour="mode-switch"]',
    preferredPosition: "bottom",
    featureTips: [
      "Press Alt+T or Ctrl+` anywhere to toggle between GUI and CLI",
      "Type 'help' in CLI to see available commands (neofetch, ls, cat, tree)",
      "Filesystem state stays synchronized between GUI and CLI in real time",
    ],
  },
  {
    id: "achievements",
    title: "Trophy System & Hidden Easter Eggs",
    badge: "Step 6 of 7",
    description:
      "Explore, inspect, and hack around to unlock hidden achievements. The trophy icon tracks your progress and unlocks badges as you discover secret features.",
    targetSelector: '[data-tour="trophy-btn"]',
    preferredPosition: "bottom",
    featureTips: [
      "Click the trophy icon in the header anytime to view your achievement showcase",
      "Unlock badges by executing terminal commands, finding secret files, and discovering easter eggs",
      "Completing this tour unlocks the 'Grand Tourer' achievement badge!",
    ],
  },
  {
    id: "shortcuts",
    title: "Keyboard Shortcuts & System Telemetry",
    badge: "Step 7 of 7",
    description:
      "Engineered for desktop power users. Control everything with familiar keyboard shortcuts and check system authentication telemetry.",
    targetSelector: '[data-tour="status-bar"]',
    preferredPosition: "top",
    featureTips: [
      "ESC: Close file viewer or exit modals",
      "Enter / Double Click: Open selected file or folder",
      "Click 'Tips & Features' anytime in the status bar or ribbon to replay this tour",
    ],
  },
];
