import { Box, Container, Typography } from "@mui/material";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {title}
      </Typography>
      <Box sx={{ color: "text.secondary", lineHeight: 1.7 }}>{children}</Box>
    </Container>
  );
}
