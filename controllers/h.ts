import { NextApiHandler } from 'next';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import puppeteer from 'puppeteer';
import { isProduction } from 'types/constants';
import { api } from 'utils/axios';
import date from 'utils/date';
import HttpStatusCode from 'utils/statusCode';

export const handler: NextApiHandler<any> = api(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
  }
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
    args: ['--no-sandbox', '--disabled-setupid-sandbox', '--disable-gpu'],
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
      text: `Machine is working as expected, ${date().toString()}`,
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
});
