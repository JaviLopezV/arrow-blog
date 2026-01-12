"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("common");

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Volver */}

      <Button
        component={Link as any}
        variant="outlined"
        size="large"
        href="/auth"
        sx={{ mb: 2 }}
      >
        {t("back")}
      </Button>

      <Typography variant="h4" fontWeight={800} gutterBottom>
        {title}
      </Typography>

      <Box sx={{ color: "text.secondary", lineHeight: 1.7 }}>{children}</Box>
    </Container>
  );
}
