// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { alternateBrandUrl, brandUrl, brandUrlShort } from 'types/constants';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // the list of all allowed origins
  const allowedOrigins = [brandUrl, brandUrlShort, ...[alternateBrandUrl]];
  // retrieve the current response
  const res = NextResponse.next();
  // retrieve the HTTP "Origin" header
  // from the incoming request
  const origin = request.headers.get('origin');
  console.log('origin', origin);
  // if the origin is an allowed one,
  // add it to the 'Access-Control-Allow-Origin' header
  if (!origin) return res;
  if (allowedOrigins.includes(origin)) {
    res.headers.append('Access-Control-Allow-Origin', origin);
  }
  // add the remaining CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  return res;
}

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:path*',
};
