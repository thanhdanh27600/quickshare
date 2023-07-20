// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
};
