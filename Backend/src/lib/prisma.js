const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const config = require("../config");

/**
 * @type {PrismaClient}
 */
let prisma;

// Validate database URL exists
if (!config.db.url) {
  console.error("❌ Error: DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  const pool = new Pool({ connectionString: config.db.url });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  // Prevent multiple instances of Prisma Client in development (singleton pattern)
  if (!global.prisma) {
    const pool = new Pool({ connectionString: config.db.url });
    const adapter = new PrismaPg(pool);
    global.prisma = new PrismaClient({
      adapter,
      log: ["query", "error", "warn"],
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;

