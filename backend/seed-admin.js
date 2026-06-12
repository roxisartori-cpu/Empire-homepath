import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

const email = 'RoxanneSartori@gmail.com';
const password = 'EmpireAdmin2026!'; // Temporary password
const role = 'admin';

const client = createClient({
  url: process.env.TURSO_URL || process.env.TEAM_DB_URL || 'libsql://agent-team-5cbc01a6-cto.aws-us-west-2.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || process.env.TEAM_DB_AUTH_TOKEN,
});

async function seed() {
  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  
  try {
    await client.execute({
      sql: "INSERT INTO users (id, email, password_hash, role, created_at, subscription_status, plan) VALUES (?, ?, ?, ?, ?, 'active', 'white-label')",
      args: [id, email, passwordHash, role, createdAt]
    });
    console.log(`Admin account created for ${email}`);
    console.log(`Temporary password: ${password}`);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  } finally {
    // Note: In a real app we might not close immediately if we had more to do
  }
}

seed();

