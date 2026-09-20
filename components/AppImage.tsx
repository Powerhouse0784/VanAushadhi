import React from "react";
import { View, Text } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle } from "react-native-svg";
import { IMAGES } from "@/lib/imageRegistry";

interface AppImageProps {
  imageKey: string;
  label?: string;
  className?: string;
  rounded?: string;
  icon?: "leaf" | "tree" | "camera" | "video" | "map" | "user";
}

function LeafIcon({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 3C10 3 3 10 3 18c0 1.1.9 2 2 2 8 0 15-7 15-17 0-.6-.4-1-1-1Z"
        fill={color}
        opacity={0.9}
      />
      <Path d="M5 19C9 15 13 11 19 5" stroke="#0F5132" strokeWidth={1.4} opacity={0.5} />
    </Svg>
  );
}

function TreeIcon({ size = 28, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="6" fill={color} opacity={0.9} />
      <Path d="M12 13v8M9 21h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

const ICONS: Record<string, (p: { size?: number; color?: string }) => React.ReactElement> = {
  leaf: LeafIcon,
  tree: TreeIcon,
  camera: LeafIcon,
  video: LeafIcon,
  map: TreeIcon,
  user: LeafIcon,
};

export default function AppImage({ imageKey, label, icon = "leaf" }: AppImageProps) {
  const source = IMAGES[imageKey];
  const IconComp = ICONS[icon] ?? LeafIcon;

  if (source) {
    return (
      <Image source={source} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} />
    );
  }

  return (
    <LinearGradient
      colors={["#2C6E3B", "#5FAE70", "#8CCC99"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <IconComp size={26} color="#F5ECD6" />
      {label ? (
        <Text
          style={{
            color: "#F5ECD6",
            fontSize: 10,
            opacity: 0.85,
            textAlign: "center",
            paddingHorizontal: 8,
          }}
          numberOfLines={2}
        >
          {label}
        </Text>
      ) : null}
    </LinearGradient>
  );
}
