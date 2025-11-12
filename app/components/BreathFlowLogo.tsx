import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

interface BreathFlowLogoProps {
  size?: number;
  color?: string;
}

export const BreathFlowLogo: React.FC<BreathFlowLogoProps> = ({
  size = 40,
  color = "#fff",
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Head circle */}
        <Circle
          cx="50"
          cy="22"
          r="12"
          stroke={color}
          strokeWidth="5"
          fill="none"
        />

        {/* Body outline - left arm */}
        <Path
          d="M 38 40 Q 25 45 20 55"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body outline - right arm */}
        <Path
          d="M 62 40 Q 75 45 80 55"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lotus/Leaf petals - center */}
        <Path
          d="M 50 45 Q 50 70 50 75 Q 50 70 50 45"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lotus - left petal */}
        <Path
          d="M 50 55 Q 35 60 32 75"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lotus - right petal */}
        <Path
          d="M 50 55 Q 65 60 68 75"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lotus - far left petal */}
        <Path
          d="M 45 52 Q 25 55 22 70"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Lotus - far right petal */}
        <Path
          d="M 55 52 Q 75 55 78 70"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
