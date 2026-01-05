import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "../../lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const form = await req.formData();
  const to = form.get("to") as string;
  const like = form.get("like") === "1";

  if (!like) {
    return NextResponse.redirect(new URL("/discover", req.url));
  }

  const me = (session.user as any).id;

  await db.query(
    `INSERT INTO "Like"("fromUserId","toUserId")
     VALUES($1,$2) ON CONFLICT DO NOTHING`,
    [me, to]
  );

  const match = await db.query(
    `SELECT id FROM "Like" WHERE "fromUserId"=$1 AND "toUserId"=$2`,
    [to, me]
  );

  if (match.rowCount) {
    await db.query(
      `INSERT INTO "Match"("userAId","userBId")
       VALUES($1,$2) ON CONFLICT DO NOTHING`,
      [me, to]
    );
  }

  return NextResponse.redirect(new URL("/discover", req.url));
}
