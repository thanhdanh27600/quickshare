// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // retrieve the current response
  const res = NextResponse.next();
  return res;
}

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:path*',
};
