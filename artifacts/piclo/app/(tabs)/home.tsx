import { Calendar, Camera, Heart, MessageCircle, RefreshCw, User, Users } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE, photoUrl, apiLikePhoto, apiUnlikePhoto } from "@/lib/api";
import GradientButton from "@/components/GradientButton";

interface FeedAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface FeedItem {
  type: "photo" | "event";
  id: string;
  objectPath?: string;
  title?: string;
  authorId: string;
  eventId: string;
  createdAt: string;
  author: FeedAuthor | null;
}

interface PhotoComment {
  id: string;
  photoId: string;
  text: string;
  createdAt: string;
  author: FeedAuthor | null;
}

function CommentsModal({
  visible,
  photoId,
  onClose,
  authToken,
}: {
  visible: boolean;
  photoId: string;
  onClose: () => void;
  authToken: string | null;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (authToken) headers.Authorization = `Bearer ${authToken}`;
      const res = await fetch(`${API_BASE}/social/photos/${photoId}/comments`, { headers });
      if (res.ok) setComments(await res.json());
    } catch {}
    setLoading(false);
  }, [photoId, authToken]);

  useEffect(() => {
    if (visible) fetchComments();
    else { setComments([]); setText(""); }
  }, [visible, fetchComments]);

  const postComment = async () => {
    if (!authToken || !text.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`${API_BASE}/social/photos/${photoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (res.ok) {
        const newComment = await res.json() as PhotoComment;
        setComments((prev) => [newComment, ...prev]);
        setText("");
      }
    } catch {}
    setPosting(false);
  };

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
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "700" }}>Commenti</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: colors.gradientStart, fontSize: 15 }}>Chiudi</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.gradientStart} />
          </View>
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            ListEmptyComponent={
              <Text style={{ color: colors.mutedForeground, textAlign: "center", marginTop: 32 }}>
                Nessun commento ancora. Sii il primo!
              </Text>
            }
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", marginBottom: 16, gap: 10 }}>
                {item.author?.avatarUrl ? (
                  <Image source={{ uri: photoUrl(item.author.avatarUrl) }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                ) : (
                  <DefaultAvatar size={32} />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "700" }}>
                    {item.author?.displayName ?? "Utente"}{" "}
                    <Text style={{ color: colors.mutedForeground, fontWeight: "400" }}>· {timeAgo(item.createdAt)}</Text>
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: 14, marginTop: 2 }}>{item.text}</Text>
                </View>
              </View>
            )}
          />
        )}
        {authToken && (
          <View style={{ flexDirection: "row", alignItems: "center", padding: 12, paddingBottom: Math.max(insets.bottom, 12), borderTopWidth: 1, borderTopColor: colors.border, gap: 8 }}>
            <TextInput
              ref={inputRef}
              value={text}
              onChangeText={setText}
              placeholder="Scrivi un commento..."
              placeholderTextColor={colors.mutedForeground}
              style={{ flex: 1, backgroundColor: colors.card, color: colors.foreground, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: 14 }}
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={postComment}
            />
            <TouchableOpacity
              onPress={postComment}
              disabled={!text.trim() || posting}
              style={{ backgroundColor: colors.gradientStart, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, opacity: (!text.trim() || posting) ? 0.5 : 1 }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>Invia</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
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
      <User size={size * 0.45} color="rgba(255,255,255,0.9)" />
    </LinearGradient>
  );
}

function FeedCard({ item, authToken }: { item: FeedItem; authToken: string | null }) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "adesso";
    if (m < 60) return `${m}m fa`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h fa`;
    return `${Math.floor(h / 24)}g fa`;
  };

  const handleLike = async () => {
    if (!authToken || liking) return;
    setLiking(true);
    try {
      if (liked) {
        const result = await apiUnlikePhoto(item.id, authToken);
        setLiked(result.liked);
        setLikeCount(result.likeCount);
      } else {
        const result = await apiLikePhoto(item.id, authToken);
        setLiked(result.liked);
        setLikeCount(result.likeCount);
      }
    } catch {
    } finally {
      setLiking(false);
    }
  };

  const isEvent = item.type === "event";

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        {item.author?.avatarUrl ? (
          <Image source={{ uri: photoUrl(item.author.avatarUrl) }} style={styles.feedAvatar} />
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
        {isEvent && (
          <View style={[styles.eventBadge, { backgroundColor: colors.gradientStart + "22" }]}>
            <Text style={{ color: colors.gradientStart, fontSize: 11, fontWeight: "600", fontFamily: "Inter_600SemiBold" }}>Evento</Text>
          </View>
        )}
      </View>
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push(`/event/${item.eventId}`)}>
        {isEvent ? (
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.eventCardContent}
          >
            <Calendar size={36} color="rgba(255,255,255,0.9)" />
            <Text style={styles.eventCardTitle} numberOfLines={2}>{item.title ?? "Evento"}</Text>
          </LinearGradient>
        ) : (
          <Image
            source={{ uri: photoUrl(item.objectPath ?? "") }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
      {!isEvent && (
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={handleLike} disabled={!authToken || liking} style={styles.likeButton}>
            <Heart
              size={22}
              color={liked ? "#EC4899" : colors.mutedForeground}
              fill={liked ? "#EC4899" : "none"}
            />
            {likeCount > 0 && (
              <Text style={[styles.likeCount, { color: liked ? "#EC4899" : colors.mutedForeground }]}>
                {likeCount}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)} style={[styles.likeButton, { marginLeft: 14 }]}>
            <MessageCircle size={22} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      )}
      {!isEvent && (
        <CommentsModal
          visible={showComments}
          photoId={item.id}
          onClose={() => setShowComments(false)}
          authToken={authToken}
        />
      )}
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
        <Image
          source={require("@/assets/images/piclo-logo-white.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
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
          renderItem={({ item }) => <FeedCard item={item} authToken={token} />}
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
  logoImage: { width: 90, height: 28 },
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
  eventBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  eventCardContent: { width: "100%", aspectRatio: 1.5, alignItems: "center", justifyContent: "center", gap: 12, padding: 20 },
  eventCardTitle: { color: "#fff", fontSize: 18, fontWeight: "800", textAlign: "center", letterSpacing: -0.3 },
  cardActions: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8 },
  likeButton: { flexDirection: "row", alignItems: "center", gap: 5 },
  likeCount: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  emptyTitle: { fontSize: 20, fontWeight: "800", textAlign: "center" },
  emptyText: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  loadingState: { flex: 1, alignItems: "center", justifyContent: "center" },
});
