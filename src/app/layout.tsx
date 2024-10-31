import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
export const metadata: Metadata = {
  title: "Galleria",
  description: "Host your image and image metadata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
            <AppRouterCacheProvider>

        {children}
            </AppRouterCacheProvider>

      </body>
    </html>
  );
}
