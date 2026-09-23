"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { useBranding } from "@/context/BrandingContext";

import BrandingLogoUpload from "@/components/settings/appearance/BrandingLogoUpload";

import BrandingPreview from "@/components/settings/appearance/BrandingPreview";
import BrandingColorPicker from "@/components/settings/appearance/BrandingColorPicker";

const COLOR_FIELDS = [
  {
    key: "header_color",
    label: "Header",
    description: "Background color of the application header.",
  },
  {
    key: "sidebar_color",
    label: "Sidebar",
    description: "Background color of the side navigation.",
  },
  {
    key: "primary_color",
    label: "Primary",
    description: "Primary action and active navigation color.",
  },
  {
    key: "primary_hover_color",
    label: "Primary Hover",
    description: "Hover state for primary actions.",
  },
  {
    key: "background_color",
    label: "Background",
    description: "Main application background.",
  },
  {
    key: "surface_color",
    label: "Surface",
    description: "Cards, panels, and other raised surfaces.",
  },
  {
    key: "text_color",
    label: "Text",
    description: "Main application text color.",
  },
  {
    key: "muted_text_color",
    label: "Muted Text",
    description: "Secondary and supporting text.",
  },
  {
    key: "border_color",
    label: "Border",
    description: "Borders around cards, inputs, and sections.",
  },
];

export default function AppearanceSettings() {
  const { branding, refreshBranding } = useBranding();

  const [form, setForm] = useState(branding);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(branding);
  }, [branding]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/branding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_name: form.app_name,
          ...Object.fromEntries(
            COLOR_FIELDS.map(({ key }) => [key, form[key]])
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save appearance settings."
        );
      }

      await refreshBranding();

      toast.success("Appearance settings saved.");
    } catch (error) {
      console.error("Failed to save appearance:", error);

      toast.error(
        error.message || "Failed to save appearance settings."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-[var(--color-background)] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)]">
            Appearance
          </h1>

          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Customize the application branding, logo, and theme colors.
          </p>
        </div>

        {/* Application Branding */}
        <section className="rounded-xl border bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Application Branding
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Configure the name and logo displayed throughout the
              application.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <label
                htmlFor="app-name"
                className="mb-2 block text-sm font-medium text-[var(--color-text)]"
              >
                Application Name
              </label>

              <input
                id="app-name"
                type="text"
                value={form.app_name || ""}
                onChange={(event) =>
                  updateField("app_name", event.target.value)
                }
                className="
                  w-full
                  rounded-lg
                  border
                  border-[var(--color-border)]
                  bg-[var(--color-surface)]
                  px-3
                  py-2.5
                  text-sm
                  text-[var(--color-text)]
                  outline-none
                  transition
                  focus:border-[var(--color-primary)]
                  focus:ring-2
                  focus:ring-[var(--color-primary)]
                  focus:ring-opacity-20
                "
                placeholder="Business Management"
              />

              <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                Used as the application name and logo fallback.
              </p>
            </div>

            <BrandingLogoUpload
              logoUrl={form.logo_url}
              onUploaded={(logoUrl) =>
                updateField("logo_url", logoUrl)
              }
            />
          </div>
        </section>

        {/* Colors */}
        <section className="rounded-xl border bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Theme Colors
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Enter HEX values to customize the application's color
              scheme.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COLOR_FIELDS.map((field) => (
              <BrandingColorPicker
                key={field.key}
                label={field.label}
                description={field.description}
                value={form[field.key]}
                onChange={(value) =>
                  updateField(field.key, value)
                }
              />
            ))}
          </div>
        </section>

        {/* Preview */}
        <section className="rounded-xl border bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Preview
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Preview how the configured theme will look.
            </p>
          </div>

          <BrandingPreview branding={form} />
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[var(--color-primary)]
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[var(--color-primary-hover)]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}