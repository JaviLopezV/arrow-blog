"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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
  const t = useTranslations("games");
  const router = useRouter();
  const [learnLang, setLearnLang] = React.useState<Lang | null>(null);

  const handleLangChange = (
    _: React.MouseEvent<HTMLElement>,
    value: Lang | null,
  ) => {
    setLearnLang(value);
  };

  const canPickGame = Boolean(learnLang);
  const selectedLangLabel = learnLang ? t(learnLang) : "";

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("description")}
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {t("languageStep")}
            </Typography>

            <ToggleButtonGroup
              value={learnLang}
              exclusive
              onChange={handleLangChange}
              fullWidth
              sx={{ mt: 1 }}
            >
              <ToggleButton value="en" sx={{ py: 1.5 }}>
                {t("en")}
              </ToggleButton>
              <ToggleButton value="es" sx={{ py: 1.5 }}>
                {t("es")}
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ mt: 2 }}>
              <Chip
                label={
                  learnLang
                    ? t("languageSelected") + " " + selectedLangLabel
                    : t("selectLanguage")
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
              {t("gameStep")}
            </Typography>

            <Card
              variant="outlined"
              sx={{ borderRadius: 3, overflow: "hidden" }}
            >
              <CardActionArea
                onClick={() => router.push(`/games/animals?lang=${learnLang!}`)}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800}>
                        {t("animals.title")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("animals.description")}
                      </Typography>
                    </Box>
                    <Chip
                      label={t("animals.available")}
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
