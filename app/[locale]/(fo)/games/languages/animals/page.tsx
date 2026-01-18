"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import { useSearchParams } from "next/navigation";

type Lang = "es" | "en";

export default function AnimalsPage() {
  const t = useTranslations("games");
  const router = useRouter();
  const sp = useSearchParams();

  const learnLang = (sp.get("lang") as Lang) ?? "en";

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {t("title")}
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          {t("gameStep")}
        </Typography>

        <Card
          variant="outlined"
          sx={{ borderRadius: 3, overflow: "hidden", my: 3 }}
        >
          <CardActionArea
            onClick={() =>
              router.push(
                `/games/languages/animals/write?lang=${learnLang.toString()}`,
              )
            }
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

        <Card
          variant="outlined"
          sx={{ borderRadius: 3, overflow: "hidden", my: 3 }}
        >
          <CardActionArea
            onClick={() => router.push(`/games/languages/animals/choose-image`)}
          >
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    {t("animals.titleChooseImage")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("animals.chooseImage.prompt")}
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
      </Stack>
    </Container>
  );
}
