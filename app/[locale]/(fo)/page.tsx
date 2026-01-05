import { prisma } from "../../lib/prisma";
import { Typography } from "@mui/material";
export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 10,
    select: { id: true, title: true, slug: true, publishedAt: true },
  });

  return (
    <>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        FO - Home
      </Typography>
      <Typography color="text.secondary">
        Aquí mostraremos la lista de posts publicados.
      </Typography>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            {p.title} — {p.slug}
          </li>
        ))}
      </ul>
    </>
  );
}
