import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

// Cambia esto a "delete" si prefieres borrar posts
const MODE: "anonymize" | "delete" = "anonymize";

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    if (MODE === "delete") {
      // Opción A: borrar posts y luego usuario
      await prisma.$transaction([
        prisma.post.deleteMany({ where: { authorId: userId } }),
        prisma.user.delete({ where: { id: userId } }),
      ]);
    } else {
      // Opción B: anonimizar posts y luego borrar usuario
      // 1) Crea (o reutiliza) un usuario "Deleted user" que quedará como autor.
      const deletedEmail = "deleted@arrow-blog.local";

      const deletedUser = await prisma.user.upsert({
        where: { email: deletedEmail },
        update: {},
        create: {
          email: deletedEmail,
          name: "Deleted user",
          password: null,
          role: "CLIENT",
        },
        select: { id: true },
      });

      // 2) Reasigna posts
      await prisma.$transaction([
        prisma.post.updateMany({
          where: { authorId: userId },
          data: { authorId: deletedUser.id },
        }),
        // 3) Borra el usuario
        prisma.user.delete({ where: { id: userId } }),
      ]);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}
