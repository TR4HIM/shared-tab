import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'General',
    },
    {
      name: 'Payment',
    },
    {
      name: 'Entertainment',
    },
    {
      name: 'Food & Drink',
    },
    {
      name: 'Home',
    },
    {
      name: 'Personal',
    },
    {
      name: 'Transportation',
    },
    {
      name: 'Utilities',
    },
    {
      name: 'Services',
    },
    {
      name: 'Insurance',
    },
    {
      name: 'Taxes',
    },
  ];

  for (const category of categories) {
    await prisma.expenseCategory.upsert({
      where: { name: category.name },
      create: {
        name: category.name,
      },
      update: {
        name: category.name,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
