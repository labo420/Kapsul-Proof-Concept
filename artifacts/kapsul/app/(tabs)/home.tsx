import { Calendar, Camera, Heart, RefreshCw, Users } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE, photoUrl } from "@/lib/api";
import GradientButton from "@/components/GradientButton";

interface FeedAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface FeedItem {
  type: string;
  id: string;
  objectPath: string;
  authorId: string;
  eventId: string;
  createdAt: string;
  author: FeedAuthor | null;
}

function DefaultAvatar({ size = 36 }: { size?: number }) {
  const colors = useColors();
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}
    >
      <Camera size={size * 0.4} color="rgba(255,255,255,0.9)" />
    </LinearGradient>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const colors = useColors();
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "adesso";
    if (m < 60) return `${m}m fa`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h fa`;
    return `${Math.floor(h / 24)}g fa`;
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        {item.author?.avatarUrl ? (
          <Image source={{ uri: item.author.avatarUrl }} style={styles.feedAvatar} />
        ) : (
          <DefaultAvatar size={36} />
        )}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={[styles.feedDisplayName, { color: colors.foreground }]}>
            {item.author?.displayName ?? "Utente"}
          </Text>
          <Text style={[styles.feedUsername, { color: colors.mutedForeground }]}>
            @{item.author?.username ?? "..."} · {timeAgo(item.createdAt)}
          </Text>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/event/${item.eventId}`)}>
        <Image
          source={{ uri: photoUrl(item.objectPath) }}
          style={styles.feedImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
}

function EmptyFeed({ isLoggedIn }: { isLoggedIn: boolean }) {
  const colors = useColors();
  if (!isLoggedIn) {
    return (
      <View style={styles.emptyState}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.emptyIcon}
        >
          <Camera size={36} color="#fff" />
        </LinearGradient>
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Il tuo feed ti aspetta</Text>
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          Accedi per vedere i contenuti delle persone che segui.
        </Text>
        <GradientButton label="Accedi" onPress={() => router.push("/login")} size="lg" />
      </View>
    );
  }
  return (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.emptyIcon}
      >
        <Users size={36} color="#fff" />
      </LinearGradient>
      <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Feed vuoto</Text>
      <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
        Segui altri utenti dal tab Profilo per vedere i loro contenuti qui.
      </Text>
      <GradientButton label="Vai al Profilo" onPress={() => router.push("/(tabs)/profile")} size="lg" />
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, token } = useAuth();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const fetchFeed = useCallback(async (showRefreshing = false) => {
    if (!token) { setLoading(false); return; }
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/social/feed?page=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json() as { items: FeedItem[] };
        setItems(data.items);
      }
    } catch {}
    setLoading(false);
    setRefreshing(false);
  }, [token]);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.logoGradient}
        >
          <Text style={styles.logoText}>Kapsul</Text>
        </LinearGradient>
        {token && (
          <TouchableOpacity onPress={() => fetchFeed(true)} style={{ padding: 4 }}>
            <RefreshCw size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.gradientStart} />
        </View>
      ) : items.length === 0 ? (
        <EmptyFeed isLoggedIn={!!user} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FeedCard item={item} />}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={() => fetchFeed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  logoGradient: { borderRadius: 8, paddingHorizontal: 2, paddingVertical: 1, alignSelf: "flex-start" },
  logoText: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 12 },
  feedAvatar: { width: 36, height: 36, borderRadius: 18 },
  feedDisplayName: { fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold" },
  feedUsername: { fontSize: 12, fontFamily: "Inter_400Regular" },
  feedImage: { width: "100%", aspectRatio: 1 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  loadingState: { flex: 1, alignItems: "center", justifyContent: "center" },
});
