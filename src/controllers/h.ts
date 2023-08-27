import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import puppeteer from 'puppeteer';
import prisma from '../db/prisma';
import { isProduction } from '../types/constants';
import { api } from '../utils/axios';
import date from '../utils/date';
export const handler = api(
  async (req, res) => {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // e.g., Gmail, Outlook
      port: 587,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
      executablePath: isProduction ? '/usr/bin/chromium-browser' : undefined,
    });

    const page = await browser.newPage();
    await page.goto('https://clickdi.top', {
      timeout: 10000,
      waitUntil: 'load',
    });
    const clickdiPage = await page.createPDFStream();
    await page.goto('https://clid.top', {
      timeout: 10000,
      waitUntil: 'load',
    });
    const clidPage = await page.pdf();
    try {
      const mailOptions: Mail.Options = {
        from: 'bvtvda@gmail.com',
        sender: 'Dolph Notify',
        to: 'dolph.pham@gmail.com',
        subject: '[Clickdi] Heartbeat',
        text: `- Machine is working as expected, ${date().toString()}.\n- Last 5 forwards:${JSON.stringify(
          await prisma.urlForwardMeta.findMany({
            include: { UrlShortenerHistory: true },
            take: 5,
            orderBy: { updatedAt: 'desc' },
          }),
          null,
          2,
        )}`,
        attachments: [
          {
            filename: `clickdi-${date().format()}.pdf`,
            content: clickdiPage,
          },
          {
            filename: `clid-${date().format()}.pdf`,
            content: clidPage,
          },
        ],
      };
      await transporter.sendMail(mailOptions);
      await browser.close();
      res.status(200).send('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('An error occurred while sending the email');
    }
  },
  ['POST'],
);
