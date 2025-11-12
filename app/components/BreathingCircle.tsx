import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";
import { VisualTheme } from "../types";
import { VISUAL_THEMES } from "../constants";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.7;

interface BreathingCircleProps {
  phase: "inhale" | "hold1" | "exhale" | "hold2" | "idle";
  theme: VisualTheme;
  duration: number;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  phase,
  theme,
  duration,
}) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === "idle") {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    const targetScale = phase === "inhale" ? 1 : 0.5;
    const targetOpacity = phase === "exhale" ? 0.3 : 0.8;

    Animated.parallel([
      Animated.timing(scale, {
        toValue: targetScale,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: targetOpacity,
        duration: duration * 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [phase, duration]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const colors = VISUAL_THEMES[theme].gradient;

  return (
    <View style={styles.container}>
      {/* Background circles */}
      {colors.map((color, index) => (
        <Animated.View
          key={index}
          style={[
            styles.circle,
            {
              backgroundColor: color,
              opacity: opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
              transform: [
                {
                  scale: scale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7 + index * 0.1, 1 + index * 0.15],
                  }),
                },
                { rotate },
              ],
            },
          ]}
        />
      ))}

      {/* Main breathing circle */}
      <Animated.View
        style={[
          styles.mainCircle,
          {
            backgroundColor: VISUAL_THEMES[theme].primary,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />

      {/* Inner glow */}
      <Animated.View
        style={[
          styles.innerGlow,
          {
            backgroundColor: VISUAL_THEMES[theme].secondary,
            opacity: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 0.8],
            }),
            transform: [
              {
                scale: scale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.6],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
  mainCircle: {
    position: "absolute",
    width: CIRCLE_SIZE * 0.8,
    height: CIRCLE_SIZE * 0.8,
    borderRadius: (CIRCLE_SIZE * 0.8) / 2,
  },
  innerGlow: {
    position: "absolute",
    width: CIRCLE_SIZE * 0.5,
    height: CIRCLE_SIZE * 0.5,
    borderRadius: (CIRCLE_SIZE * 0.5) / 2,
  },
});
