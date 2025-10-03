/**
 * Migration script to upload static files from public/ directory to Supabase Storage
 * Run with: node scripts/migrateStaticFiles.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Files to migrate from public/ directory
const filesToMigrate = [
  {
    localPath: 'public/pratham.jpg',
    storagePath: 'images/profiles/pratham.jpg',
    description: 'Profile image',
  },
  {
    localPath: 'public/Pratham Satani.pdf',
    storagePath: 'documents/resumes/Pratham-Satani.pdf',
    description: 'Resume PDF',
  },
];

/**
 * Upload a file to Supabase Storage
 */
async function uploadFile(localPath, storagePath, description) {
  try {
    // Check if file exists locally
    if (!fs.existsSync(localPath)) {
      console.log(`⚠️  File not found: ${localPath}, skipping...`);
      return null;
    }

    // Read the file
    const fileBuffer = fs.readFileSync(localPath);
    const fileName = path.basename(localPath);
    
    // Determine content type
    const ext = path.extname(localPath).toLowerCase();
    const contentTypeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    };
    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    console.log(`📤 Uploading ${description}: ${fileName}`);
    console.log(`   Local: ${localPath}`);
    console.log(`   Storage: ${storagePath}`);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('public')
      .upload(storagePath, fileBuffer, {
        contentType,
        cacheControl: '3600',
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      return null;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('public')
      .getPublicUrl(storagePath);

    console.log(`   ✅ Success! Public URL: ${urlData.publicUrl}`);
    return urlData.publicUrl;

  } catch (error) {
    console.error(`   ❌ Unexpected error: ${error.message}`);
    return null;
  }
}

/**
 * Main migration function
 */
async function migrateFiles() {
  console.log('🚀 Starting static file migration to Supabase Storage...\n');

  const results = [];

  for (const file of filesToMigrate) {
    const publicUrl = await uploadFile(
      file.localPath,
      file.storagePath,
      file.description
    );
    
    results.push({
      ...file,
      publicUrl,
      success: !!publicUrl,
    });
    
    console.log(''); // Empty line for readability
  }

  // Summary
  console.log('📊 Migration Summary:');
  console.log('═══════════════════════════════════════════════════════════');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log('');

  if (successful.length > 0) {
    console.log('Successfully migrated files:');
    successful.forEach(r => {
      console.log(`  • ${r.description}`);
      console.log(`    Storage path: ${r.storagePath}`);
      console.log(`    Public URL: ${r.publicUrl}`);
      console.log('');
    });
  }

  if (failed.length > 0) {
    console.log('Failed migrations:');
    failed.forEach(r => {
      console.log(`  • ${r.description} (${r.localPath})`);
    });
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📝 Next Steps:');
  console.log('  1. Update seed.sql with the new Supabase Storage URLs');
  console.log('  2. Run: npx supabase db reset');
  console.log('  3. Update any hardcoded paths in your application code');
  console.log('');
  console.log('💡 Note: Keep the original files in public/ as fallback until');
  console.log('   you verify everything works correctly.');
}

// Run the migration
migrateFiles().catch(console.error);
