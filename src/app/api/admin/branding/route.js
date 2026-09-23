import { NextResponse } from "next/server";

import { getCurrentAuth } from "@/services/auth-server";
import { createClient } from "@/lib/supabase/server";

const BRANDING_ID =
  "00000000-0000-0000-0000-000000000001";

const COLOR_FIELDS = [
  "header_color",
  "sidebar_color",
  "primary_color",
  "primary_hover_color",
  "background_color",
  "surface_color",
  "text_color",
  "muted_text_color",
  "border_color",
];

function isValidHexColor(value) {
  return (
    typeof value === "string" &&
    /^#[0-9A-Fa-f]{6}$/.test(value)
  );
}

export async function PUT(request) {
  try {
    const auth = await getCurrentAuth();

    console.log("=== Branding Update Auth ===");
    console.log("User:", auth.user?.email);
    console.log("Roles:", auth.roles);
    console.log("Permissions:", auth.permissions);

    if (!auth.user || !auth.profile) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    if (
      !auth.permissions.includes("settings.appearance")
    ) {
      console.log(
        "Missing settings.appearance permission"
      );

      return NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const body = await request.json();

    const updates = {};

    if (body.app_name !== undefined) {
      if (
        typeof body.app_name !== "string" ||
        body.app_name.trim().length === 0
      ) {
        return NextResponse.json(
          {
            error: "Application name is invalid.",
          },
          {
            status: 400,
          }
        );
      }

      updates.app_name = body.app_name.trim();
    }

    for (const field of COLOR_FIELDS) {
      if (body[field] !== undefined) {
        if (!isValidHexColor(body[field])) {
          return NextResponse.json(
            {
              error: `${field} must be a valid HEX color.`,
            },
            {
              status: 400,
            }
          );
        }

        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          error: "No valid branding changes provided.",
        },
        {
          status: 400,
        }
      );
    }

    updates.updated_at = new Date().toISOString();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("branding_settings")
      .update(updates)
      .eq("id", BRANDING_ID)
      .select()
      .single();

    if (error) {
      console.error(
        "Branding update failed:",
        error
      );

      return NextResponse.json(
        {
          error: "Failed to update branding.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "PUT /api/admin/branding error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update branding.",
      },
      {
        status: 500,
      }
    );
  }
}