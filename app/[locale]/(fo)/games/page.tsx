"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";

type Lang = "es" | "en";

export default function GamesPage() {
  const router = useRouter();
  const [learnLang, setLearnLang] = React.useState<Lang | null>(null);

  const handleLangChange = (
    _: React.MouseEvent<HTMLElement>,
    value: Lang | null
  ) => {
    setLearnLang(value);
  };

  const canPickGame = Boolean(learnLang);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Games
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Elige el idioma que quieres “aprender” y después el juego.
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              1) Idioma
            </Typography>

            <ToggleButtonGroup
              value={learnLang}
              exclusive
              onChange={handleLangChange}
              fullWidth
              sx={{ mt: 1 }}
            >
              <ToggleButton value="en" sx={{ py: 1.5 }}>
                Inglés
              </ToggleButton>
              <ToggleButton value="es" sx={{ py: 1.5 }}>
                Castellano
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={
                  learnLang
                    ? `Seleccionado: ${
                        learnLang === "en" ? "Inglés" : "Castellano"
                      }`
                    : "Selecciona un idioma"
                }
                color={learnLang ? "primary" : "default"}
                variant={learnLang ? "filled" : "outlined"}
              />
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            opacity: canPickGame ? 1 : 0.5,
            pointerEvents: canPickGame ? "auto" : "none",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              2) Juego
            </Typography>

            <Card
              variant="outlined"
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardActionArea
                onClick={() => router.push(`/games/animals?lang=${learnLang}`)}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        Animales
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Escribe la traducción correcta según el idioma elegido.
                      </Typography>
                    </Box>
                    <Chip
                      label="Disponible"
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
