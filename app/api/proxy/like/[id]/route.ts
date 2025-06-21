import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function DELETE(req: NextRequest, segmentData: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (!token?.id) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  const params = await segmentData.params;
  const id = params.id;

  // Rails API DELETE
  const apiRes = await fetch(`${process.env.API_URL}/v1/likes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": String(token.id),
    },
  });

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
