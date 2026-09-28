import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedPassword = await bcrypt.hash("produksi123", 10);

  const admin = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      department: "produksi",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      username: "admin",
      department: "produksi",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin berhasil dibuat!");
  console.log({
    id: admin.id,
    username: admin.username,
    department: admin.department,
    role: admin.role,
  });
}

main()
  .catch((error) => {
    console.error("❌ Seeder gagal:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });