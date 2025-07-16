import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  errorFormat: 'minimal',
  transactionOptions: {
    timeout: 20000, // Set the timeout to 20 seconds
    maxWait: 5000, // Set the maximum wait time to 5 seconds
  },
});

export default prisma;
