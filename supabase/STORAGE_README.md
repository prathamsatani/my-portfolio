# Supabase Storage Setup

This directory contains the migration file to set up a public storage bucket in Supabase for storing static files.

## What's Included

### Migration: `0003_create_public_storage_bucket.sql`

Creates a public storage bucket named `public` with:
- **Public read access** - Anyone can view files
- **50MB file size limit** per file
- **Allowed file types**: JPEG, PNG, GIF, WebP, SVG, PDF, MP4, WebM
- **RLS policies** for authenticated users to upload, update, and delete files

## Usage

### 1. Apply the Migration

If using Supabase CLI:
```bash
npx supabase db push
```

Or manually run the migration in your Supabase dashboard SQL editor.

### 2. Upload Files

Use the helper functions in `src/lib/supabaseStorage.ts`:

```typescript
import { uploadFile, generateUniqueFileName } from '@/lib/supabaseStorage';
import { useSupabaseBrowserClient } from '@/lib/supabaseClient';

// In your component or API route
const supabase = useSupabaseBrowserClient();

// Upload a file
const file = event.target.files[0];
const fileName = generateUniqueFileName(file.name);
const path = `images/${fileName}`;
const publicUrl = await uploadFile(supabase, file, path);

// Now you can save publicUrl to your database
```

### 3. Access Files

Files are publicly accessible via:
```
https://[your-project-ref].supabase.co/storage/v1/object/public/public/[file-path]
```

Example:
```
https://abcdefgh.supabase.co/storage/v1/object/public/public/images/profile-1234567890.jpg
```

## Storage Helper Functions

The `src/lib/supabaseStorage.ts` file provides:

- `uploadFile()` - Upload a file to the bucket
- `deleteFile()` - Delete a file from the bucket
- `getPublicUrl()` - Get the public URL for a file
- `listFiles()` - List files in a directory
- `generateUniqueFileName()` - Create unique file names
- `extractPathFromUrl()` - Extract storage path from URL

## Recommended File Organization

```
public/
├── images/
│   ├── profiles/
│   ├── projects/
│   └── blogs/
├── documents/
│   └── resumes/
└── videos/
```

## Migration to Storage

To migrate existing static files from `public/` directory to Supabase Storage:

1. Upload files using the storage helper functions
2. Update database records to use the new Supabase storage URLs
3. Update any hardcoded paths in your code

Example migration script:
```typescript
import { createServerClient } from '@supabase/ssr';
import { uploadFile } from '@/lib/supabaseStorage';
import fs from 'fs';

async function migrateFile(localPath: string, storagePath: string) {
  const file = fs.readFileSync(localPath);
  const blob = new Blob([file]);
  const fileObject = new File([blob], storagePath);
  
  const publicUrl = await uploadFile(supabase, fileObject, storagePath);
  console.log(`Migrated ${localPath} to ${publicUrl}`);
}
```

## Security Notes

- **Public bucket** means files are accessible to anyone with the URL
- **Authenticated uploads** require users to be logged in
- **Service role** bypasses RLS - use carefully in API routes
- Consider implementing additional validation (file types, sizes) in your upload APIs

## Environment Variables Required

Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Admin Operations

For admin operations (like uploading files via API routes), use the service role client from `src/lib/supabaseServer.ts` which bypasses RLS policies.
