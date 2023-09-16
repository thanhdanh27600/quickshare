import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SERVER_AUTH } from 'types/constants';
import prisma from '../../../db/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: SERVER_AUTH,
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions);
