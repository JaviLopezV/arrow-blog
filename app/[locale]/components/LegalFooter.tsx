import { Box, Stack, Typography } from "@mui/material";
import { Link } from "@/i18n/navigation";

const drawerWidth = 260; // igual que tu sidebar

export default function LegalFooter() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: { xs: 2, sm: 3 },
        mt: { xs: 4, sm: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
        color: "text.secondary",
        backgroundColor: "background.paper",

        // 👇 clave para que NO lo pise el drawer permanente en desktop
        ml: { md: `${drawerWidth}px`, xs: 0 },
        width: { md: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{
          "& a": {
            color: "inherit",
            textDecoration: "none",
            fontSize: 14,
          },
          "& a:hover": { textDecoration: "underline" },
        }}
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
