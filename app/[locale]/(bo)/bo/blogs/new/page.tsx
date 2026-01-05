"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createPost, type PostActionState } from "../actions";

const initialState: PostActionState = { ok: true };

export default function NewPostPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const [state, formAction, isPending] = useActionState(
    createPost.bind(null, locale),
    initialState
  );

  useEffect(() => {
    if (state.ok && state.postId) {
      router.push(`/${locale}/bo/blogs/${state.postId}/edit`);
      router.refresh();
    }
  }, [state, router, locale]);

  return (
    <Stack spacing={3} maxWidth={900}>
      <Typography variant="h4" fontWeight={800}>
        Nuevo post
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box component="form" action={formAction}>
          <Stack spacing={2}>
            {state.ok === false && (state.formError || state.fieldErrors) && (
              <Alert severity="error">
                {state.formError ?? "Revisa los campos."}
              </Alert>
            )}

            <TextField
              name="title"
              label="Título"
              required
              error={!!state.ok === false && !!state.fieldErrors?.title}
              helperText={
                state.ok === false ? state.fieldErrors?.title?.[0] : ""
              }
            />

            <TextField
              name="slug"
              label="Slug (opcional, si lo dejas vacío se genera)"
              error={state.ok === false && !!state.fieldErrors?.slug}
              helperText={
                state.ok === false ? state.fieldErrors?.slug?.[0] : ""
              }
            />

            <TextField name="excerpt" label="Extracto" multiline minRows={2} />

            <TextField
              name="content"
              label="Contenido"
              required
              multiline
              minRows={10}
              error={state.ok === false && !!state.fieldErrors?.content}
              helperText={
                state.ok === false ? state.fieldErrors?.content?.[0] : ""
              }
            />

            <TextField
              name="coverImage"
              label="Cover image URL (opcional)"
              error={state.ok === false && !!state.fieldErrors?.coverImage}
              helperText={
                state.ok === false ? state.fieldErrors?.coverImage?.[0] : ""
              }
            />

            <TextField name="status" label="Estado" select defaultValue="DRAFT">
              <MenuItem value="DRAFT">DRAFT</MenuItem>
              <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
            >
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
