"use server";

import { prisma } from "@/app/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export type ClassActionState =
  | { ok: true; classId?: string }
  | { ok: false; fieldErrors?: Record<string, string[]>; formError?: string };

async function requireBoUser(locale: string) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role;

  if (!session) redirect(`/${locale}/login`);
  if (role !== "ADMIN" && role !== "SUPERADMIN") redirect(`/${locale}`);

  return true;
}

const ClassUpsertSchema = z.object({
  title: z.string().min(1, "Título obligatorio"),
  type: z.string().min(1, "Tipo obligatorio"),
  instructor: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  startsAt: z.string().min(1, "Inicio obligatorio"),
  endsAt: z.string().min(1, "Fin obligatorio"),
  capacity: z.coerce.number().int().min(1, "Aforo mínimo 1"),
});

function parseDateOrThrow(v: string, key: string) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) throw new Error(`INVALID_${key}`);
  return d;
}

export async function createClassSession(
  locale: string,
  _prev: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  await requireBoUser(locale);

  const parsed = ClassUpsertSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    instructor: (formData.get("instructor") as string) || null,
    notes: (formData.get("notes") as string) || null,
    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: flat.fieldErrors,
      formError: flat.formErrors?.[0],
    };
  }

  try {
    const starts = parseDateOrThrow(parsed.data.startsAt, "STARTS_AT");
    const ends = parseDateOrThrow(parsed.data.endsAt, "ENDS_AT");
    if (ends <= starts)
      return {
        ok: false,
        formError: "La hora de fin debe ser posterior al inicio.",
      };

    const created = await prisma.classSession.create({
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        instructor: parsed.data.instructor || null,
        notes: parsed.data.notes || null,
        startsAt: starts,
        endsAt: ends,
        capacity: parsed.data.capacity,
      },
      select: { id: true },
    });

    return { ok: true, classId: created.id };
  } catch {
    return { ok: false, formError: "No se pudo crear la clase." };
  }
}

export async function updateClassSession(
  locale: string,
  classId: string,
  _prev: ClassActionState,
  formData: FormData,
): Promise<ClassActionState> {
  await requireBoUser(locale);

  const parsed = ClassUpsertSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    instructor: (formData.get("instructor") as string) || null,
    notes: (formData.get("notes") as string) || null,
    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),
    capacity: formData.get("capacity"),
  });

  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return {
      ok: false,
      fieldErrors: flat.fieldErrors,
      formError: flat.formErrors?.[0],
    };
  }

  try {
    const starts = parseDateOrThrow(parsed.data.startsAt, "STARTS_AT");
    const ends = parseDateOrThrow(parsed.data.endsAt, "ENDS_AT");
    if (ends <= starts)
      return {
        ok: false,
        formError: "La hora de fin debe ser posterior al inicio.",
      };

    await prisma.classSession.update({
      where: { id: classId },
      data: {
        title: parsed.data.title,
        type: parsed.data.type,
        instructor: parsed.data.instructor || null,
        notes: parsed.data.notes || null,
        startsAt: starts,
        endsAt: ends,
        capacity: parsed.data.capacity,
      },
      select: { id: true },
    });

    return { ok: true, classId };
  } catch {
    return { ok: false, formError: "No se pudo guardar la clase." };
  }
}

export async function deleteClassSession(locale: string, classId: string) {
  await requireBoUser(locale);
  await prisma.classSession.delete({
    where: { id: classId },
    select: { id: true },
  });
}
