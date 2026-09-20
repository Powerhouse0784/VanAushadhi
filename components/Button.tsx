import React from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";
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

const VARIANT_STYLES: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: "bg-canopy-600", text: "text-white" },
  secondary: { bg: "bg-bark-400", text: "text-white" },
  outline: { bg: "bg-transparent border border-canopy-600", text: "text-canopy-700 dark:text-canopy-300" },
  ghost: { bg: "bg-canopy-50 dark:bg-canopy-900/40", text: "text-canopy-700 dark:text-canopy-200" },
  danger: { bg: "bg-red-600", text: "text-white" },
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-3.5 py-2 rounded-full",
  md: "px-5 py-3.5 rounded-full",
  lg: "px-6 py-4 rounded-full",
};

const TEXT_SIZE: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
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

  return (
    <Pressable onPress={onPress} disabled={isDisabled}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.97 : 1, opacity: isDisabled ? 0.6 : 1 }}
          transition={{ type: "timing", duration: 100 }}
          className={`${v.bg} ${SIZE_STYLES[size]} ${fullWidth ? "w-full" : ""} flex-row items-center justify-center gap-2`}
          style={variant === "primary" ? { shadowColor: "#2C6E3B", shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 } : undefined}
        >
          {loading ? (
            <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#2C6E3B" : "#fff"} />
          ) : (
            <>
              {icon}
              <Text className={`${v.text} ${TEXT_SIZE[size]} font-body-semibold`}>{label}</Text>
            </>
          )}
        </MotiView>
      )}
    </Pressable>
  );
}
