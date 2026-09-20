import React from "react";
import { View, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Card } from "./Primitives";

export default function TreeQRCard({ treeCode, treeId }: { treeCode: string; treeId: string }) {
  return (
    <Card className="items-center py-6">
      <View style={{ padding: 12, backgroundColor: "#fff", borderRadius: 16 }}>
        <QRCode value={`greenroots://tree/${treeId}`} size={140} color="#0F2A17" backgroundColor="#fff" />
      </View>
      <Text className="mt-3 font-body-bold text-canopy-950 dark:text-cream-100 tracking-wide">{treeCode}</Text>
      <Text className="text-xs text-canopy-700/60 dark:text-canopy-200/60 mt-1">Scan to open this tree's digital ID</Text>
    </Card>
  );
}
