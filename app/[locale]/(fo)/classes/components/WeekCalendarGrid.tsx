"use client";

import * as React from "react";
import { Box, Paper, Typography } from "@mui/material";
import type { ClassSessionDto } from "../types/classes";
import { dateKeyLocal, fmtDayHeader, fmtTime } from "../utils/date";

type Props = {
  weekDays: Date[];
  byDay: Record<string, ClassSessionDto[]>;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
};

function minutesFromMidnight(d: Date) {
  return d.getHours() * 60 + d.getMinutes();
}

export function WeekCalendarGrid({
  weekDays,
  byDay,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  // Always show the full day (00:00–23:00) for a true calendar feel.
  const startHour = 0;
  const hours = React.useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const HOUR_PX = 64;
  const HEADER_PX = 44;
  const LEFT_COL_PX = 72;

  // Total calendar height (24h)
  const bodyHeight = hours.length * HOUR_PX;

  return (
    <Paper
      variant="outlined"
      sx={{
        // Make the calendar area scrollable (both axes if needed)
        // without affecting the rest of the page.
        display: "flex",
        flexDirection: "column",
        height: "min(78vh, 980px)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box
          sx={{
            minWidth: 900,
            display: "grid",
            gridTemplateColumns: `${LEFT_COL_PX}px repeat(7, minmax(0, 1fr))`,
            gridTemplateRows: `${HEADER_PX}px ${bodyHeight}px`,
          }}
        >
          {/* Header left corner (sticky) */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              left: 0,
              zIndex: 4,
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          />

          {/* Day headers (sticky) */}
          {weekDays.map((d) => (
            <Box
              key={`hdr-${dateKeyLocal(d)}`}
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 3,
                backgroundColor: "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
                borderRight: "1px solid",
                borderColorRight: "divider",
                px: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography fontWeight={900} sx={{ textTransform: "capitalize" }}>
                {fmtDayHeader(d)}
              </Typography>
            </Box>
          ))}

          {/* Body: left hours column (sticky on horizontal scroll) */}
          <Box
            sx={{
              position: "sticky",
              left: 0,
              zIndex: 2,
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          >
            {hours.map((h, idx) => (
              <Box
                key={`h-${h}`}
                sx={{
                  height: HOUR_PX,
                  borderBottom: idx === hours.length - 1 ? "none" : "1px solid",
                  borderColor: "divider",
                  px: 1,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  pt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary" fontWeight={800}>
                  {String(h).padStart(2, "0")}:00
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Body: 7 day columns */}
          {weekDays.map((d) => {
            const key = dateKeyLocal(d);
            const sessions = byDay[key] || [];
            return (
              <CalendarDayColumn
                key={`day-${key}`}
                day={d}
                sessions={sessions}
                busyId={busyId}
                onBook={onBook}
                onCancel={onCancel}
                t={t}
                startHour={startHour}
                hourPx={HOUR_PX}
                hoursCount={hours.length}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}

function CalendarDayColumn({
  day,
  sessions,
  busyId,
  onBook,
  onCancel,
  t,
  startHour,
  hourPx,
  hoursCount,
}: {
  day: Date;
  sessions: ClassSessionDto[];
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
  startHour: number;
  hourPx: number;
  hoursCount: number;
}) {
  const sorted = React.useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    [sessions],
  );

  const height = hoursCount * hourPx;

  return (
    <Box
      sx={{
        position: "relative",
        height,
        borderRight: "1px solid",
        borderColor: "divider",
        // subtle hour lines
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${hourPx - 1}px, rgba(0,0,0,0.08) ${hourPx - 1}px, rgba(0,0,0,0.08) ${hourPx}px)`,
      }}
    >
      {sorted.map((s) => (
        <CalendarSessionBlock
          key={s.id}
          s={s}
          busyId={busyId}
          onBook={onBook}
          onCancel={onCancel}
          t={t}
          startHour={startHour}
          hourPx={hourPx}
        />
      ))}
    </Box>
  );
}

function CalendarSessionBlock({
  s,
  busyId,
  onBook,
  onCancel,
  t,
  startHour,
  hourPx,
}: {
  s: ClassSessionDto;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
  startHour: number;
  hourPx: number;
}) {
  const start = new Date(s.startsAt);
  const end = new Date(s.endsAt);

  const startMins = minutesFromMidnight(start);
  const endMins = minutesFromMidnight(end);
  const top = ((startMins - startHour * 60) / 60) * hourPx;
  const height = Math.max(44, ((endMins - startMins) / 60) * hourPx);

  const isBusy =
    busyId !== null && (busyId === s.id || busyId === s.myBookingId);

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        position: "absolute",
        left: 8,
        right: 8,
        top: Math.max(4, top + 4),
        height: Math.max(44, height - 8),
        overflow: "hidden",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.25,
      }}
    >
      <Typography variant="caption" fontWeight={900}>
        {fmtTime(start)}–{fmtTime(end)}
      </Typography>

      <Typography variant="body2" fontWeight={900} noWrap title={s.title}>
        {s.title}
      </Typography>

      <Typography variant="caption" color="text.secondary" fontWeight={700} noWrap>
        {s.type}
        {s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}
      </Typography>

      <Box sx={{ mt: "auto" }}>
        {s.myBookingId ? (
          <Box
            component="button"
            onClick={() => onCancel(s.myBookingId!)}
            disabled={isBusy}
            style={{
              width: "100%",
              border: "1px solid rgba(211,47,47,0.5)",
              borderRadius: 8,
              padding: "6px 8px",
              background: "transparent",
              cursor: isBusy ? "not-allowed" : "pointer",
              fontWeight: 800,
              color: "#d32f2f",
            }}
            aria-label={t("cancel")}
          >
            {isBusy ? "…" : t("cancel")}
          </Box>
        ) : (
          <Box
            component="button"
            onClick={() => onBook(s.id)}
            disabled={isBusy || s.isFull}
            style={{
              width: "100%",
              border: "none",
              borderRadius: 8,
              padding: "6px 8px",
              background: s.isFull ? "rgba(0,0,0,0.12)" : "#1976d2",
              cursor: isBusy || s.isFull ? "not-allowed" : "pointer",
              fontWeight: 800,
              color: s.isFull ? "rgba(0,0,0,0.55)" : "#fff",
            }}
            aria-label={s.isFull ? t("full") : t("book")}
          >
            {isBusy ? "…" : s.isFull ? t("full") : t("book")}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
