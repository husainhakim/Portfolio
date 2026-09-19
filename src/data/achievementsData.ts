export type AchievementId =
  | "vault_breaker"
  | "identity_thief"
  | "ghosted"
  | "file_shuffler"
  | "master_of_disguise"
  | "seen_the_light"
  | "old_school"
  | "hoarder"
  | "tour_completer"
  | "completionist";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  hint: string;
  iconName:
  | "Unlock"
  | "UserX"
  | "MailX"
  | "Move"
  | "Tag"
  | "SunMoon"
  | "Terminal"
  | "Pin"
  | "Compass"
  | "Crown";
  category: "security" | "exploration" | "customization" | "mastery";
  points: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "vault_breaker",
    title: "Vault Breaker",
    description: "Cracked the security riddle and breached the Personal Vault.",
    hint: "A locked chamber guarded by a riddle. Prove your worth to the gatekeeper.",
    iconName: "Unlock",
    category: "security",
    points: 100,
  },
  {
    id: "identity_thief",
    title: "Identity Thief",
    description: "Attempted to erase my existence by soft-deleting About.md.",
    hint: "Can you really erase someone's existence with a single right-click?",
    iconName: "UserX",
    category: "exploration",
    points: 50,
  },
  {
    id: "ghosted",
    title: "Ghosted",
    description: "Soft-deleted Contact-info.md. Guess we're not staying in touch.",
    hint: "Cut all communications. Leave no forwarding address behind.",
    iconName: "MailX",
    category: "exploration",
    points: 50,
  },
  {
    id: "file_shuffler",
    title: "File Shuffler",
    description: "Reorganized filesystem nodes using drag-and-drop positioning.",
    hint: "Break the default order. Rearrange the furniture in this directory.",
    iconName: "Move",
    category: "customization",
    points: 50,
  },
  {
    id: "master_of_disguise",
    title: "Master of Disguise",
    description: "Assigned a custom alias to a file or folder in the workspace.",
    hint: "Identity is everything. Sometimes, all it takes is a new name.",
    iconName: "Tag",
    category: "customization",
    points: 50,
  },
  {
    id: "seen_the_light",
    title: "Seen the Light",
    description: "Flipped the physical light switch between Light and Dark mode.",
    hint: "Blind yourself with photons, or retreat back into the shadows.",
    iconName: "SunMoon",
    category: "customization",
    points: 25,
  },
  {
    id: "old_school",
    title: "Old School Hacker",
    description: "Engaged the interactive terminal shell in CLI workspace mode.",
    hint: "Real developers don't need GUI.",
    iconName: "Terminal",
    category: "exploration",
    points: 50,
  },
  {
    id: "hoarder",
    title: "Quick Access Hoarder",
    description: "Pinned items to Quick Access until hitting maximum capacity (5 items).",
    hint: "Cram the pinned shortcut shelf until it can hold no more.",
    iconName: "Pin",
    category: "customization",
    points: 75,
  },
  {
    id: "tour_completer",
    title: "Grand Tourer",
    description: "Completed the interactive workstation tour from start to finish.",
    hint: "Walk the guided path across every corner of this workstation.",
    iconName: "Compass",
    category: "exploration",
    points: 100,
  },
  {
    id: "completionist",
    title: "Master of Systems",
    description: "Discovered every hidden secret and unlocked all 9 workspace trophies.",
    hint: "Claim every secret the system has to offer. 100% synchronization required.",
    iconName: "Crown",
    category: "mastery",
    points: 250,
  },
];

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length;
export const NON_META_ACHIEVEMENTS = ACHIEVEMENTS.filter((a) => a.id !== "completionist");

export function getAchievement(id: AchievementId): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
