-- 0002_create_admin_user.sql
-- This migration file is a placeholder.
-- 
-- Admin users must be created through the Supabase Dashboard or API
-- because the auth schema requires special password hashing that
-- cannot be done directly in SQL migrations.
--
-- To create an admin user, use the provided Node.js script:
--   node scripts/createAdminUser.js
--
-- Or create manually via Supabase Dashboard:
--   1. Go to Authentication > Users
--   2. Add User
--   3. After creation, click user > Raw User Meta Data
--   4. Set app_metadata to: {"role": "admin"}

-- This is a no-op migration
select 1;
