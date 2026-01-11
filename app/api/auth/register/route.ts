import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { randomUUID } from "crypto";
import { rateLimitOr429 } from "@/app/lib/rateLimit";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  // ✅ 5 registros / minuto / IP
  const limited = await rateLimitOr429(req, {
    key: "auth:register",
    limit: 5,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  const exists = await db.query('SELECT id FROM "User" WHERE email=$1', [email]);
  if (exists.rowCount) {
    return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const id = randomUUID();

  await db.query(
    `INSERT INTO "User"(id, email, password, name, role, "createdAt", "updatedAt")
     VALUES($1, $2, $3, $4, $5, now(), now())`,
    [id, email, hash, name ?? null, "CLIENT"]
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
