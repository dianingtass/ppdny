const { PrismaClient } = require('@prisma/client');

// Di lingkungan serverless (Vercel), setiap invocation bisa jadi cold start baru.
// connection_limit=1 mencegah DB connection exhausted karena banyak instance paralel.
// Untuk connection pooling yang lebih robust, gunakan PgBouncer atau Prisma Accelerate.

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || '';
  // Tambahkan connection_limit jika belum ada di URL
  if (url && !url.includes('connection_limit')) {
    const separator = url.includes('?') ? '&' : '?';
    const limit = process.env.NODE_ENV === 'production' ? 5 : 10;
    return `${url}${separator}connection_limit=${limit}&pool_timeout=20`;
  }
  return url;
};

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: { url: getDatabaseUrl() },
    },
  });
} else {
  // Di development, simpan instance di global object agar tidak
  // dibuat ulang setiap kali hot-reload terjadi.
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['warn', 'error'],
      datasources: {
        db: { url: getDatabaseUrl() },
      },
    });
  }
  prisma = global.__prisma;
}

module.exports = prisma;
