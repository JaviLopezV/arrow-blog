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
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const drawerWidth = 260;

export default async function BoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);

  // No logueado -> a login (o /auth si prefieres)
  if (!session) {
    redirect(`/${locale}/login`);
  }

  // No admin -> fuera del BO
  const role = (session.user as any)?.role;
  if (role !== "ADMIN") {
    redirect(`/${locale}`);
  }

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
