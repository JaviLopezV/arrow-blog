"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { deletePost, updatePost, type PostActionState } from "../../actions";

type PostDTO = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: Date | null;
  updatedAt: Date;
};

const initialState: PostActionState = { ok: true };

export default function EditPostForm({
  locale,
  post,
}: {
  locale: string;
  post: PostDTO;
}) {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    updatePost.bind(null, locale, post.id),
    initialState
  );

  useEffect(() => {
    if (state.ok && state.postId) {
      // nos quedamos en la misma página, pero refrescamos server data
      router.refresh();
    }
  }, [state, router]);

  return (
    <Stack spacing={3} maxWidth={900}>
      <Stack spacing={0.5}>
        <Typography variant="h4" fontWeight={800}>
          Editar post
        </Typography>
        <Typography color="text.secondary">
          Estado: {post.status}
          {post.publishedAt
            ? ` · Publicado: ${new Date(post.publishedAt).toISOString()}`
            : ""}
        </Typography>
      </Stack>

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
              defaultValue={post.title}
              error={state.ok === false && !!state.fieldErrors?.title}
              helperText={
                state.ok === false ? state.fieldErrors?.title?.[0] : ""
              }
            />

            <TextField
              name="slug"
              label="Slug"
              defaultValue={post.slug}
              error={state.ok === false && !!state.fieldErrors?.slug}
              helperText={
                state.ok === false ? state.fieldErrors?.slug?.[0] : ""
              }
            />

            <TextField
              name="excerpt"
              label="Extracto"
              multiline
              minRows={2}
              defaultValue={post.excerpt ?? ""}
            />

            <TextField
              name="content"
              label="Contenido"
              required
              multiline
              minRows={10}
              defaultValue={post.content}
              error={state.ok === false && !!state.fieldErrors?.content}
              helperText={
                state.ok === false ? state.fieldErrors?.content?.[0] : ""
              }
            />

            <TextField
              name="coverImage"
              label="Cover image URL"
              defaultValue={post.coverImage ?? ""}
              error={state.ok === false && !!state.fieldErrors?.coverImage}
              helperText={
                state.ok === false ? state.fieldErrors?.coverImage?.[0] : ""
              }
            />

            <TextField
              name="status"
              label="Estado"
              select
              defaultValue={post.status}
            >
              <MenuItem value="DRAFT">DRAFT</MenuItem>
              <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
            </TextField>

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                color="error"
                disabled={isPending}
                formAction={deletePost.bind(null, locale, post.id)}
              >
                Borrar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
