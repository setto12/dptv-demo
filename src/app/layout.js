import "./globals.css";

import { LayoutProvider } from "@/context/LayoutContext";
import { BrandingProvider } from "@/context/BrandingContext";
import { Toaster } from "sonner";

export const metadata = {
  title: "Business Management Template",
  description: "Reusable Inventory, POS, and Financial Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BrandingProvider>
          <LayoutProvider>
            {children}

            <Toaster
              position="bottom-right"
              richColors
              closeButton
            />
          </LayoutProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}