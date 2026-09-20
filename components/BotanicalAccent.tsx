import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

/**
 * A soft, single-line botanical sprig — decorative only (accessibilityElementsHidden).
 * Used as a low-opacity accent in hero/header bands, echoing the line-art
 * illustrations in the VanAushadhi-style reference (leaf + branch motif).
 */
export default function BotanicalAccent({
  size = 160,
  color = "#FFFFFF",
  opacity = 0.08,
  style,
  variant = "sprig",
}: {
  size?: number;
  color?: string;
  opacity?: number;
  style?: any;
  variant?: "sprig" | "leafPair";
}) {
  return (
    <View pointerEvents="none" style={[{ opacity }, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {variant === "sprig" ? (
        <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
          <Path d="M100 190C100 190 96 120 100 70C104 20 130 6 130 6" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
          <Path d="M100 150c0 0 -30 -6 -38 -30c14 4 30 10 38 30Z" fill={color} />
          <Path d="M104 118c0 0 34 -2 46 -24c-16 -2 -36 4 -46 24Z" fill={color} />
          <Path d="M100 90c0 0 -26 -4 -34 -26c12 2 26 8 34 26Z" fill={color} />
          <Path d="M106 58c0 0 24 -2 32 -20c-14 -2 -26 4 -32 20Z" fill={color} />
        </Svg>
      ) : (
        <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
          <Path d="M40 180C60 120 60 60 100 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M160 180C140 120 140 60 100 20" stroke={color} strokeWidth={2} strokeLinecap="round" />
          <Path d="M40 180c0 0 -18 -8 -22 -26c10 2 20 10 22 26Z" fill={color} />
          <Path d="M160 180c0 0 18 -8 22 -26c-10 2 -20 10 -22 26Z" fill={color} />
        </Svg>
      )}
    </View>
  );
}
