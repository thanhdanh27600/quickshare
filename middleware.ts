// middleware.ts
import { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // const fileTransport = pino.transport({
  //   target: 'pino/file',
  //   options: { destination: `./logs/pino.log` },
  // });
  // return NextResponse.next();
}

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
};
