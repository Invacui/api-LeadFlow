"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../src/logger/logger"));
const prisma = new client_1.PrismaClient();
async function main() {
    logger_1.default.info('Starting database seeding', {
        fileName: 'seed.ts',
        methodName: 'main',
    });
    try {
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
        logger_1.default.info('Database seeded successfully', {
            fileName: 'seed.ts',
            methodName: 'main',
            variables: {
                usersCreated: users.length,
                userEmails: users.map(user => user.email),
            },
        });
        console.log('✅ Database seeded successfully!');
        console.log(`📊 Created ${users.length} users`);
    }
    catch (error) {
        logger_1.default.error('Error seeding database', {
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
//# sourceMappingURL=seed.js.map