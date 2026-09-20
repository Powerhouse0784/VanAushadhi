import React from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Line, Polyline, Circle, Path, Text as SvgText } from "react-native-svg";

// ── Bar chart ────────────────────────────────────────────────────────────
export function BarChart({
  data,
  height = 180,
  color = "#2C6E3B",
  suffix = "%",
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
  suffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 28;
  const gap = 18;
  const width = data.length * (barWidth + gap) + gap;
  const chartHeight = height - 32;

  return (
    <View style={{ overflow: "hidden" }}>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * chartHeight;
          const x = gap + i * (barWidth + gap);
          const y = chartHeight - barHeight;
          return (
            <React.Fragment key={d.label}>
              <Rect x={x} y={y} width={barWidth} height={barHeight} rx={7} fill={color} opacity={0.85 - (i % 3) * 0.08} />
              <SvgText x={x + barWidth / 2} y={y - 6} fontSize="11" fill="#194023" textAnchor="middle" fontWeight="600">
                {Math.round(d.value)}
                {suffix}
              </SvgText>
              <SvgText x={x + barWidth / 2} y={height - 8} fontSize="10" fill="#5FAE70" textAnchor="middle">
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

// ── Line chart ───────────────────────────────────────────────────────────
export function LineChart({
  data,
  height = 160,
  color = "#2C6E3B",
}: {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const pad = 24;
  const stepX = 56;
  const width = data.length * stepX + pad * 2;
  const chartHeight = height - 36;

  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = chartHeight - ((d.value - min) / (max - min || 1)) * chartHeight + 8;
    return { x, y, ...d };
  });
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <View style={{ overflow: "hidden" }}>
      <Svg width={width} height={height}>
        <Polyline points={polylinePoints} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p) => (
          <React.Fragment key={p.label}>
            <Circle cx={p.x} cy={p.y} r={4} fill="#fff" stroke={color} strokeWidth={2} />
            <SvgText x={p.x} y={p.y - 10} fontSize="10" fill="#194023" textAnchor="middle" fontWeight="600">
              {p.value}
            </SvgText>
            <SvgText x={p.x} y={height - 6} fontSize="10" fill="#5FAE70" textAnchor="middle">
              {p.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

// ── Donut / survival ring ────────────────────────────────────────────────
export function DonutStat({
  percent,
  size = 120,
  strokeWidth = 14,
  color = "#2C6E3B",
  trackColor = "#DBEFDE",
  textColor = "#194023",
  labelColor,
  label,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  // Explicit colors rather than a `dark:` class — this component is used
  // on both light cards and dark gradient banners, and its own theme
  // context (not the device's dark-mode setting) decides which is legible.
  textColor?: string;
  labelColor?: string;
  label?: string;
}) {
  const safePercent = Number.isFinite(percent) ? Math.min(Math.max(percent, 0), 100) : 0;
  const center = size / 2;
  const radius = Math.max((size - strokeWidth) / 2, 0);
  const circumference = 2 * Math.PI * radius;
  const dash = (safePercent / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          // Using an SVG transform string (rather than the rotation/origin
          // props) so this renders identically on native and web.
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text className="font-display" style={{ fontSize: size * 0.19, color: textColor }}>
          {safePercent.toFixed(1)}%
        </Text>
        {label ? <Text className="text-xs" style={{ color: labelColor ?? textColor, opacity: labelColor ? 1 : 0.7 }}>{label}</Text> : null}
      </View>
    </View>
  );
}
