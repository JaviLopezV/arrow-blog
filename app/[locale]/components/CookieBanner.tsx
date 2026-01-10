"use client";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookiesAccepted")) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        color: "white",
        bgcolor: "black",
        borderTop: "1px solid",
        borderColor: "divider",
        p: 2,
        zIndex: 2000,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "white",
        }}
      >
        Este sitio usa cookies técnicas necesarias para la autenticación y
        funcionamiento de cuentas. Más información en la Política de{" "}
        <Link
          href="/legal/cookies"
          style={{ color: "inherit", textDecoration: "underline" }}
        >
          Cookies
        </Link>
      </Typography>
      <Button
        size="small"
        sx={{ mt: 1 }}
        variant="contained"
        onClick={() => {
          localStorage.setItem("cookiesAccepted", "true");
          setOpen(false);
        }}
      >
        Aceptar
      </Button>
    </Box>
  );
}
