import { ReactNode } from "react";

import FoShellClient from "./FoShellClient";
import LegalFooter from "../components/LegalFooter";

export default async function FoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <FoShellClient>{children}</FoShellClient>
      <LegalFooter hasSidebar={true} />
    </>
  );
}
