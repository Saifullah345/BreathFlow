import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from "react-native";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { UserPreferences, HapticIntensity, AnimationStyle } from "../types";
import {
  getPreferences,
  savePreferences,
  resetOnboarding,
} from "../utils/storage";

interface SettingsScreenProps {
  onBack: () => void;
  onViewPrivacyPolicy: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onViewPrivacyPolicy,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    hapticIntensity: "medium",
    animationStyle: "expanding",
    sleepMode: false,
    focusMode: false,
    backgroundSound: "off",
    reminderEnabled: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const prefs = await getPreferences();
    setPreferences(prefs);
  };

  const updatePreference = async (updates: Partial<UserPreferences>) => {
    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    await savePreferences(newPrefs);
  };

  const hapticOptions: HapticIntensity[] = ["off", "light", "medium", "heavy"];
  const animationOptions: AnimationStyle[] = ["expanding", "pulse", "wave"];
  const soundOptions = ["off", "wind", "ocean", "rain"];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <Header />

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vibration Feedback</Text>
          <View style={styles.optionGrid}>
            {hapticOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  preferences.hapticIntensity === option &&
                    styles.selectedOption,
                ]}
                onPress={() => updatePreference({ hapticIntensity: option })}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.hapticIntensity === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Animation Style</Text>
          <View style={styles.optionGrid}>
            {animationOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  preferences.animationStyle === option &&
                    styles.selectedOption,
                ]}
                onPress={() => updatePreference({ animationStyle: option })}
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.animationStyle === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Background Sound</Text>
          <View style={styles.optionGrid}>
            {soundOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  preferences.backgroundSound === option &&
                    styles.selectedOption,
                ]}
                onPress={() =>
                  updatePreference({ backgroundSound: option as any })
                }
              >
                <Text
                  style={[
                    styles.optionText,
                    preferences.backgroundSound === option &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Sleep Mode</Text>
              <Text style={styles.toggleDescription}>
                Screen gradually dims during session
              </Text>
            </View>
            <Switch
              value={preferences.sleepMode}
              onValueChange={(value) => updatePreference({ sleepMode: value })}
              trackColor={{ false: "#D1E8F5", true: "#4A90E2" }}
              thumbColor={preferences.sleepMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Focus Mode</Text>
              <Text style={styles.toggleDescription}>
                Minimal screen with only breathing indicator
              </Text>
            </View>
            <Switch
              value={preferences.focusMode}
              onValueChange={(value) => updatePreference({ focusMode: value })}
              trackColor={{ false: "#D1E8F5", true: "#4A90E2" }}
              thumbColor={preferences.focusMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Daily Reminders</Text>
              <Text style={styles.toggleDescription}>
                Get notified to practice breathing
              </Text>
            </View>
            <Switch
              value={preferences.reminderEnabled}
              onValueChange={(value) =>
                updatePreference({ reminderEnabled: value })
              }
              trackColor={{ false: "#D1E8F5", true: "#4A90E2" }}
              thumbColor={preferences.reminderEnabled ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            💡 Tip: Try different combinations to find what works best for you!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity
            style={styles.privacyButton}
            onPress={onViewPrivacyPolicy}
          >
            <Text style={styles.privacyButtonText}>📄 Privacy Policy</Text>
            <Text style={styles.privacyArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <TouchableOpacity
            style={[
              styles.privacyButton,
              { borderColor: "#FFB74D", backgroundColor: "#FFF3E0" },
            ]}
            onPress={async () => {
              await resetOnboarding();
              alert(
                "Onboarding reset! Please restart the app to see the onboarding screens."
              );
            }}
          >
            <Text style={[styles.privacyButtonText, { color: "#F57C00" }]}>
              🔄 Reset Onboarding
            </Text>
            <Text style={[styles.privacyArrow, { color: "#F57C00" }]}>→</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D1E8F5",
  },
  selectedOption: {
    backgroundColor: "#4A90E2",
    borderColor: "#4A90E2",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  selectedOptionText: {
    color: "#fff",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13,
    color: "#666",
  },
  infoCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#1565C0",
    lineHeight: 20,
  },
  privacyButton: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#D1E8F5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  privacyArrow: {
    fontSize: 20,
    color: "#4A90E2",
    fontWeight: "bold",
  },
});
