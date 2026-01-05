"use client";

import { usePathname, useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Button, ButtonGroup } from "@mui/material";

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  // Quita el prefijo /es o /en del pathname actual
  const pathWithoutLocale = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "";

  return (
    <ButtonGroup size="small" variant="outlined" aria-label="Idioma">
      <Button
        component={Link}
        href={`/es${pathWithoutLocale}`}
        disabled={locale === "es"}
      >
        ES
      </Button>
      <Button
        component={Link}
        href={`/en${pathWithoutLocale}`}
        disabled={locale === "en"}
      >
        EN
      </Button>
    </ButtonGroup>
  );
}
