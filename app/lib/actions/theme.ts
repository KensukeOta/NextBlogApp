"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function setTheme(theme: "light" | "dark" | "system") {
  const cookieStore = await cookies();
  cookieStore.set("theme", theme, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  // レイアウト再評価で <html data-theme> も即切替
  revalidatePath("/", "layout");
}
