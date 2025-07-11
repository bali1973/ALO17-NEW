import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs', 'app.log');

export function log(message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}` + (meta ? ` | ${JSON.stringify(meta)}` : '') + '\n';
  // Konsola yaz
  console.log(logEntry);
  // Dosyaya ekle
  try {
    fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    fs.appendFileSync(logFilePath, logEntry);
  } catch (e) {
    console.error('Log dosyasına yazılamadı:', e);
  }
} 