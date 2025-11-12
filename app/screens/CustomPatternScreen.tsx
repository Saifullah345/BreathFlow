import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BreathingPattern } from "../types";
import { saveCustomPattern } from "../utils/storage";

interface CustomPatternScreenProps {
  onBack: () => void;
  onSaved: () => void;
}

export const CustomPatternScreen: React.FC<CustomPatternScreenProps> = ({
  onBack,
  onSaved,
}) => {
  const [name, setName] = useState("");
  const [inhale, setInhale] = useState("4");
  const [hold1, setHold1] = useState("4");
  const [exhale, setExhale] = useState("4");
  const [hold2, setHold2] = useState("0");
  const [cycles, setCycles] = useState("5");

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Missing Name", "Please give your pattern a name");
      return;
    }

    const pattern: BreathingPattern = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      description: "Custom breathing pattern",
      inhale: parseInt(inhale) || 4,
      hold1: parseInt(hold1) || 0,
      exhale: parseInt(exhale) || 4,
      hold2: parseInt(hold2) || 0,
      cycles: parseInt(cycles) || 5,
      category: "custom",
    };

    await saveCustomPattern(pattern);
    Alert.alert("Success", "Custom pattern saved!", [
      { text: "OK", onPress: onSaved },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <Header />

      <View style={styles.headerBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Custom Pattern</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>
            Create your own breathing rhythm! Set the duration for each phase in
            seconds.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pattern Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., My Morning Breath"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Inhale (seconds)</Text>
          <TextInput
            style={styles.input}
            placeholder="4"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={inhale}
            onChangeText={setInhale}
            maxLength={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Hold After Inhale (seconds)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={hold1}
            onChangeText={setHold1}
            maxLength={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Exhale (seconds)</Text>
          <TextInput
            style={styles.input}
            placeholder="4"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={exhale}
            onChangeText={setExhale}
            maxLength={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Hold After Exhale (seconds)</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={hold2}
            onChangeText={setHold2}
            maxLength={2}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Number of Cycles</Text>
          <TextInput
            style={styles.input}
            placeholder="5"
            placeholderTextColor="#999"
            keyboardType="number-pad"
            value={cycles}
            onChangeText={setCycles}
            maxLength={2}
          />
        </View>

        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Preview</Text>
          <Text style={styles.previewText}>
            {name || "Custom Pattern"}: {inhale}s in →{" "}
            {hold1 !== "0" ? `${hold1}s hold → ` : ""}
            {exhale}s out{hold2 !== "0" ? ` → ${hold2}s hold` : ""} × {cycles}{" "}
            cycles
          </Text>
          <Text style={styles.durationText}>
            ≈{" "}
            {Math.ceil(
              (((parseInt(inhale) || 0) +
                (parseInt(hold1) || 0) +
                (parseInt(exhale) || 0) +
                (parseInt(hold2) || 0)) *
                (parseInt(cycles) || 1)) /
                60
            )}{" "}
            minutes
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Pattern</Text>
        </TouchableOpacity>
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
    fontSize: 18,
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
  infoCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#D1E8F5",
  },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderTopWidth: 3,
    borderTopColor: "#4A90E2",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 12,
  },
  previewText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  saveButton: {
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
  saveButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
