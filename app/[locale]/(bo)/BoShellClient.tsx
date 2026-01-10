"use client";

import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link } from "@/i18n/navigation";
import React from "react";
import LogoutButton from "../components/LogoutButton";
import LocaleSwitcher from "../components/LocaleSwitcher";

const drawerWidth = 260;

export default function BoShellClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 1 }}>
          <Typography sx={{ px: 2, py: 1, fontWeight: 800 }}>
            Back Office
          </Typography>

          <List>
            <ListItemButton component={Link as any} href="/bo/blogs">
              <ListItemText primary="Blogs" />
            </ListItemButton>

            <ListItemButton>
              <LogoutButton />
            </ListItemButton>

            <ListItemButton>
              <LocaleSwitcher />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Admin
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
