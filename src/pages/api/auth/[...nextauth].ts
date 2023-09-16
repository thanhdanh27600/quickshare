import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { SERVER_AUTH } from 'types/constants';
import prisma from '../../../db/prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: SERVER_AUTH,
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
  theme: {
    colorScheme: 'light', // "auto" | "dark" | "light"
    brandColor: '#722df5', // Hex color code
    logo: '/assets/quickshare.png', // Absolute URL to image
    buttonText: '#fff', // Hex color code
  },
};
export default NextAuth(authOptions);
