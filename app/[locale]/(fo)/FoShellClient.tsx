"use client";

import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "@/i18n/navigation";
import LogoutButton from "../components/LogoutButton";
import LocaleSwitcher from "../components/LocaleSwitcher";

export default function FoLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: 1.5 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Arrow Blog
          </Typography>

          <Button color="inherit" component={Link as any} href="/home">
            Home
          </Button>

          {/* opcional: acceso auth */}
          <LogoutButton />

          <LocaleSwitcher />
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>{children}</Container>
    </Box>
  );
}
