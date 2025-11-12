import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatsCardProps {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  totalSessions,
  totalMinutes,
  currentStreak,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalSessions}</Text>
        <Text style={styles.statLabel}>Sessions</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalMinutes}</Text>
        <Text style={styles.statLabel}>Minutes</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <Text style={styles.statValue}>{currentStreak}</Text>
        <Text style={styles.statLabel}>Day Streak</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderTopWidth: 3,
    borderTopColor: "#4A90E2",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
  },
  divider: {
    width: 1,
    backgroundColor: "#D1E8F5",
    marginHorizontal: 8,
  },
});
