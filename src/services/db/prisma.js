const { PrismaClient } = require('@prisma/client');

/** @type {PrismaClient} */
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

// prisma.$on('beforeExit', async () => {
//   console.log('\x1b[33m prisma exiting...\n');
// });

module.exports = prisma;
