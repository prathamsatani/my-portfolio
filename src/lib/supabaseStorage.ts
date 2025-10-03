import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Upload a file to Supabase storage
 * @param supabase - Supabase client instance
 * @param file - File to upload
 * @param path - Path within the public bucket (e.g., 'images/profile.jpg')
 * @returns The public URL of the uploaded file
 */
export async function uploadFile(
  supabase: SupabaseClient,
  file: File,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from("public")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true, // Overwrite if file exists
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("public")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase storage
 * @param supabase - Supabase client instance
 * @param path - Path of the file to delete
 */
export async function deleteFile(
  supabase: SupabaseClient,
  path: string
): Promise<void> {
  const { error } = await supabase.storage.from("public").remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get the public URL for a file in storage
 * @param supabase - Supabase client instance
 * @param path - Path of the file
 * @returns The public URL
 */
export function getPublicUrl(
  supabase: SupabaseClient,
  path: string
): string {
  const { data } = supabase.storage.from("public").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * List files in a directory
 * @param supabase - Supabase client instance
 * @param path - Directory path (empty string for root)
 * @returns Array of file objects
 */
export async function listFiles(
  supabase: SupabaseClient,
  path: string = ""
) {
  const { data, error } = await supabase.storage.from("public").list(path, {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data;
}

/**
 * Generate a unique file name to avoid collisions
 * @param originalName - Original file name
 * @returns A unique file name with timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split(".").pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  const sanitized = nameWithoutExt.replace(/[^a-z0-9]/gi, "-").toLowerCase();
  return `${sanitized}-${timestamp}-${random}.${extension}`;
}

/**
 * Extract storage path from a Supabase storage URL
 * @param url - Full Supabase storage URL
 * @returns The path within the bucket
 */
export function extractPathFromUrl(url: string): string | null {
  // Example URL: https://project.supabase.co/storage/v1/object/public/public/images/file.jpg
  const match = url.match(/\/storage\/v1\/object\/public\/public\/(.+)$/);
  return match ? match[1] : null;
}
