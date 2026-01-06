"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function DeleteAccountCard() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const required = "ELIMINAR";

  async function onDelete() {
    setErr(null);
    setOk(null);
    setLoading(true);

    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.error ?? "DELETE_FAILED");
        return;
      }

      setOk("Cuenta eliminada. Cerrando sesión…");
      await signOut({ redirect: false });
      router.push(`/${locale}/login`);
    } catch {
      setErr("DELETE_FAILED");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900}>
            Eliminar cuenta
          </Typography>

          <Alert severity="warning">
            Esta acción es <b>irreversible</b>. Se eliminará tu cuenta y tus
            datos de acceso. Tus posts publicados podrán mantenerse visibles de
            forma <b>anónima</b>.
          </Alert>

          {err && (
            <Alert severity="error">
              No se pudo eliminar la cuenta ({err})
            </Alert>
          )}
          {ok && <Alert severity="success">{ok}</Alert>}

          <Typography color="text.secondary">
            Para confirmar, escribe <b>{required}</b>:
          </Typography>

          <TextField
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={required}
          />

          <Button
            variant="contained"
            color="error"
            disabled={loading || confirm !== required}
            onClick={onDelete}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {loading ? "Eliminando…" : "Eliminar mi cuenta"}
          </Button>

          <Button
            variant="text"
            disabled={loading}
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
