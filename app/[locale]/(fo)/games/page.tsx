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

        <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <CardActionArea onClick={() => router.push(`/games/languages`)}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {t("languages.title")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("languages.description")}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Container>
  );
}
