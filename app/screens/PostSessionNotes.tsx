import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

interface PostSessionNotesProps {
  onComplete: (mood: string, notes: string) => void;
  onSkip: () => void;
}

export const PostSessionNotes: React.FC<PostSessionNotesProps> = ({
  onComplete,
  onSkip,
}) => {
  const [selectedMood, setSelectedMood] = useState("");
  const [notes, setNotes] = useState("");

  const moods = [
    { emoji: "😌", label: "Calm" },
    { emoji: "😊", label: "Happy" },
    { emoji: "🙏", label: "Grateful" },
    { emoji: "💪", label: "Energized" },
    { emoji: "😴", label: "Sleepy" },
    { emoji: "🧘", label: "Centered" },
  ];

  const handleComplete = () => {
    onComplete(selectedMood, notes);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>How do you feel?</Text>
        <Text style={styles.subtitle}>
          Take a moment to reflect on your session
        </Text>

        <View style={styles.moodsContainer}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.label}
              style={[
                styles.moodButton,
                selectedMood === mood.label && styles.selectedMood,
              ]}
              onPress={() => setSelectedMood(mood.label)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  selectedMood === mood.label && styles.selectedMoodLabel,
                ]}
              >
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How was your experience?"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={onSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1929",
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#90CAF9",
    textAlign: "center",
    marginBottom: 40,
  },
  moodsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  moodButton: {
    width: 100,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedMood: {
    backgroundColor: "rgba(74, 144, 226, 0.3)",
    borderColor: "#4A90E2",
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    color: "#90CAF9",
    fontWeight: "600",
  },
  selectedMoodLabel: {
    color: "#fff",
  },
  notesSection: {
    marginBottom: 32,
  },
  notesLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
    fontWeight: "600",
  },
  notesInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#fff",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  buttons: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#4A90E2",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  skipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  skipButtonText: {
    color: "#90CAF9",
    fontSize: 16,
    fontWeight: "600",
  },
});
