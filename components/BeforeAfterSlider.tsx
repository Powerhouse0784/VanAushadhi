import React, { useState } from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import AppImage from "./AppImage";

interface BeforeAfterSliderProps {
  beforeKey: string;
  afterKey: string;
  height?: number;
}

export default function BeforeAfterSlider({ beforeKey, afterKey, height = 240 }: BeforeAfterSliderProps) {
  const [width, setWidth] = useState(0);
  const x = useSharedValue(0);
  const [displayPct, setDisplayPct] = useState(50);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setWidth(w);
    x.value = w / 2;
  };

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const pan = Gesture.Pan()
    .onChange((e) => {
      x.value = clamp(x.value + e.changeX, 0, width);
      runOnJS(setDisplayPct)(Math.round((x.value / (width || 1)) * 100));
    })
    .onStart((e) => {
      x.value = clamp(e.x, 0, width);
      runOnJS(setDisplayPct)(Math.round((x.value / (width || 1)) * 100));
    });

  const revealStyle = useAnimatedStyle(() => ({ width: x.value }));
  const handleStyle = useAnimatedStyle(() => ({ left: x.value - 16 }));

  return (
    <View>
      <View
        onLayout={onLayout}
        style={{ height, borderRadius: 20, overflow: "hidden", position: "relative" }}
      >
        <View style={{ position: "absolute", inset: 0 }}>
          <AppImage imageKey={afterKey} label="Latest verification photo" icon="tree" />
        </View>
        <Animated.View style={[{ position: "absolute", top: 0, bottom: 0, left: 0, overflow: "hidden" }, revealStyle]}>
          <View style={{ width, height }}>
            <AppImage imageKey={beforeKey} label="Initial plantation photo" icon="leaf" />
          </View>
        </Animated.View>

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              { position: "absolute", top: 0, bottom: 0, width: 32, alignItems: "center", justifyContent: "center" },
              handleStyle,
            ]}
          >
            <View style={{ width: 3, height: "100%", backgroundColor: "#fff", position: "absolute" }} />
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}
            >
              <Text style={{ fontSize: 12 }}>↔</Text>
            </View>
          </Animated.View>
        </GestureDetector>

        <View style={{ position: "absolute", top: 10, left: 10, backgroundColor: "rgba(15,42,23,0.55)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
          <Text style={{ color: "#fff", fontSize: 10 }}>Before</Text>
        </View>
        <View style={{ position: "absolute", top: 10, right: 10, backgroundColor: "rgba(15,42,23,0.55)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 }}>
          <Text style={{ color: "#fff", fontSize: 10 }}>Now</Text>
        </View>
      </View>
      <Text className="text-center text-xs text-canopy-700/60 dark:text-canopy-200/60 mt-2 font-body">
        Drag the divider to compare · {displayPct}% before
      </Text>
    </View>
  );
}
