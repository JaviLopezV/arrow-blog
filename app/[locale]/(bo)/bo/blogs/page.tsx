import { Typography } from "@mui/material";

export default function BlogsAdminPage() {
  return (
    <>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        BO - Blogs
      </Typography>
      <Typography color="text.secondary">
        Aquí irá el CRUD de posts (crear, editar, publicar, borrar).
      </Typography>
    </>
  );
}
