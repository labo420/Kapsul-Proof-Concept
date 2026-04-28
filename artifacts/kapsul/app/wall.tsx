import { ChevronLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { useColors } from "@/hooks/useColors";
import { useGuest } from "@/contexts/GuestContext";
import PhotoCard from "@/components/PhotoCard";
import { apiGetPhotos, photoUrl, type ApiPhoto } from "@/lib/api";

const MOCK_PHOTOS = [
  { id: "m1", uri: "https://picsum.photos/seed/party1/400/550", h: 220, col: 0 },
  { id: "m2", uri: "https://picsum.photos/seed/party2/400/300", h: 160, col: 1 },
  { id: "m3", uri: "https://picsum.photos/seed/party3/400/480", h: 210, col: 1 },
  { id: "m4", uri: "https://picsum.photos/seed/party4/400/400", h: 190, col: 0 },
];

type WallPhoto = { id: string; uri: string; h: number; col: number };

function toWallPhotos(apiPhotos: ApiPhoto[]): WallPhoto[] {
  return apiPhotos.map((p, i) => ({
    id: p.id,
    uri: photoUrl(p.objectPath),
    h: 160 + (i % 3) * 30,
    col: i % 2,
  }));
}

export default function WallScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { currentEventId, guestId } = useGuest();
  const [photos, setPhotos] = useState<WallPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const PADDING = 16;
  const GAP = 10;
  const colWidth = (width - PADDING * 2 - GAP) / 2;

  const fetchPhotos = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setError(false);
      try {
        if (currentEventId) {
          const data = await apiGetPhotos(currentEventId, guestId ?? undefined);
          const wall = toWallPhotos(data);
          setPhotos(wall.length > 0 ? wall : MOCK_PHOTOS);
        } else {
          setPhotos(MOCK_PHOTOS);
        }
      } catch {
        setError(true);
        setPhotos(MOCK_PHOTOS);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentEventId, guestId]
  );

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [fetchPhotos])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhotos(true);
  };

  const { leftCol, rightCol } = useMemo(() => {
    const left: WallPhoto[] = [];
    const right: WallPhoto[] = [];
    photos.forEach((p) => {
      if (p.col === 0) left.push(p);
      else right.push(p);
    });
    return { leftCol: left, rightCol: right };
  }, [photos]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[colors.gradientStart + "18", "transparent"]}
        style={[styles.headerGradient, { paddingTop: topPad + 8 }]}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.titleWrap}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Guest Wall
            </Text>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.liveDot}
            />
          </View>
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: colors.primary + "18",
                borderRadius: 999,
                borderWidth: 1,
                borderColor: colors.primary + "40",
              },
            ]}
          >
            <Text style={[styles.countText, { color: colors.primary }]}>
              {photos.length} foto
            </Text>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>
            Errore di rete. Tira su per riprovare.
          </Text>
        </View>
      ) : (
        <FlatList
          data={[{ key: "masonry" }]}
          keyExtractor={(item) => item.key}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{
            paddingHorizontal: PADDING,
            paddingTop: 14,
            paddingBottom: bottomPad + 80,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={() => (
            <View style={[styles.masonryRow, { gap: GAP }]}>
              <View style={[styles.col, { width: colWidth, gap: GAP }]}>
                {leftCol.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    uri={photo.uri}
                    height={photo.h}
                    width={colWidth}
                  />
                ))}
              </View>
              <View style={[styles.col, { width: colWidth, gap: GAP }]}>
                {rightCol.map((photo) => (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGradient: {
    paddingBottom: 14,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backBtn: { width: 36 },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: { fontSize: 17, fontWeight: "700" },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
  },
  masonryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  col: {
    flexDirection: "column",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
