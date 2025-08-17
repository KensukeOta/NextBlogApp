import "server-only";
import { cookies } from "next/headers";

export type FlashType = "success" | "error" | "info" | "warning";
export type FlashPayload = {
  id?: string;
  type?: FlashType;
  message: string;
};

export async function setFlash(payload: FlashPayload) {
  const cookieStore = await cookies();

  const value = JSON.stringify({
    id: payload.id ?? crypto.randomUUID(),
    type: payload.type ?? "success",
    message: payload.message,
  });

  cookieStore.set("flash", value, {
    path: "/",
    httpOnly: false, // クライアント(Toast)で読んで消すので false
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 20,
  });
}

export async function clearFlash() {
  const store = await cookies();
  store.set("flash", "", { path: "/", maxAge: 0 });
}
