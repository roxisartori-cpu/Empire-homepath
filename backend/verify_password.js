import bcrypt from 'bcryptjs';
const hash = '$2b$10$fqF1YYJ4j5Nw7HsejX.0DO4x.YRR11lxlCJ5G/deJxRj7KKCxK1P.';
const password = 'EmpireAdmin2026!';
bcrypt.compare(password, hash).then(res => console.log('Match:', res));
