"use client";

import * as React from "react";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
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

type LayoutInfo = { col: number; cols: number };

function layoutOverlaps(
  sessions: ClassSessionDto[],
): Record<string, LayoutInfo> {
  const sorted = sessions
    .slice()
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

  const out: Record<string, LayoutInfo> = {};
  let cluster: ClassSessionDto[] = [];
  let activeEnds: number[] = [];

  const flushCluster = () => {
    if (cluster.length === 0) return;

    const clusterSorted = cluster
      .slice()
      .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

    const active: { end: number; col: number; id: string }[] = [];
    const freeCols: number[] = [];
    let maxCols = 1;

    for (const s of clusterSorted) {
      const start = +new Date(s.startsAt);
      const end = +new Date(s.endsAt);

      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].end <= start) {
          freeCols.push(active[i].col);
          active.splice(i, 1);
        }
      }
      freeCols.sort((a, b) => a - b);

      const col = freeCols.length ? freeCols.shift()! : active.length;
      active.push({ end, col, id: s.id });

      const colsNow = active.reduce((m, x) => Math.max(m, x.col + 1), 1);
      maxCols = Math.max(maxCols, colsNow);

      out[s.id] = { col, cols: 1 };
    }

    for (const s of cluster) {
      out[s.id].cols = maxCols;
    }

    cluster = [];
  };

  for (const s of sorted) {
    const start = +new Date(s.startsAt);
    const end = +new Date(s.endsAt);

    activeEnds = activeEnds.filter((e) => e > start);
    if (activeEnds.length === 0 && cluster.length > 0) flushCluster();

    cluster.push(s);
    activeEnds.push(end);
  }

  flushCluster();
  return out;
}

function useNowTickEveryMinute() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const msToNextMinute = 60000 - (Date.now() % 60000);
    const t1 = window.setTimeout(() => {
      setNow(new Date());
      const t2 = window.setInterval(() => setNow(new Date()), 60000);
      return () => window.clearInterval(t2);
    }, msToNextMinute);

    return () => window.clearTimeout(t1);
  }, []);

  return now;
}

