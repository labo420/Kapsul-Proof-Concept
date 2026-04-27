import Constants from "expo-constants";
import { Platform } from "react-native";

const domain =
  Constants.expoConfig?.extra?.apiDomain ??
  process.env.EXPO_PUBLIC_DOMAIN ??
  "";

export const API_BASE = domain ? `https://${domain}/api` : "/api";

export interface ApiEvent {
  id: string;
  name: string;
  date: string;
  deliveryMode: "party" | "morning_after" | "vault";
  vaultHours: number;
  plan: "free" | "party" | "pro";
  themeGradientStart: string;
  themeGradientEnd: string;
  coverImagePath: string | null;
  photoCount: number;
  guestCount: number;
  isActive: boolean;
  hostToken?: string | null;
  createdAt: string;
}

export interface ApiPhoto {
  id: string;
  eventId: string;
  guestId: string;
  objectPath: string;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface ApiGuest {
  guestId: string;
  joinedAt: string;
  photoCount: number;
}

export async function apiCreateEvent(
  payload: Omit<ApiEvent, "coverImagePath" | "isActive" | "createdAt" | "photoCount" | "guestCount">
): Promise<ApiEvent> {
  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Create event failed: ${res.status}`);
  return res.json() as Promise<ApiEvent>;
}

export async function apiGetEvent(id: string): Promise<ApiEvent> {
  const res = await fetch(`${API_BASE}/events/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Get event failed: ${res.status}`);
  return res.json() as Promise<ApiEvent>;
}

export async function apiJoinEvent(
  eventId: string,
  guestId: string
): Promise<{ event: ApiEvent; guestToken: string }> {
  const res = await fetch(
    `${API_BASE}/events/${encodeURIComponent(eventId)}/join`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId }),
    }
  );
  if (res.status === 403) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    const err = new Error("guest_limit_reached") as Error & { code: string };
    err.code = body.error ?? "guest_limit_reached";
    throw err;
  }
  if (!res.ok) throw new Error(`Join event failed: ${res.status}`);
  return res.json() as Promise<{ event: ApiEvent; guestToken: string }>;
}

export async function apiGetGuests(eventId: string, hostToken: string): Promise<ApiGuest[]> {
  const res = await fetch(
    `${API_BASE}/events/${encodeURIComponent(eventId)}/guests?hostToken=${encodeURIComponent(hostToken)}`
  );
  if (!res.ok) throw new Error(`Get guests failed: ${res.status}`);
  return res.json() as Promise<ApiGuest[]>;
}

export async function apiRemoveGuest(
  eventId: string,
  guestId: string,
  token: string
): Promise<{ removed: boolean; photosDeleted: number }> {
  const res = await fetch(
    `${API_BASE}/events/${encodeURIComponent(eventId)}/guests/${encodeURIComponent(guestId)}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }
  );
  if (!res.ok) throw new Error(`Remove guest failed: ${res.status}`);
  return res.json() as Promise<{ removed: boolean; photosDeleted: number }>;
}

export async function apiGetPhotos(eventId: string): Promise<ApiPhoto[]> {
  const res = await fetch(
    `${API_BASE}/events/${encodeURIComponent(eventId)}/photos`
  );
  if (!res.ok) throw new Error(`Get photos failed: ${res.status}`);
  return res.json() as Promise<ApiPhoto[]>;
}

export async function apiUploadPhoto(
  eventId: string,
  guestId: string,
  fileUri: string,
  mimeType: string,
  onProgress?: (pct: number) => void
): Promise<ApiPhoto> {
  const ext = mimeType.includes("png") ? "png" : "jpg";
  const fileName = `photo.${ext}`;

  const form = new FormData();
  form.append("guestId", guestId);

  if (Platform.OS === "web") {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    form.append("photo", blob, fileName);
  } else {
    form.append("photo", {
      uri: fileUri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${API_BASE}/events/${encodeURIComponent(eventId)}/photos`;
    xhr.open("POST", url);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as ApiPhoto);
        } catch {
          reject(new Error("Invalid JSON response"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.send(form);
  });
}

export function photoUrl(objectPath: string): string {
  if (objectPath.startsWith("/api/")) {
    const domain2 =
      Constants.expoConfig?.extra?.apiDomain ??
      process.env.EXPO_PUBLIC_DOMAIN ??
      "";
    return domain2 ? `https://${domain2}${objectPath}` : objectPath;
  }
  return objectPath;
}
