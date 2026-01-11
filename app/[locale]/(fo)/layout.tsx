import { ReactNode } from "react";

import FoShellClient from "./FoShellClient";
import { LayoutContext } from "@/app/[locale]/components/LayoutContext";

export default async function FoLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutContext.Provider value={{ hasSidebar: false }}>
      <FoShellClient>{children}</FoShellClient>
    </LayoutContext.Provider>
  );
}
