import { PrismaClient } from '@prisma/client';
import logger from '../src/logger/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('Starting database seeding', {
    fileName: 'seed.ts',
    methodName: 'main',
  });

  try {
    // Create sample users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
          email: 'john.doe@example.com',
          name: 'John Doe',
          age: 30,
          city: 'New York',
          zipCode: '10001',
        },
      }),
      prisma.user.upsert({
        where: { email: 'jane.smith@example.com' },
        update: {},
        create: {
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          age: 25,
          city: 'Los Angeles',
          zipCode: '90210',
        },
      }),
      prisma.user.upsert({
        where: { email: 'bob.johnson@example.com' },
        update: {},
        create: {
          email: 'bob.johnson@example.com',
          name: 'Bob Johnson',
          age: 35,
          city: 'Chicago',
          zipCode: '60601',
        },
      }),
    ]);

    logger.info('Database seeded successfully', {
      fileName: 'seed.ts',
      methodName: 'main',
      variables: {
        usersCreated: users.length,
        userEmails: users.map(user => user.email),
      },
    });

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${users.length} users`);
  } catch (error) {
    logger.error('Error seeding database', {
      fileName: 'seed.ts',
      methodName: 'main',
      variables: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    });
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
