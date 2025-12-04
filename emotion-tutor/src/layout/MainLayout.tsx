import React from "react";
import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return <div className="main-layout">{children}</div>;
}
