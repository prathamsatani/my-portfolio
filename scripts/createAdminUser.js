/**
 * createAdminUser.js
 * 
 * Creates an admin user in Supabase with the necessary role metadata.
 * This script uses the Supabase service role key to create users.
 * 
 * Usage:
 *   node scripts/createAdminUser.js
 * 
 * Or with custom credentials:
 *   node scripts/createAdminUser.js admin@example.com SecurePassword123!
 * 
 * Default credentials (if not provided):
 *   Email: admin@portfolio.local
 *   Password: admin123!ChangeMe
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const email = args[0] || 'admin@portfolio.local';
const password = args[1] || 'admin123!ChangeMe';

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env.local file not found!');
    console.error('   Make sure you have a .env.local file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  const env = {};
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

async function createAdminUser() {
  console.log('🚀 Creating admin user in Supabase...\n');

  // Load environment variables
  const env = loadEnvFile();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Error: Missing Supabase configuration!');
    console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('❌ Error: Invalid email format!');
    process.exit(1);
  }

  // Validate password strength
  if (password.length < 8) {
    console.error('❌ Error: Password must be at least 8 characters long!');
    process.exit(1);
  }

  console.log('📧 Email:', email);
  console.log('🔑 Password:', '*'.repeat(password.length));
  console.log('');

  // Prepare request data
  const requestData = JSON.stringify({
    email: email,
    password: password,
    email_confirm: true,
    app_metadata: {
      role: 'admin'
    }
  });

  // Parse Supabase URL
  const url = new URL(supabaseUrl);
  const options = {
    hostname: url.hostname,
    port: 443,
    path: '/auth/v1/admin/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Length': Buffer.byteLength(requestData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ Admin user created successfully!\n');
            console.log('📋 User Details:');
            console.log('   ID:', response.id);
            console.log('   Email:', response.email);
            console.log('   Role:', response.app_metadata?.role);
            console.log('   Created:', new Date(response.created_at).toLocaleString());
            console.log('\n🔐 Login Credentials:');
            console.log('   Email:', email);
            console.log('   Password:', password);
            console.log('\n🌐 Login URL:');
            console.log('   http://localhost:3000/admin/login');
            console.log('\n⚠️  IMPORTANT: Change your password after first login!');
            resolve(response);
          } else if (res.statusCode === 422 && response.msg?.includes('already been registered')) {
            console.log('ℹ️  User already exists with this email.');
            console.log('\n🔧 Updating user role to admin...');
            
            // If user exists, we need to find their ID and update their metadata
            updateExistingUser(email, supabaseUrl, serviceRoleKey)
              .then(resolve)
              .catch(reject);
          } else {
            console.error('❌ Failed to create admin user:');
            console.error('   Status:', res.statusCode);
            console.error('   Response:', JSON.stringify(response, null, 2));
            reject(new Error(`Failed with status ${res.statusCode}`));
          }
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
          console.error('   Raw response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
}

async function updateExistingUser(email, supabaseUrl, serviceRoleKey) {
  return new Promise((resolve, reject) => {
    // First, get the user by email
    const url = new URL(supabaseUrl);
    const getUserOptions = {
      hostname: url.hostname,
      port: 443,
      path: `/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
      method: 'GET',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`
      }
    };

    https.get(getUserOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.users && response.users.length > 0) {
            const user = response.users[0];
            console.log('   Found user:', user.id);
            
            // Update user's app_metadata to include admin role
            const updateData = JSON.stringify({
              app_metadata: {
                ...user.app_metadata,
                role: 'admin'
              }
            });

            const updateOptions = {
              hostname: url.hostname,
              port: 443,
              path: `/auth/v1/admin/users/${user.id}`,
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`,
                'Content-Length': Buffer.byteLength(updateData)
              }
            };

            const updateReq = https.request(updateOptions, (updateRes) => {
              let updateResData = '';

              updateRes.on('data', (chunk) => {
                updateResData += chunk;
              });

              updateRes.on('end', () => {
                const updateResponse = JSON.parse(updateResData);
                
                if (updateRes.statusCode === 200) {
                  console.log('✅ User role updated to admin successfully!\n');
                  console.log('📋 User Details:');
                  console.log('   ID:', updateResponse.id);
                  console.log('   Email:', updateResponse.email);
                  console.log('   Role:', updateResponse.app_metadata?.role);
                  console.log('\n🌐 Login URL:');
                  console.log('   http://localhost:3000/admin/login');
                  resolve(updateResponse);
                } else {
                  console.error('❌ Failed to update user:', updateResData);
                  reject(new Error('Failed to update user role'));
                }
              });
            });

            updateReq.on('error', reject);
            updateReq.write(updateData);
            updateReq.end();
          } else {
            console.error('❌ User not found with email:', email);
            reject(new Error('User not found'));
          }
        } catch (error) {
          console.error('❌ Error getting user:', error.message);
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error.message);
    process.exit(1);
  });
