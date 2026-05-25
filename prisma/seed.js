/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Services
  const services = ['Service 1', 'Service 2', 'Service 3'];
  for (const name of services) {
    await prisma.service.upsert({
      where: { id: parseInt(name.split(' ')[1]) },
      update: { name },
      create: { id: parseInt(name.split(' ')[1]), name },
    });
  }

  // Create Providers
  for (let i = 1; i <= 8; i++) {
    await prisma.provider.upsert({
      where: { id: i },
      update: { name: `Provider ${i}`, monthly_quota: 10 },
      create: { id: i, name: `Provider ${i}`, monthly_quota: 10 },
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
