"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

type Lang = "es" | "en";

type Animal = {
  id: string;
  img: string;
  es: string;
  en: string;
};

const ANIMALS: Animal[] = [
  { id: "wolf", img: "/games/animals/wolf.png", es: "lobo", en: "wolf" },
  { id: "cat", img: "/games/animals/cat.png", es: "gato", en: "cat" },
  { id: "dog", img: "/games/animals/dog.png", es: "perro", en: "dog" },
  { id: "bear", img: "/games/animals/bear.png", es: "oso", en: "bear" },
  { id: "horse", img: "/games/animals/horse.png", es: "caballo", en: "horse" },
];

function normalizeWord(s: string) {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AnimalGamesPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const learnLang = (sp.get("lang") as Lang) ?? "en";

  const [deck, setDeck] = React.useState<Animal[]>(() => shuffle(ANIMALS));
  const [index, setIndex] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "correct" | "wrong">(
    "idle"
  );
  const [showAnswer, setShowAnswer] = React.useState(false);

  // ✅ NUEVO: contadores
  const [correctCount, setCorrectCount] = React.useState(0);
  const [wrongCount, setWrongCount] = React.useState(0);

  const total = deck.length;
  const finished = index >= total;

  const current = finished ? null : deck[index];
  const expected = current ? current[learnLang] : "";

  const learnLabel = learnLang === "es" ? "Castellano" : "Inglés";
  const inputLabel = learnLang === "es" ? "Castellano" : "Inglés";

  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  const resetGame = () => {
    setDeck(shuffle(ANIMALS));
    setIndex(0);
    setValue("");
    setStatus("idle");
    setShowAnswer(false);
    setCorrectCount(0);
    setWrongCount(0);
  };

  const next = () => {
    setIndex((prev) => prev + 1);
    setValue("");
    setStatus("idle");
    setShowAnswer(false);
  };

  const check = () => {
    if (!current) return;

    const ok = normalizeWord(value) === normalizeWord(expected);
    if (ok) {
      setStatus("correct");
      setCorrectCount((c) => c + 1);
      // avanzar al siguiente con una pausa
      window.setTimeout(() => next(), 600);
    } else {
      setStatus("wrong");
      setWrongCount((w) => w + 1);
      setShowAnswer(true);
    }
  };

  const skip = () => {
    // si saltas lo contamos como fallo (si no quieres, quita esto)
    setWrongCount((w) => w + 1);
    next();
  };

  // ✅ NUEVO: porcentaje final
  const attempts = correctCount + wrongCount;
  const accuracy =
    attempts > 0 ? Math.round((correctCount / attempts) * 100) : 0;

  if (finished) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={() => router.push("/games")}
              aria-label="volver"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight={800}>
              Animales
            </Typography>
          </Stack>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={900} gutterBottom>
                ¡Juego terminado!
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Idioma elegido: <b>{learnLabel}</b>
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography>
                  ✅ Aciertos: <b>{correctCount}</b>
                </Typography>
                <Typography>
                  ❌ Fallos: <b>{wrongCount}</b>
                </Typography>
                <Typography>
                  🎯 Porcentaje de acierto: <b>{accuracy}%</b>
                </Typography>
              </Stack>

              <Alert
                severity={
                  accuracy >= 80
                    ? "success"
                    : accuracy >= 50
                    ? "info"
                    : "warning"
                }
                sx={{ mt: 2 }}
              >
                {accuracy >= 80
                  ? "¡Muy bien! Sigue así."
                  : accuracy >= 50
                  ? "¡Bien! Un poco más y lo clavas."
                  : "No pasa nada: repite y verás cómo sube el porcentaje."}
              </Alert>

              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={resetGame}
                >
                  Jugar otra vez
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/games")}
                >
                  Volver a Games
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={() => router.push("/games")}
              aria-label="volver"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                Animales
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Idioma elegido: <b>{learnLabel}</b>
              </Typography>
            </Box>
          </Stack>

          <IconButton onClick={resetGame} aria-label="reiniciar">
            <RefreshIcon />
          </IconButton>
        </Stack>

        <Box sx={{ mt: 1 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="caption" color="text.secondary">
            {index + 1} / {total}
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          {/* Imagen mejor (sin recorte) */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 220, sm: 280, md: 320 },
              bgcolor: "grey.50",
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                bgcolor: "common.white",
                borderRadius: 3,
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
              }}
            >
              <Image
                src={current!.img}
                alt={current!.id}
                fill
                sizes="(max-width: 600px) 100vw, 600px"
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Box>

          <CardContent>
            <Stack spacing={2}>
              <Typography variant="body1">
                Escribe la palabra en <b>{inputLabel}</b>
              </Typography>

              <TextField
                label={`Respuesta (${inputLabel})`}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setStatus("idle");
                  setShowAnswer(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") check();
                }}
                fullWidth
                autoFocus
                helperText={
                  status === "correct"
                    ? "✅ Correcto"
                    : status === "wrong"
                    ? "❌ No es correcto"
                    : "Pulsa Enter o el botón Comprobar"
                }
              />

              {status === "wrong" && showAnswer && (
                <Alert severity="info">
                  Respuesta correcta: <b>{expected}</b>
                </Alert>
              )}

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  onClick={check}
                  disabled={!value.trim()}
                >
                  Comprobar
                </Button>
                <Button variant="outlined" onClick={skip}>
                  Saltar
                </Button>
              </Stack>

              {/* ✅ Opcional: mini marcador en vivo */}
              <Typography variant="caption" color="text.secondary">
                Aciertos: {correctCount} · Fallos: {wrongCount}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
