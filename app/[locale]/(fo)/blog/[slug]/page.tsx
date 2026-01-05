import { Typography } from "@mui/material";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Post: {params.slug}
      </Typography>
      <Typography color="text.secondary">
        Aquí renderizaremos el contenido del post.
      </Typography>
    </>
  );
}
