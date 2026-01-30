"use client";

import * as React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
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

function isSameDayLocal(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function WeekCalendarGrid({
  weekDays,
  byDay,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  // Full day (00:00–23:00)
  const startHour = 0;
  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    [],
  );

  // Sizing
  const HOUR_PX = 64;
  const HEADER_PX = 48;
  const LEFT_COL_PX = 76;

  const bodyHeight = hours.length * HOUR_PX;
  const today = React.useMemo(() => new Date(), []);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "min(78vh, 980px)",
        overflow: "hidden",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Box
          sx={{
            minWidth: 980,
            display: "grid",
            gridTemplateColumns: `${LEFT_COL_PX}px repeat(7, minmax(0, 1fr))`,
            gridTemplateRows: `${HEADER_PX}px ${bodyHeight}px`,
          }}
        >
          {/* Sticky top-left corner */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              left: 0,
              zIndex: 6,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          />

          {/* Sticky day headers */}
          {weekDays.map((d) => {
            const isToday = isSameDayLocal(d, today);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;

            return (
              <Box
                key={`hdr-${dateKeyLocal(d)}`}
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 5,
                  bgcolor: "background.paper",
                  borderBottom: "1px solid",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  px: 1.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  backdropFilter: "saturate(180%) blur(8px)",
                }}
              >
                <Typography
                  fontWeight={900}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: 13,
                    color: isWeekend ? "text.secondary" : "text.primary",
                  }}
                >
                  {fmtDayHeader(d)}
                </Typography>

                {isToday ? (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "999px",
                      bgcolor: "primary.main",
                      boxShadow: "0 0 0 3px rgba(25,118,210,0.15)",
                    }}
                    aria-label="today"
                  />
                ) : null}
              </Box>
            );
          })}

          {/* Sticky hours column */}
          <Box
            sx={{
              position: "sticky",
              left: 0,
              zIndex: 4,
              bgcolor: "background.paper",
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
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 900, color: "text.secondary" }}
                >
                  {String(h).padStart(2, "0")}:00
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Day columns */}
          {weekDays.map((d) => {
            const key = dateKeyLocal(d);
            const sessions = byDay[key] || [];
            const isToday = isSameDayLocal(d, today);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;

            return (
              <CalendarDayColumn
                key={`day-${key}`}
                sessions={sessions}
                busyId={busyId}
                onBook={onBook}
                onCancel={onCancel}
                t={t}
                startHour={startHour}
                hourPx={HOUR_PX}
                hoursCount={hours.length}
                tone={isToday ? "today" : isWeekend ? "weekend" : "normal"}
              />
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
}

function CalendarDayColumn({
  sessions,
  busyId,
  onBook,
  onCancel,
  t,
  startHour,
  hourPx,
  hoursCount,
  tone,
}: {
  sessions: ClassSessionDto[];
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
  startHour: number;
  hourPx: number;
  hoursCount: number;
  tone: "normal" | "today" | "weekend";
}) {
  const sorted = React.useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    [sessions],
  );

  const height = hoursCount * hourPx;

  const bg =
    tone === "today"
      ? "rgba(25,118,210,0.06)"
      : tone === "weekend"
        ? "rgba(0,0,0,0.02)"
        : "transparent";

  return (
    <Box
      sx={{
        position: "relative",
        height,
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: bg,
        backgroundImage: `
          repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent ${hourPx - 1}px,
            rgba(0,0,0,0.07) ${hourPx - 1}px,
            rgba(0,0,0,0.07) ${hourPx}px
          )
        `,
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
  const rawHeight = ((endMins - startMins) / 60) * hourPx;

  const blockHeight = Math.max(44, rawHeight - 8);
  const compact = blockHeight < 88;

  const isBusy =
    busyId !== null && (busyId === s.id || busyId === s.myBookingId);

  const booked = Boolean(s.myBookingId);
  const full = Boolean(s.isFull);

  const borderColor = booked ? "rgba(211,47,47,0.35)" : "rgba(25,118,210,0.30)";
  const headerBg = booked ? "rgba(211,47,47,0.10)" : "rgba(25,118,210,0.10)";

  // ✅ Click on the whole block also triggers the correct API call
  const handleBlockClick = () => {
    if (isBusy) return;
    if (booked) {
      onCancel(s.myBookingId!);
      return;
    }
    if (full) return;
    onBook(s.id);
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      onClick={handleBlockClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleBlockClick();
        }
      }}
      sx={{
        position: "absolute",
        left: 8,
        right: 8,
        top: Math.max(4, top + 4),
        height: blockHeight,
        borderRadius: 2.5,
        borderColor,
        overflow: "hidden",
        cursor: isBusy
          ? "progress"
          : full && !booked
            ? "not-allowed"
            : "pointer",
        userSelect: "none",
        boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
        "&:hover": {
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          transform: "translateY(-1px)",
          transition: "all 160ms ease",
        },
        "&:focus-visible": {
          outline: "2px solid rgba(25,118,210,0.35)",
          outlineOffset: 2,
        },
      }}
    >
      {/* Header strip */}
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: headerBg,
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 900 }}>
          {fmtTime(start)}–{fmtTime(end)}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            color: booked
              ? "error.main"
              : full
                ? "text.secondary"
                : "primary.main",
            whiteSpace: "nowrap",
          }}
        >
          {booked ? t("cancel") : full ? t("full") : t("book")}
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          px: 1,
          py: 0.75,
          height: `calc(100% - 28px)`,
          display: "grid",
          gridTemplateRows: compact ? "auto auto auto" : "auto auto 1fr auto",
          gap: 0.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 900, lineHeight: 1.15 }}
          noWrap
          title={s.title}
        >
          {s.title}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 800 }}
          noWrap
          title={`${s.type}${s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}`}
        >
          {s.type}
          {s.instructor ? ` · ${t("instructor")}: ${s.instructor}` : ""}
        </Typography>

        {!compact ? <Box /> : null}

        {/* Button: stopPropagation so it doesn't double-trigger */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {booked ? (
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="error"
              disabled={isBusy}
              onClick={(e) => {
                e.stopPropagation();
                onCancel(s.myBookingId!);
              }}
              sx={{
                fontWeight: 900,
                textTransform: "none",
                borderRadius: 2,
                minHeight: compact ? 26 : 30,
                py: 0,
              }}
            >
              {isBusy ? "…" : t("cancel")}
            </Button>
          ) : (
            <Button
              fullWidth
              size="small"
              variant="contained"
              disabled={isBusy || full}
              onClick={(e) => {
                e.stopPropagation();
                if (!full) onBook(s.id);
              }}
              sx={{
                fontWeight: 900,
                textTransform: "none",
                borderRadius: 2,
                minHeight: compact ? 26 : 30,
                py: 0,
              }}
            >
              {isBusy ? "…" : full ? t("full") : t("book")}
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
