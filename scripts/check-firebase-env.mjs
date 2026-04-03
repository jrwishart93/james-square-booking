#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const envPath = process.argv[2] ?? '.env.local';
const absPath = path.resolve(process.cwd(), envPath);

if (!fs.existsSync(absPath)) {
  console.error(`❌ Env file not found: ${absPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(absPath, 'utf8');

const env = {};
for (const line of raw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;

  const key = trimmed.slice(0, idx).trim();
  let value = trimmed.slice(idx + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  env[key] = value;
}

const required = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
];

for (const key of required) {
  if (!env[key]) {
    console.error(`❌ Missing required variable: ${key}`);
    process.exit(1);
  }
}

if (!env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN.includes(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)) {
  console.warn(
    `⚠️ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (${env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}) does not contain NEXT_PUBLIC_FIREBASE_PROJECT_ID (${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}).`
  );
} else {
  console.log('✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN appears to match NEXT_PUBLIC_FIREBASE_PROJECT_ID');
}

const adminRaw = env.FIREBASE_ADMIN_CREDENTIALS ?? env.FIREBASE_ADMIN_JSON;

if (!adminRaw) {
  console.error('❌ Missing FIREBASE_ADMIN_CREDENTIALS and FIREBASE_ADMIN_JSON');
  process.exit(1);
}

const hasEscapedNewlinesInRawAdminJson = adminRaw.includes('\\n');

let adminJson;
try {
  adminJson = JSON.parse(adminRaw);
} catch (error) {
  console.error('❌ FIREBASE_ADMIN_CREDENTIALS/FIREBASE_ADMIN_JSON is not valid JSON');
  console.error(String(error));
  process.exit(1);
}

if (adminJson.project_id !== env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error(
    `❌ project_id mismatch: admin JSON has ${adminJson.project_id}, NEXT_PUBLIC_FIREBASE_PROJECT_ID has ${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`
  );
  process.exit(1);
}
console.log('✅ Admin credentials project_id matches NEXT_PUBLIC_FIREBASE_PROJECT_ID');

if (env.FIREBASE_PROJECT_ID && env.FIREBASE_PROJECT_ID !== env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error(
    `❌ FIREBASE_PROJECT_ID mismatch: ${env.FIREBASE_PROJECT_ID} vs ${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`
  );
  process.exit(1);
}
if (env.FIREBASE_PROJECT_ID) {
  console.log('✅ FIREBASE_PROJECT_ID matches NEXT_PUBLIC_FIREBASE_PROJECT_ID');
} else {
  console.log('ℹ️ FIREBASE_PROJECT_ID not set (optional)');
}

if (typeof adminJson.private_key !== 'string' || !adminJson.private_key.trim()) {
  console.error('❌ private_key missing in admin credentials JSON');
  process.exit(1);
}

if (hasEscapedNewlinesInRawAdminJson) {
  console.log('✅ private_key appears JSON-escaped with \\n line breaks in env var payload');
} else {
  console.warn('⚠️ private_key does not appear JSON-escaped with \\n line breaks in env var payload.');
}

if (!env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith('AIza')) {
  console.warn('⚠️ NEXT_PUBLIC_FIREBASE_API_KEY does not look like a Firebase Web API key.');
} else {
  console.log('✅ NEXT_PUBLIC_FIREBASE_API_KEY format looks valid');
}

console.log('\nAll critical Firebase environment checks passed.');
