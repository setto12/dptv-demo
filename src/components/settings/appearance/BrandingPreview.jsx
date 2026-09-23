"use client";

import {
  BarChart3,
  Bell,
  Home,
  Settings,
} from "lucide-react";

export default function BrandingPreview({
  branding,
}) {
  const {
    header_color,
    sidebar_color,
    primary_color,
    primary_hover_color,
    background_color,
    surface_color,
    text_color,
    muted_text_color,
    border_color,
  } = branding;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{
        borderColor: border_color,
        backgroundColor: background_color,
        color: text_color,
      }}
    >
      {/* Header */}
      <div
        className="flex h-16 items-center justify-between border-b px-5"
        style={{
          backgroundColor: header_color,
          borderColor: border_color,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
            style={{
              backgroundColor: primary_color,
            }}
          >
            <BarChart3 className="h-5 w-5" />
          </div>

          <span className="font-semibold">
            {branding.app_name || "Business Management"}
          </span>
        </div>

        <Bell
          className="h-5 w-5"
          style={{
            color: muted_text_color,
          }}
        />
      </div>

      <div className="flex min-h-72">
        {/* Sidebar */}
        <div
          className="hidden w-52 shrink-0 border-r p-4 sm:block"
          style={{
            backgroundColor: sidebar_color,
            borderColor: border_color,
          }}
        >
          <div className="space-y-2">
            <PreviewNavItem
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              active
              colors={{
                primary_color,
                primary_hover_color,
                text_color,
              }}
            />

            <PreviewNavItem
              icon={<BarChart3 className="h-4 w-4" />}
              label="Reports"
              colors={{
                primary_color,
                primary_hover_color,
                text_color,
              }}
            />

            <PreviewNavItem
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              colors={{
                primary_color,
                primary_hover_color,
                text_color,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div
            className="mb-5 rounded-xl border p-5"
            style={{
              backgroundColor: surface_color,
              borderColor: border_color,
            }}
          >
            <p
              className="text-sm"
              style={{
                color: muted_text_color,
              }}
            >
              Dashboard
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              Welcome back
            </h3>

            <p
              className="mt-2 text-sm"
              style={{
                color: muted_text_color,
              }}
            >
              This is a preview of your configured
              application theme.
            </p>

            <button
              type="button"
              className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition"
              style={{
                backgroundColor: primary_color,
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor =
                  primary_hover_color;
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor =
                  primary_color;
              }}
            >
              Primary Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewNavItem({
  icon,
  label,
  active,
  colors,
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
      style={{
        backgroundColor: active
          ? colors.primary_color
          : "transparent",
        color: active
          ? "#ffffff"
          : colors.text_color,
      }}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}