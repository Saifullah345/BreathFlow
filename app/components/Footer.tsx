import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <View style={styles.iconRow}>
        <View style={styles.iconItem}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.iconText}>Wellness</Text>
        </View>
        <View style={styles.iconItem}>
          <Ionicons name="leaf" size={20} color="#fff" />
          <Text style={styles.iconText}>Natural</Text>
        </View>
        <View style={styles.iconItem}>
          <Ionicons name="sparkles" size={20} color="#fff" />
          <Text style={styles.iconText}>Peace</Text>
        </View>
      </View>
      <Text style={styles.footerText}>
        © 2025 BreathFlow - Breathe Better, Live Better
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#4A90E2",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  iconItem: {
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    textAlign: "center",
  },
});
