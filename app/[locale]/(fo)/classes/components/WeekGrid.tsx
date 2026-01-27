"use client";

import * as React from "react";
import { Box } from "@mui/material";
import type { ClassSessionDto } from "../types/classes";
import { dateKeyLocal } from "../utils/date";
import { DayColumn } from "./DayColumn";

type Props = {
  weekDays: Date[];
  byDay: Record<string, ClassSessionDto[]>;
  busyId: string | null;
  onBook: (sessionId: string) => void;
  onCancel: (bookingId: string) => void;
  t: (key: string) => string;
};

export function WeekGrid({
  weekDays,
  byDay,
  busyId,
  onBook,
  onCancel,
  t,
}: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "repeat(7, 1fr)" },
      }}
    >
      {weekDays.map((d) => {
        const key = dateKeyLocal(d);
        return (
          <DayColumn
            key={key}
            day={d}
            sessions={byDay[key] || []}
            busyId={busyId}
            onBook={onBook}
            onCancel={onCancel}
            t={t}
          />
        );
      })}
    </Box>
  );
}
