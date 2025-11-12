import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SessionHistory,
  UserStats,
  BreathingPattern,
  UserPreferences,
  Achievement,
} from "../types";

const SESSIONS_KEY = "@breathflow_sessions";
const STATS_KEY = "@breathflow_stats";
const CUSTOM_PATTERNS_KEY = "@breathflow_custom_patterns";
const PREFERENCES_KEY = "@breathflow_preferences";
const ACHIEVEMENTS_KEY = "@breathflow_achievements";
const ONBOARDING_KEY = "@breathflow_onboarding_complete";

export const saveSession = async (session: SessionHistory): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(SESSIONS_KEY);
    const sessions: SessionHistory[] = existing ? JSON.parse(existing) : [];
    sessions.unshift(session);

    // Keep only last 100 sessions
    if (sessions.length > 100) {
      sessions.splice(100);
    }

    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    await updateStats(session);
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export const getSessions = async (): Promise<SessionHistory[]> => {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting sessions:", error);
    return [];
  }
};

export const getStats = async (): Promise<UserStats> => {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY);
    return data
      ? JSON.parse(data)
      : {
          totalSessions: 0,
          totalMinutes: 0,
          currentStreak: 0,
          lastSessionDate: "",
        };
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      lastSessionDate: "",
    };
  }
};

const updateStats = async (session: SessionHistory): Promise<void> => {
  try {
    const stats = await getStats();
    const today = new Date().toDateString();
    const lastDate = stats.lastSessionDate
      ? new Date(stats.lastSessionDate).toDateString()
      : "";

    let newStreak = stats.currentStreak;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }
    }

    const updatedStats: UserStats = {
      totalSessions: stats.totalSessions + 1,
      totalMinutes: stats.totalMinutes + Math.round(session.duration / 60),
      currentStreak: newStreak,
      lastSessionDate: new Date().toISOString(),
    };

    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
    await checkAndUnlockAchievements(updatedStats, session);
  } catch (error) {
    console.error("Error updating stats:", error);
  }
};

// Custom Patterns
export const saveCustomPattern = async (
  pattern: BreathingPattern
): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(CUSTOM_PATTERNS_KEY);
    const patterns: BreathingPattern[] = existing ? JSON.parse(existing) : [];
    patterns.push(pattern);
    await AsyncStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify(patterns));
  } catch (error) {
    console.error("Error saving custom pattern:", error);
  }
};

export const getCustomPatterns = async (): Promise<BreathingPattern[]> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOM_PATTERNS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting custom patterns:", error);
    return [];
  }
};

export const deleteCustomPattern = async (patternId: string): Promise<void> => {
  try {
    const patterns = await getCustomPatterns();
    const filtered = patterns.filter((p) => p.id !== patternId);
    await AsyncStorage.setItem(CUSTOM_PATTERNS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting custom pattern:", error);
  }
};

// User Preferences
export const savePreferences = async (
  preferences: UserPreferences
): Promise<void> => {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving preferences:", error);
  }
};

export const getPreferences = async (): Promise<UserPreferences> => {
  try {
    const data = await AsyncStorage.getItem(PREFERENCES_KEY);
    return data
      ? JSON.parse(data)
      : {
          hapticIntensity: "medium",
          animationStyle: "expanding",
          sleepMode: false,
          focusMode: false,
          backgroundSound: "off",
          reminderEnabled: false,
        };
  } catch (error) {
    console.error("Error getting preferences:", error);
    return {
      hapticIntensity: "medium",
      animationStyle: "expanding",
      sleepMode: false,
      focusMode: false,
      backgroundSound: "off",
      reminderEnabled: false,
    };
  }
};

// Achievements
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting achievements:", error);
    return [];
  }
};

export const unlockAchievement = async (
  achievementId: string
): Promise<void> => {
  try {
    const achievements = await getAchievements();
    const updated = achievements.map((a) =>
      a.id === achievementId
        ? { ...a, unlocked: true, unlockedDate: new Date().toISOString() }
        : a
    );
    await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error unlocking achievement:", error);
  }
};

const checkAndUnlockAchievements = async (
  stats: UserStats,
  session: SessionHistory
): Promise<void> => {
  const hour = new Date().getHours();

  if (stats.totalSessions === 1) await unlockAchievement("first_session");
  if (stats.currentStreak === 3) await unlockAchievement("streak_3");
  if (stats.currentStreak === 7) await unlockAchievement("streak_7");
  if (stats.currentStreak === 30) await unlockAchievement("streak_30");
  if (stats.totalSessions === 10) await unlockAchievement("sessions_10");
  if (stats.totalSessions === 50) await unlockAchievement("sessions_50");
  if (stats.totalSessions === 100) await unlockAchievement("sessions_100");
  if (stats.totalMinutes >= 60) await unlockAchievement("minutes_60");
  if (hour >= 22 || hour < 2) await unlockAchievement("night_owl");
  if (hour >= 4 && hour < 6) await unlockAchievement("early_bird");
};

// Onboarding
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Error setting onboarding:", error);
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_KEY);
    return data === "true";
  } catch (error) {
    console.error("Error checking onboarding:", error);
    return false;
  }
};

// Reset onboarding (for testing/debugging)
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error("Error resetting onboarding:", error);
  }
};
