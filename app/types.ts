export interface BreathingPattern {
  id: string;
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  cycles: number;
  description?: string;
  category?: "preset" | "custom";
}

export interface SessionHistory {
  id: string;
  date: string;
  pattern: string;
  duration: number;
  cycles: number;
  mood?: string;
  notes?: string;
}

export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  lastSessionDate: string;
}

export type VisualTheme =
  | "ocean"
  | "forest"
  | "sunset"
  | "lavender"
  | "minimal";

export type AnimationStyle = "expanding" | "pulse" | "wave";

export type HapticIntensity = "light" | "medium" | "heavy" | "off";

export interface UserPreferences {
  hapticIntensity: HapticIntensity;
  animationStyle: AnimationStyle;
  sleepMode: boolean;
  focusMode: boolean;
  backgroundSound?: "wind" | "ocean" | "rain" | "off";
  dailyReminderTime?: string;
  reminderEnabled: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}
