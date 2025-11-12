import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PatternSelector } from "../components/PatternSelector";
import { StatsCard } from "../components/StatsCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BreathingPattern, VisualTheme, UserStats } from "../types";
import { BREATHING_PATTERNS, VISUAL_THEMES } from "../constants";
import { getStats, getCustomPatterns } from "../utils/storage";

interface HomeScreenProps {
  onStartSession: (pattern: BreathingPattern, theme: VisualTheme) => void;
  onViewHistory: () => void;
  onCreateCustomPattern: () => void;
  onViewSettings: () => void;
  onViewAchievements: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartSession,
  onViewHistory,
  onCreateCustomPattern,
  onViewSettings,
  onViewAchievements,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(
    BREATHING_PATTERNS[0]
  );
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>("ocean");
  const [allPatterns, setAllPatterns] =
    useState<BreathingPattern[]>(BREATHING_PATTERNS);
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    lastSessionDate: "",
  });

  useEffect(() => {
    loadStats();
    loadPatterns();
  }, []);

  const loadStats = async () => {
    const userStats = await getStats();
    setStats(userStats);
  };

  const loadPatterns = async () => {
    const customPatterns = await getCustomPatterns();
    const combined = [...BREATHING_PATTERNS, ...customPatterns];
    setAllPatterns(combined);
  };

  const themes: { name: string; value: VisualTheme }[] = [
    { name: "Ocean", value: "ocean" },
    { name: "Forest", value: "forest" },
    { name: "Sunset", value: "sunset" },
    { name: "Lavender", value: "lavender" },
    { name: "Minimal", value: "minimal" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={onViewAchievements}
          >
            <Ionicons name="trophy" size={24} color="#4A90E2" />
            <Text style={styles.quickActionText}>Achievements</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={onViewSettings}
          >
            <Ionicons name="settings" size={24} color="#4A90E2" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <StatsCard
            totalSessions={stats.totalSessions}
            totalMinutes={stats.totalMinutes}
            currentStreak={stats.currentStreak}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose a Pattern</Text>
            <TouchableOpacity onPress={onCreateCustomPattern}>
              <Text style={styles.createCustomLink}>+ Create Custom</Text>
            </TouchableOpacity>
          </View>
          <PatternSelector
            patterns={allPatterns}
            selectedId={selectedPattern.id}
            onSelect={setSelectedPattern}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visual Theme</Text>
          <View style={styles.themeContainer}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.value}
                style={[
                  styles.themeButton,
                  { backgroundColor: VISUAL_THEMES[theme.value].primary },
                  selectedTheme === theme.value && styles.selectedTheme,
                ]}
                onPress={() => setSelectedTheme(theme.value)}
              >
                <Text style={styles.themeName}>{theme.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => onStartSession(selectedPattern, selectedTheme)}
          >
            <Text style={styles.startButtonText}>Begin Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={onViewHistory}
          >
            <Text style={styles.historyButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D1E8F5",
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  createCustomLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A90E2",
  },
  themeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  themeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedTheme: {
    borderColor: "#4A90E2",
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  themeName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 12,
    gap: 12,
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  historyButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  historyButtonText: {
    color: "#4A90E2",
    fontSize: 18,
    fontWeight: "600",
  },
});
