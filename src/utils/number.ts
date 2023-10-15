import { Prisma } from '@prisma/client';

export const parseIntSafe = (input?: string | number | null | Prisma.Decimal, df = 0) => {
  const rs = parseInt(input as string, 10);
  return isNaN(rs) ? df : rs;
};

export const parseFloatSafe = (input?: string | number | null | Prisma.Decimal, df = 0.0) => {
  const rs = parseInt(input as string, 10);
  return isNaN(rs) ? df : rs;
};
