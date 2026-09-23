"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const BrandingContext = createContext(null);

const DEFAULT_BRANDING = {
  app_name: "Business Management",
  logo_url: null,

  header_color: "#ffffff",
  sidebar_color: "#ffffff",

  primary_color: "#2563eb",
  primary_hover_color: "#1d4ed8",

  background_color: "#f3f4f6",
  surface_color: "#ffffff",

  text_color: "#111827",
  muted_text_color: "#6b7280",

  border_color: "#e5e7eb",
};

function applyTheme(branding) {
  const root = document.documentElement;

  root.style.setProperty(
    "--color-header",
    branding.header_color
  );

  root.style.setProperty(
    "--color-sidebar",
    branding.sidebar_color
  );

  root.style.setProperty(
    "--color-primary",
    branding.primary_color
  );

  root.style.setProperty(
    "--color-primary-hover",
    branding.primary_hover_color
  );

  root.style.setProperty(
    "--color-background",
    branding.background_color
  );

  root.style.setProperty(
    "--color-surface",
    branding.surface_color
  );

  root.style.setProperty(
    "--color-text",
    branding.text_color
  );

  root.style.setProperty(
    "--color-text-muted",
    branding.muted_text_color
  );

  root.style.setProperty(
    "--color-border",
    branding.border_color
  );
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] =
    useState(DEFAULT_BRANDING);

  const [loading, setLoading] = useState(true);

  async function loadBranding() {
    try {
      const response = await fetch("/api/branding", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load branding");
      }

      const data = await response.json();

      const nextBranding = {
        ...DEFAULT_BRANDING,
        ...data,
      };

      setBranding(nextBranding);
      applyTheme(nextBranding);
    } catch (error) {
      console.error(
        "Failed to load branding:",
        error
      );

      applyTheme(DEFAULT_BRANDING);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBranding();
  }, []);

  return (
    <BrandingContext.Provider
      value={{
        branding,
        loading,
        refreshBranding: loadBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);

  if (!context) {
    throw new Error(
      "useBranding must be used inside BrandingProvider"
    );
  }

  return context;
}