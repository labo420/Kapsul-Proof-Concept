import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import PhotoCard from "@/components/PhotoCard";

const MOCK_PHOTOS = [
  { id: "1", uri: "https://picsum.photos/seed/party1/400/550", h: 220, col: 0 },
  { id: "2", uri: "https://picsum.photos/seed/party2/400/300", h: 160, col: 1 },
  { id: "3", uri: "https://picsum.photos/seed/party3/400/480", h: 210, col: 1 },
  { id: "4", uri: "https://picsum.photos/seed/party4/400/400", h: 190, col: 0 },
  { id: "5", uri: "https://picsum.photos/seed/party5/400/320", h: 170, col: 1 },
  { id: "6", uri: "https://picsum.photos/seed/party6/400/500", h: 230, col: 0 },
  { id: "7", uri: "https://picsum.photos/seed/party7/400/360", h: 180, col: 0 },
  { id: "8", uri: "https://picsum.photos/seed/party8/400/450", h: 200, col: 1 },
];

export default function WallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const PADDING = 20;
  const GAP = 10;
  const colWidth = (width - PADDING * 2 - GAP) / 2;

  const { leftCol, rightCol } = useMemo(() => {
    const left: typeof MOCK_PHOTOS = [];
    const right: typeof MOCK_PHOTOS = [];
    MOCK_PHOTOS.forEach(p => {
      if (p.col === 0) left.push(p);
      else right.push(p);
    });
    return { leftCol: left, rightCol: right };
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.topBar, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: colors.foreground }]}>Guest Wall</Text>
          <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.muted, borderRadius: 999 }]}>
          <Text style={[styles.countText, { color: colors.mutedForeground, fontFamily: "SpaceMono_400Regular" }]}>
            {String(MOCK_PHOTOS.length).padStart(4, "0")}
          </Text>
        </View>
      </View>

      <FlatList
        data={[{ key: "masonry" }]}
        keyExtractor={item => item.key}
        contentContainerStyle={{
          paddingHorizontal: PADDING,
          paddingTop: 16,
          paddingBottom: bottomPad + 80,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={() => (
          <View style={[styles.masonryRow, { gap: GAP }]}>
            <View style={[styles.col, { width: colWidth, gap: GAP }]}>
              {leftCol.map(photo => (
                <PhotoCard
                  key={photo.id}
                  uri={photo.uri}
                  height={photo.h}
                  width={colWidth}
                />
              ))}
            </View>
            <View style={[styles.col, { width: colWidth, gap: GAP }]}>
              {rightCol.map(photo => (
                <PhotoCard
                  key={photo.id}
                  uri={photo.uri}
                  height={photo.h}
                  width={colWidth}
                />
              ))}
            </View>
          </View>
        )}
        scrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40 },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: "600" },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 12,
    letterSpacing: 1,
  },
  masonryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  col: {
    flexDirection: "column",
  },
});
