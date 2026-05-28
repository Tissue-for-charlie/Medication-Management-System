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
  jwtSecret: process.env.NODE_ENV === 'production' ? mustGet('JWT_SECRET') : (process.env.JWT_SECRET || 'dev_jwt_secret_key'),
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
