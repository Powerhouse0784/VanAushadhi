import React, { useMemo } from "react";
import { View, Pressable, Text, LayoutChangeEvent } from "react-native";
import { useState } from "react";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { MotiView } from "moti";

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  color: string;
  selected?: boolean;
}

interface IllustratedMapProps {
  pins: MapPin[];
  onPinPress?: (id: string) => void;
  height?: number;
  bounds?: { minLat: number; maxLat: number; minLng: number; maxLng: number };
}

function computeBounds(pins: MapPin[]) {
  const lats = pins.map((p) => p.latitude);
  const lngs = pins.map((p) => p.longitude);
  const pad = 0.015;
  return {
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
    minLng: Math.min(...lngs) - pad,
    maxLng: Math.max(...lngs) + pad,
  };
}

export default function IllustratedMap({ pins, onPinPress, height = 320, bounds }: IllustratedMapProps) {
  const [size, setSize] = useState({ width: 0, height });
  const b = useMemo(() => bounds ?? computeBounds(pins), [pins, bounds]);

  const onLayout = (e: LayoutChangeEvent) => {
    setSize({ width: e.nativeEvent.layout.width, height });
  };

  const project = (lat: number, lng: number) => {
    const x = ((lng - b.minLng) / (b.maxLng - b.minLng || 1)) * size.width;
    const y = (1 - (lat - b.minLat) / (b.maxLat - b.minLat || 1)) * size.height;
    return { x, y };
  };

  return (
    <View
      onLayout={onLayout}
      style={{ height, borderRadius: 24, overflow: "hidden", backgroundColor: "#EFF8F1" }}
    >
      {size.width > 0 && (
        <Svg width={size.width} height={size.height} style={{ position: "absolute" }}>
          <Defs>
            <SvgLinearGradient id="terrain" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#E4F3E8" />
              <Stop offset="1" stopColor="#CFEAD7" />
            </SvgLinearGradient>
            <SvgLinearGradient id="river" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#BFE0F0" />
              <Stop offset="1" stopColor="#A9D3E8" />
            </SvgLinearGradient>
          </Defs>
          <Path d={`M0,0 H${size.width} V${size.height} H0 Z`} fill="url(#terrain)" />
          {/* stylised river winding through, representing the Yamuna */}
          <Path
            d={`M ${size.width * 0.05} ${size.height * 0.1}
                C ${size.width * 0.3} ${size.height * 0.25}, ${size.width * 0.1} ${size.height * 0.5}, ${size.width * 0.35} ${size.height * 0.62}
                S ${size.width * 0.5} ${size.height * 0.9}, ${size.width * 0.8} ${size.height * 0.95}`}
            stroke="url(#river)"
            strokeWidth={size.width * 0.045}
            fill="none"
            strokeLinecap="round"
            opacity={0.7}
          />
          {/* soft green cluster blobs to suggest forested / project zones */}
          {pins.slice(0, 4).map((p, i) => {
            const { x, y } = project(p.latitude, p.longitude);
            return <Circle key={`blob-${i}`} cx={x} cy={y} r={46} fill="#B4DEBC" opacity={0.35} />;
          })}
        </Svg>
      )}

      {size.width > 0 &&
        pins.map((p) => {
          const { x, y } = project(p.latitude, p.longitude);
          return (
            <Pressable
              key={p.id}
              onPress={() => onPinPress?.(p.id)}
              style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20 }}
              hitSlop={8}
            >
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: p.selected ? 1.35 : 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: p.color,
                  borderWidth: 2.5,
                  borderColor: "#fff",
                  shadowColor: "#000",
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
              />
            </Pressable>
          );
        })}
    </View>
  );
}

export function MapLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <View className="flex-row flex-wrap gap-x-4 gap-y-2 mt-3">
      {items.map((it) => (
        <View key={it.label} className="flex-row items-center gap-1.5">
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: it.color }} />
          <Text className="text-xs text-canopy-700/80 dark:text-canopy-200/80 font-body">{it.label}</Text>
        </View>
      ))}
    </View>
  );
}
