import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { authOptions } from "@/app/lib/auth";
import { rateLimitOr429 } from "@/app/lib/rateLimit";

const handler = NextAuth(authOptions);

type Ctx = { params: { nextauth: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return handler(req as any, ctx as any);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  // ✅ Rate limit solo en POST (login/callbacks)
  const limited = await rateLimitOr429(req, {
    key: "auth:nextauth:post",
    limit: 20,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  return handler(req as any, ctx as any);
}
