import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// PATCH /api/proxy/user/[id]
export async function PATCH(req: NextRequest, segmentData: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const body = await req.json();
  const params = await segmentData.params;
  const id = params.id;

  // Rails API PATCH
  const apiRes = await fetch(`${process.env.API_URL}/v1/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": String(token.id),
    },
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
