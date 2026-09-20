import React from "react";
import { Pressable, Text, ActivityIndicator, ViewStyle } from "react-native";
import { MotiView } from "moti";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

// NOTE: these are applied as inline `style` values rather than Tailwind
// `className` strings. MotiView wraps Reanimated's Animated.View, which
// isn't one of NativeWind's automatically-interopped core components — so
// className colors/backgrounds silently failed to apply here, leaving
// every "primary" button with no background at all (invisible white text
// on a white page). Plain hex values below render reliably everywhere.
const VARIANT_STYLES: Record<Variant, { bg: string; textColor: string; borderColor?: string; borderWidth?: number }> = {
  primary: { bg: "#2C6E3B", textColor: "#FFFFFF" },
  secondary: { bg: "#AD8A55", textColor: "#FFFFFF" },
  outline: { bg: "transparent", textColor: "#22562F", borderColor: "#2C6E3B", borderWidth: 1.5 },
  ghost: { bg: "#EFF8F1", textColor: "#22562F" },
  danger: { bg: "#DC2626", textColor: "#FFFFFF" },
};

const SIZE_STYLES: Record<Size, { paddingHorizontal: number; paddingVertical: number }> = {
  sm: { paddingHorizontal: 14, paddingVertical: 8 },
  md: { paddingHorizontal: 20, paddingVertical: 14 },
  lg: { paddingHorizontal: 24, paddingVertical: 16 },
};

const TEXT_SIZE: Record<Size, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  icon,
  fullWidth,
}: ButtonProps) {
  const v = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle = {
    backgroundColor: v.bg,
    borderColor: v.borderColor,
    borderWidth: v.borderWidth,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: fullWidth ? "100%" : undefined,
    ...SIZE_STYLES[size],
    ...(variant === "primary"
      ? { shadowColor: "#2C6E3B", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 }
      : null),
  };

  return (
    <Pressable onPress={onPress} disabled={isDisabled}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.97 : 1, opacity: isDisabled ? 0.6 : 1 }}
          transition={{ type: "timing", duration: 100 }}
          style={containerStyle}
        >
          {loading ? (
            <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#2C6E3B" : "#fff"} />
          ) : (
            <>
              {icon}
              <Text style={{ color: v.textColor, fontSize: TEXT_SIZE[size] }} className="font-body-semibold">
                {label}
              </Text>
            </>
          )}
        </MotiView>
      )}
    </Pressable>
  );
}
