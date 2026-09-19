import React from "react";
import {
  Unlock,
  UserX,
  MailX,
  Move,
  SunMoon,
  Terminal,
  Pin,
  Compass,
  Crown,
  Lock,
  Trophy,
} from "lucide-react";
import { Achievement } from "@/data/achievementsData";

interface AchievementIconProps {
  name: Achievement["iconName"];
  size?: number;
  className?: string;
  isLocked?: boolean;
}

export function AchievementIcon({
  name,
  size = 20,
  className,
  isLocked = false,
}: AchievementIconProps) {
  if (isLocked) {
    return <Lock size={size} className={className} />;
  }

  switch (name) {
    case "Unlock":
      return <Unlock size={size} className={className} />;
    case "UserX":
      return <UserX size={size} className={className} />;
    case "MailX":
      return <MailX size={size} className={className} />;
    case "Move":
      return <Move size={size} className={className} />;
    case "SunMoon":
      return <SunMoon size={size} className={className} />;
    case "Terminal":
      return <Terminal size={size} className={className} />;
    case "Pin":
      return <Pin size={size} className={className} />;
    case "Compass":
      return <Compass size={size} className={className} />;
    case "Crown":
      return <Crown size={size} className={className} />;
    default:
      return <Trophy size={size} className={className} />;
  }
}
