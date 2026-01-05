import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import LogoutButton from "../components/LogoutButton";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  const { locale } = params;

  if (!session) redirect(`/${locale}/auth`);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(1200px circle at 20% 10%, rgba(255,0,128,0.10), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(0,120,255,0.10), transparent 50%)",
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" fontWeight={900}>
                  Dashboard
                </Typography>
                <LogoutButton />
              </Stack>

              <Divider />

              <Typography>
                Hola, <strong>{session.user.email}</strong>
              </Typography>
              <Typography color="text.secondary">Sesión activa ✅</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
