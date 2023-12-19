import 'next';
import { Session } from 'next-auth';
declare module 'next' {
  interface NextApiRequest extends IncomingMessage {
    /**
     * Object of `query` values from url
     */
    query: Partial<{
      [key: string]: string | string[];
    }>;
    /**
     * Object of `cookies` from header
     */
    cookies: Partial<{
      [key: string]: string;
    }>;
    body: any;
    env: Env;
    draftMode?: boolean;
    preview?: boolean;
    /**
     * Preview data set on the request, if any
     * */
    previewData?: PreviewData;
    session: Session | null;
  }
}
