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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export default function DeleteAccountCard() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

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

      // Cierra la modal
      setOpen(false);

      // Cierra sesión y redirige a /{locale}/auth
      await signOut({ redirect: false });
      router.replace(`/${locale}/auth`);
    } catch {
      setErr("DELETE_FAILED");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={900}>
              Eliminar cuenta
            </Typography>

            <Alert severity="warning">
              Esta acción es <b>irreversible</b>. Se eliminará tu cuenta y tus
              datos de acceso. Tus posts publicados podrán mantenerse visibles
              de forma <b>anónima</b>.
            </Alert>

            {err && (
              <Alert severity="error">
                No se pudo eliminar la cuenta ({err})
              </Alert>
            )}
            {ok && <Alert severity="success">{ok}</Alert>}

            <Button
              variant="contained"
              color="error"
              disabled={loading}
              onClick={() => setOpen(true)}
              endIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : undefined
              }
            >
              Eliminar mi cuenta
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => (!loading ? setOpen(false) : null)}>
        <DialogTitle>¿Seguro?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vas a eliminar tu cuenta. Esta acción es irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={loading} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            disabled={loading}
            color="error"
            variant="contained"
            onClick={onDelete}
            endIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {loading ? "Eliminando…" : "Sí, eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
