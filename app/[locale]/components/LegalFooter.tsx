import { Box, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";

export default function LegalFooter() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 3,
        mt: 6,
        borderTop: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
      >
        <Link href="/legal/legal-notice">Aviso Legal</Link>
        <Link href="/legal/privacy">Privacidad</Link>
        <Link href="/legal/cookies">Cookies</Link>
        <Link href="/legal/use-terms">Términos de uso</Link>
        <Link href="/legal/terms-and-conditions">Términos y condiciones</Link>
      </Stack>

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        © {new Date().getFullYear()} Arrow Blog — Javier López Villanueva
      </Typography>
    </Box>
  );
}
