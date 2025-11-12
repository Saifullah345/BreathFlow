import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Achievement } from "../types";
import { getAchievements } from "../utils/storage";
import { ACHIEVEMENTS } from "../constants";

interface AchievementsScreenProps {
  onBack: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  onBack,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const stored = await getAchievements();

    // Merge with default achievements
    const merged = ACHIEVEMENTS.map((defaultAch) => {
      const storedAch = stored.find((s) => s.id === defaultAch.id);
      return storedAch || defaultAch;
    });

    setAchievements(merged);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <Header />

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressCount}>
            {unlockedCount} / {totalCount} Unlocked
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressPercent}>
            {Math.round(progress)}% Complete
          </Text>
        </View>

        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.unlocked && styles.lockedCard,
              ]}
            >
              <Text
                style={[
                  styles.achievementIcon,
                  !achievement.unlocked && styles.lockedIcon,
                ]}
              >
                {achievement.icon}
              </Text>
              <Text
                style={[
                  styles.achievementName,
                  !achievement.unlocked && styles.lockedText,
                ]}
              >
                {achievement.name}
              </Text>
              <Text
                style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.lockedText,
                ]}
              >
                {achievement.description}
              </Text>
              {achievement.unlocked && achievement.unlockedDate && (
                <Text style={styles.unlockedDate}>
                  Unlocked{" "}
                  {new Date(achievement.unlockedDate).toLocaleDateString()}
                </Text>
              )}
              {!achievement.unlocked && (
                <View style={styles.lockBadge}>
                  <Text style={styles.lockIcon}>🔒</Text>
                </View>
              )}
            </View>
          ))}
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
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D1E8F5",
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  placeholder: {
    width: 60,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderTopWidth: 3,
    borderTopColor: "#4A90E2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  progressCount: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#D1E8F5",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 6,
  },
  progressPercent: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
    textAlign: "right",
  },
  achievementsGrid: {
    gap: 16,
  },
  achievementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  lockedCard: {
    opacity: 0.6,
    borderLeftColor: "#D1E8F5",
  },
  achievementIcon: {
    fontSize: 48,
    marginBottom: 12,
    textAlign: "center",
  },
  lockedIcon: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
    textAlign: "center",
  },
  achievementDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  lockedText: {
    color: "#999",
  },
  unlockedDate: {
    fontSize: 12,
    color: "#4A90E2",
    marginTop: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  lockBadge: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  lockIcon: {
    fontSize: 20,
  },
});
