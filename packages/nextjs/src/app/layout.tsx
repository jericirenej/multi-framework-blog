import type { ReactNode } from "react";
import "../styles.css";
const RootLayout = ({ children }: { children: ReactNode }): ReactNode => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
