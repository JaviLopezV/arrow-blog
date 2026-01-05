import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { db } from "../../lib/db";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { useTranslations } from "next-intl";

export default async function DiscoverPage() {
  const t = useTranslations("discover");
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth");

  const me = (session.user as any).id as string;

  const { rows: users } = await db.query(
    `
    SELECT "User".id,
           COALESCE("User".name, '') as name,
           COALESCE("Profile".city, '') as city,
           COALESCE("Profile".gender, '') as gender,
           COALESCE("Profile".bio, '') as bio
    FROM "User"
    LEFT JOIN "Profile" ON "Profile"."userId"="User".id
    WHERE "User".id != $1
      AND "User".id NOT IN (
        SELECT "toUserId" FROM "Like" WHERE "fromUserId"=$1
      )
    LIMIT 1
  `,
    [me]
  );

  const user = users[0];

  if (!user) {
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
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={800}>
                  {t("emptyTitle")}
                </Typography>
                <Typography color="text.secondary">
                  {t("emptySubtitle")}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  const displayName = user.name?.trim() || t("defaultUser");
  const city = user.city?.trim();
  const gender = user.gender?.trim();
  const bio = user.bio?.trim();

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
            <Stack spacing={2.5} alignItems="center" textAlign="center">
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight={900}>
                  {displayName}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  {city && (
                    <Chip
                      icon={<LocationOnRoundedIcon />}
                      label={city}
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  )}
                  {gender && (
                    <Chip label={gender} variant="outlined" sx={{ mt: 1 }} />
                  )}
                </Stack>
              </Stack>

              <Divider flexItem />

              <Typography color={bio ? "text.primary" : "text.secondary"}>
                {bio || t("noBio")}
              </Typography>

              <Stack direction="row" spacing={2} sx={{ pt: 1 }} width="100%">
                {/* PASS: no guardamos nada, simplemente volvemos a cargar otro */}
                <Box
                  component="form"
                  action="/api/like"
                  method="post"
                  sx={{ flex: 1 }}
                >
                  <input type="hidden" name="to" value={user.id} />
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="outlined"
                    startIcon={<CloseRoundedIcon />}
                  >
                    {t("pass")}
                  </Button>
                </Box>

                {/* LIKE: guardamos like */}
                <Box
                  component="form"
                  action="/api/like"
                  method="post"
                  sx={{ flex: 1 }}
                >
                  <input type="hidden" name="to" value={user.id} />
                  <input type="hidden" name="like" value="1" />
                  <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    startIcon={<FavoriteRoundedIcon />}
                  >
                    {t("like")}
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
