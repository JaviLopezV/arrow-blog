"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

type ClassSessionDto = {
  id: string;
  title: string;
  type: string;
  instructor: string | null;
  notes: string | null;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookedCount: number;
  remaining: number;
  isFull: boolean;
  myBookingId: string | null;
};

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function fmtTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function ClassesClient() {
  const t = useTranslations("fo.classes");

  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [items, setItems] = React.useState<ClassSessionDto[]>([]);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/classes", { cache: "no-store" });
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data?.error || "LOAD_FAILED");
      setItems(data.sessions || []);
    } catch (e: any) {
      console.log(e);
      setErr(e?.message || "LOAD_FAILED");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  async function book(sessionId: string) {
    setBusyId(sessionId);
    setErr(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "BOOK_FAILED");
      await load();
    } catch (e: any) {
      setErr(e?.message || "BOOK_FAILED");
    } finally {
      setBusyId(null);
    }
  }

  async function cancel(bookingId: string) {
    setBusyId(bookingId);
    setErr(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "CANCEL_FAILED");
      await load();
    } catch (e: any) {
      setErr(e?.message || "CANCEL_FAILED");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return (
      <Stack alignItems="center" py={6}>
        <CircularProgress />
      </Stack>
    );
  }

  if (err) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{t(`errors.UNAUTHORIZED`)}</Alert>
        <Button variant="contained" onClick={load}>
          {t("retry")}
        </Button>
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <Paper variant="outlined">
        <Box p={3}>
          <Typography color="text.secondary">{t("empty")}</Typography>
        </Box>
      </Paper>
    );
  }

  // Agrupar por fecha
  const grouped = items.reduce<Record<string, ClassSessionDto[]>>((acc, it) => {
    const d = new Date(it.startsAt);
    const key = d.toISOString().slice(0, 10);
    (acc[key] ||= []).push(it);
    return acc;
  }, {});

  const keys = Object.keys(grouped).sort();

  return (
    <Stack spacing={2}>
      {keys.map((k) => {
        const day = new Date(k + "T00:00:00");
        const list = grouped[k];

        return (
          <Paper key={k} variant="outlined">
            <Box px={3} py={2}>
              <Typography fontWeight={800}>{fmtDate(day)}</Typography>
            </Box>
            <Divider />

            <Stack>
              {list.map((s) => {
                const start = new Date(s.startsAt);
                const end = new Date(s.endsAt);
                const isBusy =
                  busyId === s.id ||
                  (s.myBookingId && busyId === s.myBookingId);

                return (
                  <Box
                    key={s.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "140px 1fr 220px" },
                      gap: 2,
                      px: 3,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      alignItems: { sm: "center" },
                    }}
                  >
                    <Typography fontWeight={700}>
                      {fmtTime(start)}–{fmtTime(end)}
                    </Typography>

                    <Box>
                      <Typography fontWeight={800}>
                        {s.title}{" "}
                        <Typography component="span" color="text.secondary">
                          · {s.type}
                        </Typography>
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {`${s.remaining} ${t("spots")} ${s.capacity}`}
                        {s.instructor
                          ? ` · ${t("instructor")}: ${s.instructor}`
                          : ""}
                      </Typography>

                      {s.notes && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {s.notes}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ justifySelf: { sm: "end" } }}>
                      {s.myBookingId ? (
                        <Button
                          variant="outlined"
                          color="error"
                          disabled={isBusy}
                          onClick={() => cancel(s.myBookingId!)}
                          endIcon={
                            isBusy ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : undefined
                          }
                        >
                          {t("cancel")}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          disabled={isBusy || s.isFull}
                          onClick={() => book(s.id)}
                          endIcon={
                            isBusy ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : undefined
                          }
                        >
                          {s.isFull ? t("full") : t("book")}
                        </Button>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
