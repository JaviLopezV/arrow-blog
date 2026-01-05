import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db } from "../../../lib/db";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(req: Request) {
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

  // ✅ OJO: gen_random_uuid() requiere extensión pgcrypto
  // Si te falla, abajo te pongo alternativa.
  await db.query(
    `INSERT INTO "User"(id,email,password,name,"createdAt")
     VALUES(gen_random_uuid(), $1, $2, $3, now())`,
    [email, hash, name ?? null]
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
