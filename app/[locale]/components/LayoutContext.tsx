"use client";
import { createContext, useContext } from "react";

export const LayoutContext = createContext<{ hasSidebar: boolean }>({
  hasSidebar: false,
});

export const useLayout = () => useContext(LayoutContext);
