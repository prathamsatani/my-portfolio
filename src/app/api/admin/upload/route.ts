import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseServer";
import { generateUniqueFileName } from "@/lib/supabaseStorage";
import { getSafeErrorMessage, logError } from "@/lib/errors";
import { logAdminAction } from "@/lib/auditLog";

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseRouteHandlerClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const directory = formData.get("directory") as string || "misc";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      // "image/svg+xml" - Removed for security (SVG can contain scripts)
      "application/pdf",
      "video/mp4",
      "video/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed` },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = generateUniqueFileName(file.name);
    const storagePath = `${directory}/${fileName}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("public")
      .upload(storagePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false, // Don't overwrite - unique filename should prevent collisions
      });

    if (error) {
      logError("Upload failed", error, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("public")
      .getPublicUrl(data.path);

    // Log the upload action
    await logAdminAction(
      user.id,
      'UPLOAD',
      'file',
      data.path,
      request,
      {
        fileName: fileName,
        fileType: file.type,
        fileSize: file.size,
        directory,
      }
    );

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      fileName: fileName,
    });
  } catch (error) {
    logError("Unexpected upload error", error);
    return NextResponse.json(
      { error: getSafeErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await getSupabaseRouteHandlerClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get file path from request
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        { error: "No file path provided" },
        { status: 400 }
      );
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from("public")
      .remove([filePath]);

    if (error) {
      logError("Delete failed", error, { filePath });
      return NextResponse.json(
        { error: getSafeErrorMessage(error) },
        { status: 500 }
      );
    }

    // Log the delete action
    await logAdminAction(
      user.id,
      'DELETE',
      'file',
      filePath,
      request,
      {
        filePath,
      }
    );

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    logError("Unexpected delete error", error);
    return NextResponse.json(
      { error: getSafeErrorMessage(error) },
      { status: 500 }
    );
  }
}
