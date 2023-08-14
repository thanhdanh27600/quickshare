import { NextApiHandler } from 'next';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import puppeteer from 'puppeteer';
import { api } from 'utils/axios';
import date from 'utils/date';
import HttpStatusCode from 'utils/statusCode';

const TEMPLATE = {
  OK: `Machine is working as expected, ${date().toString()}`,
  FAIL: `Error! Machine is down!, ${date().toString()}`,
} as const;

export const handler: NextApiHandler<any> = api(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
  }
  const body = req.body;
  const t = body.t as keyof typeof TEMPLATE;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., Gmail, Outlook
    port: 587,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  const browser = await puppeteer.launch({});

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
      text: `${t ? TEMPLATE[t] || '' : ''}`,
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
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('An error occurred while sending the email');
  }
});
