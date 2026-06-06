import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { execSync } from 'child_process';

const email = 'RoxanneSartori@gmail.com';
const password = 'EmpireAdmin2026!'; // Temporary password
const role = 'admin';

async function seed() {
  const passwordHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const query = `INSERT INTO users (id, email, password_hash, role, created_at, subscription_status, plan) VALUES ('${id}', '${email}', '${passwordHash}', '${role}', '${createdAt}', 'active', 'white-label')`;
  
  try {
    const command = `team-db "${query.replace(/"/g, '\\"')}"`;
    execSync(command);
    console.log(`Admin account created for ${email}`);
    console.log(`Temporary password: ${password}`);
  } catch (err) {
    console.error('Failed to seed admin:', err.message);
  }
}

seed();
