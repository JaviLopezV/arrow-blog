"use client";

import { useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import {
  deleteClassSession,
  updateClassSession,
  type ClassActionState,
} from "../../actions";
import { useTranslations } from "next-intl";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

type Props = {
  session: {
    id: string;
    title: string;
    type: string;
    instructor: string | null;
    notes: string | null;
    startsAt: Date;
    endsAt: Date;
    capacity: number;
  };
};

const initialState: ClassActionState = { ok: true };

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function EditClassForm({ session }: Props) {
  const t = useTranslations("bo.boEditClass");
  const tNew = useTranslations("bo.boNewClass");

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [state, formAction, isPending] = useActionState(
    updateClassSession.bind(null, locale, session.id),
    initialState,
  );

  useEffect(() => {
    if (state.ok && state.classId) router.refresh();
  }, [state, router]);

  async function handleDelete() {
    // confirm simple (sin modal)
    // eslint-disable-next-line no-alert
    if (!confirm("¿Eliminar esta clase?")) return;

    await deleteClassSession(locale, session.id);
    router.push(`/${locale}/bo/classes`);
    router.refresh();
  }

  const goBack = () => router.push(`/${locale}/bo/classes`);

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton onClick={goBack} aria-label={"back"}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={800}>
          {t("title")}
        </Typography>
      </Stack>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box component="form" action={formAction}>
          <Stack spacing={2}>
            {state.ok === false && (state.formError || state.fieldErrors) && (
              <Alert severity="error">
                {state.formError ?? tNew("errors.reviewFields")}
              </Alert>
            )}

            <TextField
              name="title"
              label={tNew("fields.title")}
              required
              defaultValue={session.title}
              error={state.ok === false && !!state.fieldErrors?.title}
              helperText={
                state.ok === false ? state.fieldErrors?.title?.[0] : ""
              }
            />

            <TextField
              name="type"
              label={tNew("fields.type")}
              required
              defaultValue={session.type}
              error={state.ok === false && !!state.fieldErrors?.type}
              helperText={
                state.ok === false ? state.fieldErrors?.type?.[0] : ""
              }
            />

            <TextField
              name="instructor"
              label={tNew("fields.instructor")}
              defaultValue={session.instructor ?? ""}
            />

            <TextField
              name="notes"
              label={tNew("fields.notes")}
              multiline
              minRows={2}
              defaultValue={session.notes ?? ""}
            />

            <TextField
              name="startsAt"
              label={tNew("fields.startsAt")}
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              required
              defaultValue={toDatetimeLocal(new Date(session.startsAt))}
              error={state.ok === false && !!state.fieldErrors?.startsAt}
              helperText={
                state.ok === false ? state.fieldErrors?.startsAt?.[0] : ""
              }
            />

            <TextField
              name="endsAt"
              label={tNew("fields.endsAt")}
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              required
              defaultValue={toDatetimeLocal(new Date(session.endsAt))}
              error={state.ok === false && !!state.fieldErrors?.endsAt}
              helperText={
                state.ok === false ? state.fieldErrors?.endsAt?.[0] : ""
              }
            />

            <TextField
              name="capacity"
              label={tNew("fields.capacity")}
              type="number"
              inputProps={{ min: 1 }}
              required
              defaultValue={session.capacity}
              error={state.ok === false && !!state.fieldErrors?.capacity}
              helperText={
                state.ok === false ? state.fieldErrors?.capacity?.[0] : ""
              }
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isPending}
              >
                {isPending ? t("submit.pending") : t("submit.idle")}
              </Button>

              <Button
                type="button"
                variant="outlined"
                color="error"
                size="large"
                onClick={handleDelete}
                disabled={isPending}
              >
                {t("delete.idle")}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </>
  );
}
