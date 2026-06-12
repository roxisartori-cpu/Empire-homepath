import bcrypt from 'bcryptjs';
const hash = '$2b$10$yCr2wudvtG7iIreoCimh7.Ww5RRoiFjEqUFoH.26ZkqnToHrfr4Na';
const password = 'EmpireAdmin2026!';
const matches = await bcrypt.compare(password, hash);
console.log('Matches:', matches);
