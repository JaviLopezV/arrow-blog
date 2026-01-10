import { ReactNode } from "react";

import FoShellClient from "./FoShellClient";

export default async function FoLayout({ children }: { children: ReactNode }) {
  return <FoShellClient>{children}</FoShellClient>;
}
