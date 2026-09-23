import { NextResponse } from "next/server";

import { getCurrentAuth } from "@/services/auth-server";
import { createClient } from "@/lib/supabase/server";

const BRANDING_ID =
  "00000000-0000-0000-0000-000000000001";

const BUCKET_NAME = "branding";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getFileExtension(file) {
  switch (file.type) {
    case "image/png":
      return "png";

    case "image/jpeg":
      return "jpg";

    case "image/webp":
      return "webp";

    case "image/svg+xml":
      return "svg";

    default:
      return null;
  }
}

export async function POST(request) {
  try {
    const auth = await getCurrentAuth();

    console.log("=== Branding Logo Auth ===");
    console.log("User:", auth.user?.email);
    console.log("Profile:", auth.profile);
    console.log("Role:", auth.profile?.role);

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

    if (!auth.permissions.includes("settings.appearance")) {
        return NextResponse.json(
            {
            error: "Forbidden",
            },
            {
            status: 403,
            }
        );
        }

    const formData = await request.formData();
    const file = formData.get("logo");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No logo file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload PNG, JPG, WEBP, or SVG.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Logo must be smaller than 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const extension = getFileExtension(file);

    if (!extension) {
      return NextResponse.json(
        {
          error: "Unsupported image format.",
        },
        {
          status: 400,
        }
      );
    }

    const filePath = `logo-${Date.now()}.${extension}`;

    const fileBuffer = await file.arrayBuffer();

    const supabase = await createClient();

    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

    if (uploadError) {
      console.error(
        "Branding logo upload failed:",
        uploadError
      );

      return NextResponse.json(
        {
          error: "Failed to upload logo.",
        },
        {
          status: 500,
        }
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    const logoUrl =
      publicUrlData.publicUrl;

    const { data, error: updateError } =
      await supabase
        .from("branding_settings")
        .update({
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", BRANDING_ID)
        .select()
        .single();

    if (updateError) {
      console.error(
        "Failed to save branding logo URL:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Logo uploaded, but failed to save branding settings.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      logo_url: data.logo_url,
    });
  } catch (error) {
    console.error(
      "POST /api/admin/branding/logo error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to upload logo.",
      },
      {
        status: 500,
      }
    );
  }
}