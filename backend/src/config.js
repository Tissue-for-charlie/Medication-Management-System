const dotenv = require('dotenv');

dotenv.config();

function mustGet(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3001),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_here', // 建议在生产环境中使用更安全的密钥
  db: {
    host: mustGet('DB_HOST'),
    port: Number(process.env.DB_PORT || 3306),
    user: mustGet('DB_USER'),
    password: mustGet('DB_PASSWORD'),
    database: mustGet('DB_NAME'),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10)
  }
};

module.exports = { config };