export function WeekCalendarGrid({
  weekDays,
  byDay,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  const startHour = 0;
  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    [],
  );

  const HOUR_PX = 64;
  const HEADER_PX = 48;
  const LEFT_COL_PX = 76;

  const bodyHeight = hours.length * HOUR_PX;
  const today = React.useMemo(() => new Date(), []);
  const now = useNowTickEveryMinute();

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

          {weekDays.map((d) => {
            const key = dateKeyLocal(d);
            const sessions = byDay[key] || [];
            const isToday = isSameDayLocal(d, today);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;

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
                tone={isToday ? "today" : isWeekend ? "weekend" : "normal"}
                now={now}
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
  tone,
  now,
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
  tone: "normal" | "today" | "weekend";
  now: Date;
}) {
  const sorted = React.useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt)),
    [sessions],
  );

  const layout = React.useMemo(() => layoutOverlaps(sorted), [sorted]);
  const height = hoursCount * hourPx;

  const bg =
    tone === "today"
      ? "rgba(25,118,210,0.06)"
      : tone === "weekend"
        ? "rgba(0,0,0,0.02)"
        : "transparent";

  const showNowLine = isSameDayLocal(day, now);
  const nowTop = React.useMemo(() => {
    if (!showNowLine) return 0;
    const mins = minutesFromMidnight(now);
    return ((mins - startHour * 60) / 60) * hourPx;
  }, [showNowLine, now, startHour, hourPx]);

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
          ),
          repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent ${hourPx * 3 - 1}px,
            rgba(0,0,0,0.10) ${hourPx * 3 - 1}px,
            rgba(0,0,0,0.10) ${hourPx * 3}px
          )
        `,
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, px: 1 }}>
        {showNowLine ? (
          <Box
            sx={{
              position: "absolute",
              left: 4,
              right: 4,
              top: Math.max(0, Math.min(height - 1, nowTop)),
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                height: 2,
                bgcolor: "primary.main",
                borderRadius: 999,
                boxShadow: "0 0 0 3px rgba(25,118,210,0.10)",
              }}
            />
            <Typography
              variant="caption"
              sx={{
                mt: 0.25,
                display: "inline-block",
                fontWeight: 900,
                color: "primary.main",
                bgcolor: "background.paper",
                px: 0.75,
                py: 0.25,
                borderRadius: 999,
                boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
              }}
            >
              {fmtTime(now)}
            </Typography>
          </Box>
        ) : null}

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
            layout={layout[s.id]}
          />
        ))}
      </Box>
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
  layout,
}: {
  s: ClassSessionDto;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
  startHour: number;
  hourPx: number;
  layout?: LayoutInfo;
}) {
  const start = new Date(s.startsAt);
  const end = new Date(s.endsAt);

  const startMins = minutesFromMidnight(start);
  const endMins = minutesFromMidnight(end);

  const top = ((startMins - startHour * 60) / 60) * hourPx;
  const rawHeight = ((endMins - startMins) / 60) * hourPx;

  const blockHeight = Math.max(86, rawHeight - 8);
  const compact = blockHeight < 110;

  const isBusy =
    busyId !== null && (busyId === s.id || busyId === s.myBookingId);

  const booked = Boolean(s.myBookingId);
  const full = Boolean(s.isFull);

  const borderColor = booked ? "rgba(211,47,47,0.35)" : "rgba(25,118,210,0.30)";
  const headerBg = booked ? "rgba(211,47,47,0.10)" : "rgba(25,118,210,0.10)";

  const cols = Math.max(1, layout?.cols ?? 1);
  const col = Math.max(0, layout?.col ?? 0);

  const widthPct = 100 / cols;
  const leftPct = col * widthPct;

  const handleBlockClick = () => {
    if (isBusy) return;
    if (booked) {
      onCancel(s.myBookingId!);
      return;
    }
    if (full) return;
    onBook(s.id);
  };

  // ✅ Tooltip without new i18n keys (no t("type"))
  const tooltip = (
    <Box sx={{ p: 0.5, maxWidth: 320 }}>
      <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 0.25 }}>
        {s.title}
      </Typography>
      <Typography variant="caption" sx={{ display: "block" }}>
        {fmtDayHeader(start)} · {fmtTime(start)}–{fmtTime(end)}
      </Typography>
      <Typography variant="caption" sx={{ display: "block" }}>
        {s.type}
      </Typography>
      {s.instructor ? (
        <Typography variant="caption" sx={{ display: "block" }}>
          {t("instructor")}: {s.instructor}
        </Typography>
      ) : null}
      <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
        {booked ? t("cancel") : full ? "Full" : t("book")}
      </Typography>
    </Box>
  );

  return (
    <Tooltip title={tooltip} placement="top" arrow enterDelay={200}>
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
          left: `calc(${leftPct}% + 6px)`,
          width: `calc(${widthPct}% - 12px)`,
          top: Math.max(4, top + 4),
          height: blockHeight,
          borderRadius: 2,
          borderColor,
          overflow: "hidden",
          cursor: isBusy
            ? "progress"
            : full && !booked
              ? "not-allowed"
              : "pointer",
          userSelect: "none",
          bgcolor: "background.paper",
          boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          "&:hover": {
            boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
            transform: "translateY(-1px)",
            transition: "all 160ms ease",
          },
          "&:focus-visible": {
            outline: "2px solid rgba(25,118,210,0.35)",
            outlineOffset: 2,
          },
        }}
      >
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
          <Typography variant="caption" sx={{ fontWeight: 900 }} noWrap>
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
            noWrap
          >
            {booked ? t("cancel") : full ? "Full" : t("book")}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1,
            py: 0.75,
            height: `calc(100% - 28px)`,
            display: "flex",
            flexDirection: "column",
            gap: 0.25,
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

          <Box sx={{ flex: 1 }} />

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
                borderRadius: 1.5,
                minHeight: compact ? 28 : 32,
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
                borderRadius: 1.5,
                minHeight: compact ? 28 : 32,
                py: 0,
              }}
            >
              {isBusy ? "…" : full ? "Full" : t("book")}
            </Button>
          )}
        </Box>
      </Paper>
    </Tooltip>
  );
}
