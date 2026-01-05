import { prisma } from "../../../../lib/prisma";
import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import { Link } from "@/i18n/navigation";

export default async function BlogsAdminPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
    },
  });

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={800}>
          Blogs
        </Typography>

        <Button
          variant="contained"
          component={Link as any}
          href="/bo/blogs/new"
        >
          Nuevo post
        </Button>
      </Stack>

      <Paper variant="outlined">
        {posts.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">
              Aún no hay posts creados.
            </Typography>
          </Box>
        ) : (
          <Box>
            {posts.map((p) => (
              <Box
                key={p.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 120px 160px",
                  px: 3,
                  py: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={600}>{p.title}</Typography>
                <Typography
                  color={
                    p.status === "PUBLISHED" ? "success.main" : "text.secondary"
                  }
                >
                  {p.status}
                </Typography>
                <Button
                  size="small"
                  component={Link as any}
                  href={`/bo/blogs/${p.id}/edit`}
                >
                  Editar
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
