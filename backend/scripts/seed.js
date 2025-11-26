const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const sampleData = require('../data/sampleData');

const prisma = new PrismaClient();

const seedDatabase = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required to seed the database');
    }

    const hashedPassword = await bcrypt.hash(sampleData.user.password, 10);

    const user = await prisma.user.upsert({
      where: { email: sampleData.user.email.toLowerCase() },
      update: { name: sampleData.user.name, password: hashedPassword },
      create: {
        name: sampleData.user.name,
        email: sampleData.user.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    await prisma.transaction.deleteMany({ where: { userId: user.id } });
    await prisma.category.deleteMany({ where: { userId: user.id } });
    await prisma.invoice.deleteMany({ where: { userId: user.id } });

    await Promise.all(
      sampleData.categories.map((category) =>
        prisma.category.create({
          data: {
            name: category.name,
            type: category.type,
            userId: user.id,
          },
        })
      )
    );

    await Promise.all(
      sampleData.transactions.map((transaction) =>
        prisma.transaction.create({
          data: {
            title: transaction.title,
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            date: transaction.date ? new Date(transaction.date) : new Date(),
            userId: user.id,
          },
        })
      )
    );

    await Promise.all(
      sampleData.invoices.map((invoice) =>
        prisma.invoice.create({
          data: {
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            status: invoice.status || 'unpaid',
            date: invoice.date ? new Date(invoice.date) : new Date(),
            totalAmount: invoice.items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0
            ),
            userId: user.id,
            items: {
              create: invoice.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        })
      )
    );

    console.log('Seeding completed successfully');
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedDatabase();
