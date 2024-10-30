import { AudioProvider } from "./AudioProvider";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}
