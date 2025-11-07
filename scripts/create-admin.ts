#!/usr/bin/env node
/**
 * Script: create-admin.ts
 *
 * Usage (run from project root):
 *   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" SUPABASE_URL="https://..." ADMIN_EMAIL="you@domain" ADMIN_PASSWORD="..." node ./scripts/create-admin.ts
 *
 * This script requires a Supabase service_role key. It will create an auth user (admin) and
 * optionally insert a record into the `users` table. Do NOT place the service role key in the repo.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. Exiting.');
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false }
});

async function main() {
  try {
    console.log('Creating admin user:', adminEmail);

    // Create auth user via admin API
    // NOTE: supabase-js exposes admin auth methods under `auth.admin` in v2
    // If this environment's supabase client does not expose admin methods, use Supabase dashboard or CLI.
    // @ts-ignore
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { is_admin: true }
    });

    if (error) {
      console.error('Create user error:', error);
      process.exit(1);
    }

    console.log('User created:', data?.email || JSON.stringify(data));

    // Optionally insert into your users/profile table (if present)
    try {
      const profile = {
        id: data?.id || undefined,
        email: adminEmail,
        created_at: new Date().toISOString(),
        is_admin: true
      } as any;

      const { error: insertError } = await supabaseAdmin.from('users').insert(profile);
      if (insertError) {
        console.warn('Could not insert into users table:', insertError.message || insertError);
      } else {
        console.log('Inserted admin record into users table (if table exists).');
      }
    } catch (dbErr) {
      console.warn('Skipping users table insert; table may not exist or permissions blocked.');
    }

    console.log('Done. Please revoke or rotate service role key if used on shared machines.');
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main();
