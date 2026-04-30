import { ChevronLeft, Download, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
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
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import PhotoCard from "@/components/PhotoCard";
import { API_BASE, apiGetPhotos, photoUrl, type ApiPhoto } from "@/lib/api";

const MOCK_PHOTOS = [
  { id: "m1", uri: "https://picsum.photos/seed/party1/400/550", h: 220, col: 0 },
  { id: "m2", uri: "https://picsum.photos/seed/party2/400/300", h: 160, col: 1 },
  { id: "m3", uri: "https://picsum.photos/seed/party3/400/480", h: 210, col: 1 },
  { id: "m4", uri: "https://picsum.photos/seed/party4/400/400", h: 190, col: 0 },
];

type WallPhoto = { id: string; uri: string; h: number; col: number; isMock?: boolean };

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
  const { currentEventId, guestTokens } = useGuest();
  const { token: authToken } = useAuth();
  const { getEvent } = useEvents();
  const activeEvent = currentEventId ? getEvent(currentEventId) : null;
  const isHost = !!activeEvent?.hostToken;
  const canDownload = isHost || activeEvent?.guestsCanDownload !== false;
  const [photos, setPhotos] = useState<WallPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<WallPhoto | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

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
          const data = await apiGetPhotos(currentEventId, guestTokens[currentEventId] ?? undefined, authToken);
          const wall = toWallPhotos(data);
          setPhotos(wall.length > 0 ? wall : MOCK_PHOTOS.map(p => ({ ...p, isMock: true })));
        } else {
          setPhotos(MOCK_PHOTOS.map(p => ({ ...p, isMock: true })));
        }
      } catch {
        setError(true);
        setPhotos(MOCK_PHOTOS.map(p => ({ ...p, isMock: true })));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentEventId, guestTokens, authToken]
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

  const handleDownload = useCallback(async (photo: WallPhoto) => {
    if (photo.isMock || !currentEventId) return;

    if (Platform.OS === "web") {
      const guestToken = guestTokens[currentEventId];
      const qs = guestToken ? `?guestToken=${encodeURIComponent(guestToken)}` : "";
      const url = `${API_BASE}/events/${encodeURIComponent(currentEventId)}/photos/${encodeURIComponent(photo.id)}/download${qs}`;
      const a = document.createElement("a");
      a.href = url;
      a.download = `piclo-${photo.id}.jpg`;
      a.click();
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permesso negato", "Abilita l'accesso alla libreria nelle impostazioni per scaricare le foto.");
      return;
    }

    setDownloading(true);
    try {
      const guestToken = guestTokens[currentEventId];
      const qs = guestToken ? `?guestToken=${encodeURIComponent(guestToken)}` : "";
      const downloadUrl = `${API_BASE}/events/${encodeURIComponent(currentEventId)}/photos/${encodeURIComponent(photo.id)}/download${qs}`;
      const tmpPath = (FileSystem.documentDirectory ?? "") + `piclo_${photo.id}.jpg`;

      const headers: Record<string, string> = {};
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const result = await FileSystem.downloadAsync(downloadUrl, tmpPath, { headers });
      if (result.status !== 200) {
        await FileSystem.deleteAsync(result.uri, { idempotent: true });
        throw new Error(`Download failed: HTTP ${result.status}`);
      }
      await MediaLibrary.saveToLibraryAsync(result.uri);
      await FileSystem.deleteAsync(result.uri, { idempotent: true });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDownloadedId(photo.id);
      setTimeout(() => setDownloadedId(null), 3000);
    } catch {
      Alert.alert("Errore download", "Impossibile scaricare la foto. Riprova.");
    } finally {
      setDownloading(false);
    }
  }, [currentEventId, guestTokens, authToken]);

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
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() => setSelectedPhoto(photo)}
                    activeOpacity={0.92}
                  >
                    <PhotoCard
                      uri={photo.uri}
                      height={photo.h}
                      width={colWidth}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.col, { width: colWidth, gap: GAP }]}>
                {rightCol.map((photo) => (
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() => setSelectedPhoto(photo)}
                    activeOpacity={0.92}
                  >
                    <PhotoCard
                      uri={photo.uri}
                      height={photo.h}
                      width={colWidth}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          scrollEnabled={true}
        />
      )}

      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.lightboxOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedPhoto(null)} />

          {selectedPhoto && (
            <View style={styles.lightboxContent}>
              <Image
                source={{ uri: selectedPhoto.uri }}
                style={styles.lightboxImage}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={[styles.lightboxTopBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              onPress={() => setSelectedPhoto(null)}
              style={styles.lightboxCloseBtn}
              activeOpacity={0.8}
            >
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedPhoto && !selectedPhoto.isMock && canDownload && (
            <View style={[styles.lightboxBottomBar, { paddingBottom: insets.bottom + 16 }]}>
              {downloadedId === selectedPhoto.id ? (
                <View style={[styles.downloadedBadge, { backgroundColor: colors.gradientStart + "22", borderColor: colors.gradientStart + "55" }]}>
                  <Text style={[styles.downloadedText, { color: colors.gradientStart }]}>
                    Salvata nel rullino!
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleDownload(selectedPhoto)}
                  disabled={downloading}
                  activeOpacity={0.85}
                  style={styles.downloadBtnWrap}
                >
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.downloadBtn}
                  >
                    {downloading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Download size={18} color="#fff" />
                        <Text style={styles.downloadBtnText}>Scarica foto</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
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
  lightboxOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.96)",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lightboxImage: {
    width: "100%",
    height: "85%",
  },
  lightboxTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  lightboxCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  lightboxBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  downloadBtnWrap: {
    width: "100%",
    borderRadius: 999,
    overflow: "hidden",
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 999,
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
  downloadedBadge: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  downloadedText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
