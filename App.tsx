import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { HomeScreen } from "./app/screens/HomeScreen";
import { BreathingSession } from "./app/screens/BreathingSession";
import { HistoryScreen } from "./app/screens/HistoryScreen";
import { CustomPatternScreen } from "./app/screens/CustomPatternScreen";
import { SettingsScreen } from "./app/screens/SettingsScreen";
import { AchievementsScreen } from "./app/screens/AchievementsScreen";
import { OnboardingScreen } from "./app/screens/OnboardingScreen";
import { PostSessionNotes } from "./app/screens/PostSessionNotes";
import { PrivacyPolicyScreen } from "./app/screens/PrivacyPolicyScreen";
import { BreathingPattern, VisualTheme } from "./app/types";
import { isOnboardingComplete, saveSession } from "./app/utils/storage";

type Screen =
  | "onboarding"
  | "home"
  | "session"
  | "history"
  | "customPattern"
  | "settings"
  | "achievements"
  | "postSession"
  | "privacyPolicy";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen | null>(null);
  const [selectedPattern, setSelectedPattern] =
    useState<BreathingPattern | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<VisualTheme>("ocean");
  const [pendingSessionData, setPendingSessionData] = useState<any>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const completed = await isOnboardingComplete();
    setCurrentScreen(completed ? "home" : "onboarding");
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen("home");
  };

  const handleStartSession = (
    pattern: BreathingPattern,
    theme: VisualTheme
  ) => {
    setSelectedPattern(pattern);
    setSelectedTheme(theme);
    setCurrentScreen("session");
  };

  const handleSessionComplete = () => {
    setCurrentScreen("postSession");
  };

  const handlePostSessionComplete = async (mood: string, notes: string) => {
    // Session data is already saved in BreathingSession component
    // Here we can update it with mood and notes if needed
    setCurrentScreen("home");
  };

  const handlePostSessionSkip = () => {
    setCurrentScreen("home");
  };

  const handleSessionExit = () => {
    setCurrentScreen("home");
  };

  const handleViewHistory = () => {
    setCurrentScreen("history");
  };

  const handleCreateCustomPattern = () => {
    setCurrentScreen("customPattern");
  };

  const handleViewSettings = () => {
    setCurrentScreen("settings");
  };

  const handleViewAchievements = () => {
    setCurrentScreen("achievements");
  };

  const handleViewPrivacyPolicy = () => {
    setCurrentScreen("privacyPolicy");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
  };

  return (
    <View style={styles.container}>
      {currentScreen === null ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : (
        <>
          {currentScreen === "onboarding" && (
            <OnboardingScreen onComplete={handleOnboardingComplete} />
          )}

          {currentScreen === "home" && (
            <HomeScreen
              onStartSession={handleStartSession}
              onViewHistory={handleViewHistory}
              onCreateCustomPattern={handleCreateCustomPattern}
              onViewSettings={handleViewSettings}
              onViewAchievements={handleViewAchievements}
            />
          )}

          {currentScreen === "session" && selectedPattern && (
            <BreathingSession
              pattern={selectedPattern}
              theme={selectedTheme}
              onComplete={handleSessionComplete}
              onExit={handleSessionExit}
            />
          )}

          {currentScreen === "postSession" && (
            <PostSessionNotes
              onComplete={handlePostSessionComplete}
              onSkip={handlePostSessionSkip}
            />
          )}

          {currentScreen === "history" && (
            <HistoryScreen onBack={handleBackToHome} />
          )}

          {currentScreen === "customPattern" && (
            <CustomPatternScreen
              onBack={handleBackToHome}
              onSaved={handleBackToHome}
            />
          )}

          {currentScreen === "settings" && (
            <SettingsScreen
              onBack={handleBackToHome}
              onViewPrivacyPolicy={handleViewPrivacyPolicy}
            />
          )}

          {currentScreen === "achievements" && (
            <AchievementsScreen onBack={handleBackToHome} />
          )}

          {currentScreen === "privacyPolicy" && (
            <PrivacyPolicyScreen onBack={handleBackToHome} />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F4F8",
  },
});
