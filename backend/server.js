import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

function runDb(query) {
  try {
    const command = `team-db "${query.replace(/"/g, '\\"')}"`;
    const output = execSync(command).toString();
    if (!output.trim()) return [];
    return JSON.parse(output);
  } catch (err) {
    console.error('DB Error:', err.message);
    throw err;
  }
}

app.post('/api/verify', (req, res) => {
  const { program_id, user_data } = req.body;
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  try {
    runDb(`INSERT INTO verification_requests (id, program_id, user_data, status, created_at, updated_at) VALUES ('${id}', '${program_id}', '${JSON.stringify(user_data).replace(/'/g, "''")}', 'pending', '${created_at}', '${created_at}')`);
    
    // Also notify the agent via inbox
    const messageId = crypto.randomUUID();
    runDb(`INSERT INTO inbox (id, from_agent, to_agent, body) VALUES ('${messageId}', 'agent-engineer', 'agent-live-verification-agent', 'New verification request: ${id} for program ${program_id}')`);
    
    res.json({ id, status: 'pending' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/api/status/:id', (req, res) => {
  const { id } = req.params;
  try {
    const results = runDb(`SELECT * FROM verification_requests WHERE id = '${id}'`);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    const row = results[0];
    if (row.result_data) {
        row.result_data = JSON.parse(row.result_data);
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.post('/api/lender-inquiry', (req, res) => {
  const { program_name, name, email, phone, message } = req.body;
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  
  try {
    runDb(`INSERT INTO lender_inquiries (id, program_name, name, email, phone, message, created_at) VALUES ('${id}', '${program_name.replace(/'/g, "''")}', '${name.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${phone.replace(/'/g, "''")}', '${message.replace(/'/g, "''")}', '${created_at}')`);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bridge server listening on http://0.0.0.0:${PORT}`);
});
