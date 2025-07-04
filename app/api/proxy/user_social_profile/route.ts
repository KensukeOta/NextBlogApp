import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// POST /api/proxy/user_social_profile
export async function POST(req: NextRequest) {
  // JWT（セッショントークン）からユーザー情報を取得
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // 認証されていなければ401
  if (!token?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // クライアントからのリクエストボディ（＝投稿データ）を取得
  const body = await req.json();

  // Rails API へリクエスト
  const apiRes = await fetch(`${process.env.API_URL}/v1/user_social_profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ここでX-USER-IDは必ずstringで送ること！
      "X-USER-ID": String(token.id),
    },
    body: JSON.stringify(body),
  });

  // Railsからのレスポンスをそのまま返す
  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
