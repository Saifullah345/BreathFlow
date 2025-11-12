import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BreathingPattern } from "../types";

interface PatternSelectorProps {
  patterns: BreathingPattern[];
  selectedId: string;
  onSelect: (pattern: BreathingPattern) => void;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  patterns,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {patterns.map((pattern) => (
        <TouchableOpacity
          key={pattern.id}
          style={[
            styles.patternCard,
            selectedId === pattern.id && styles.selectedCard,
            pattern.category === "custom" && styles.customCard,
          ]}
          onPress={() => onSelect(pattern)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.patternName,
                selectedId === pattern.id && styles.selectedText,
              ]}
            >
              {pattern.name}
            </Text>
            {pattern.category === "custom" && (
              <View style={styles.customBadge}>
                <Text style={styles.customBadgeText}>Custom</Text>
              </View>
            )}
          </View>
          {pattern.description && (
            <Text style={styles.patternDescription}>{pattern.description}</Text>
          )}
          <Text style={styles.patternDetails}>
            {pattern.inhale}s in
            {pattern.hold1 > 0 ? ` • ${pattern.hold1}s hold` : ""} •{" "}
            {pattern.exhale}s out
            {pattern.hold2 > 0 ? ` • ${pattern.hold2}s hold` : ""}
          </Text>
          <Text style={styles.cycleCount}>
            {pattern.cycles} cycles • ≈
            {Math.ceil(
              ((pattern.inhale +
                pattern.hold1 +
                pattern.exhale +
                pattern.hold2) *
                pattern.cycles) /
                60
            )}{" "}
            min
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  patternCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1E8F5",
  },
  selectedCard: {
    backgroundColor: "#E3F2FD",
    borderColor: "#4A90E2",
    borderWidth: 3,
  },
  customCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFB74D",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  patternName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    flex: 1,
  },
  selectedText: {
    color: "#4A90E2",
  },
  customBadge: {
    backgroundColor: "#FFE0B2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  customBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F57C00",
  },
  patternDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  patternDetails: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 4,
    fontWeight: "500",
  },
  cycleCount: {
    fontSize: 12,
    color: "#999",
  },
});
