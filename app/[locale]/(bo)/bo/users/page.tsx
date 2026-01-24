import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { prisma } from "@/app/lib/prisma";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { setUserDisabled, setUserRole } from "./actions";

type Role = "CLIENT" | "ADMIN" | "SUPERADMIN";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: any;
};

function normalizeRole(v: any): Role | "ALL" {
  const s = String(v ?? "ALL");
  if (s === "CLIENT" || s === "ADMIN" || s === "SUPERADMIN") return s;
  return "ALL";
}

export default async function BoUsersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const t = await getTranslations("bo.users");

  const sp =
    searchParams && typeof searchParams?.then === "function"
      ? await searchParams
      : (searchParams ?? {});

  const selectedRole = normalizeRole(sp?.role);

  const session = await getServerSession(authOptions);
  const actorRole = ((session?.user as any)?.role ?? "CLIENT") as Role;
  const actorId = ((session?.user as any)?.id ?? "") as string;

  const where =
    selectedRole === "ALL"
      ? {}
      : {
          role: selectedRole as any,
        };

  const users = await prisma.user.findMany({
    where,
    orderBy: [{ role: "asc" }, { email: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      disabled: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const canDisableTarget = (targetRole: Role) => {
    if (actorRole === "SUPERADMIN") return true;
    if (actorRole === "ADMIN") return targetRole === "CLIENT";
    return false;
  };

  const canEditRole = (targetRole: Role) => {
    if (actorRole === "SUPERADMIN") return true;
    return actorRole === "ADMIN" && targetRole === "CLIENT";
  };

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          {t("title")}
        </Typography>
        <Typography color="text.secondary">{t("subtitle")}</Typography>
      </Stack>

      {/* Filtros (SIN handlers, solo links) */}
      <Paper variant="outlined">
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography fontWeight={700} sx={{ mr: 1 }}>
            {t("filters.roleLabel")}:
          </Typography>

          <Button
            size="small"
            variant={selectedRole === "ALL" ? "contained" : "text"}
            href={`/${locale}/bo/users`}
          >
            {t("filters.allRoles")}
          </Button>

          <Button
            size="small"
            variant={selectedRole === "SUPERADMIN" ? "contained" : "text"}
            href={`/${locale}/bo/users?role=SUPERADMIN`}
          >
            {t("roles.SUPERADMIN")}
          </Button>

          <Button
            size="small"
            variant={selectedRole === "ADMIN" ? "contained" : "text"}
            href={`/${locale}/bo/users?role=ADMIN`}
          >
            {t("roles.ADMIN")}
          </Button>

          <Button
            size="small"
            variant={selectedRole === "CLIENT" ? "contained" : "text"}
            href={`/${locale}/bo/users?role=CLIENT`}
          >
            {t("roles.CLIENT")}
          </Button>
        </Box>
      </Paper>

      {/* Lista */}
      <Paper variant="outlined">
        {users.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">{t("empty")}</Typography>
          </Box>
        ) : (
          <Box>
            {users.map((u) => {
              const targetRole = u.role as Role;
              const canDisable =
                canDisableTarget(targetRole) && u.id !== actorId;
              const canRoleChange = canEditRole(targetRole) && u.id !== actorId;

              return (
                <Box
                  key={u.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 0.9fr 140px 160px 1.2fr",
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* Identidad */}
                  <Box>
                    <Typography fontWeight={700}>
                      {u.name || t("noName")}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {u.email}
                    </Typography>
                  </Box>

                  {/* Rol */}
                  <Box>
                    <Chip
                      size="small"
                      label={t(`roles.${targetRole}` as any)}
                      variant="outlined"
                    />
                  </Box>

                  {/* Estado */}
                  <Box>
                    <Chip
                      size="small"
                      label={
                        u.disabled ? t("status.disabled") : t("status.enabled")
                      }
                      color={u.disabled ? "warning" : "success"}
                      variant="outlined"
                    />
                  </Box>

                  {/* Acción disabled */}
                  <Box>
                    <form
                      action={setUserDisabled.bind(null, locale, u.id)}
                      style={{ display: "inline-flex", gap: 8 }}
                    >
                      <input
                        type="hidden"
                        name="disabled"
                        value={u.disabled ? "false" : "true"}
                      />
                      <Button size="small" type="submit" disabled={!canDisable}>
                        {u.disabled
                          ? t("actions.enable")
                          : t("actions.disable")}
                      </Button>
                    </form>

                    {u.id === actorId && (
                      <Typography variant="caption" color="text.secondary">
                        {t("selfProtected")}
                      </Typography>
                    )}
                  </Box>

                  {/* Cambio de rol */}
                  <Box sx={{ justifySelf: "end" }}>
                    {actorRole === "SUPERADMIN" ? (
                      <form
                        action={setUserRole.bind(null, locale, u.id)}
                        style={{ display: "inline-flex", gap: 8 }}
                      >
                        <select
                          name="role"
                          defaultValue={targetRole}
                          disabled={u.id === actorId}
                          style={{
                            height: 36,
                            padding: "0 10px",
                            borderRadius: 6,
                            border: "1px solid rgba(0,0,0,0.23)",
                            background: "transparent",
                          }}
                        >
                          <option value="SUPERADMIN">
                            {t("roles.SUPERADMIN")}
                          </option>
                          <option value="ADMIN">{t("roles.ADMIN")}</option>
                          <option value="CLIENT">{t("roles.CLIENT")}</option>
                        </select>

                        <Button
                          size="small"
                          type="submit"
                          disabled={u.id === actorId}
                        >
                          {t("actions.saveRole")}
                        </Button>
                      </form>
                    ) : (
                      <form
                        action={setUserRole.bind(null, locale, u.id)}
                        style={{ display: "inline-flex", gap: 8 }}
                      >
                        <input type="hidden" name="role" value="ADMIN" />
                        <Button
                          size="small"
                          type="submit"
                          disabled={!canRoleChange}
                        >
                          {t("actions.makeAdmin")}
                        </Button>
                      </form>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
