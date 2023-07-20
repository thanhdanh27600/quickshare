// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { allowedDomains } from 'types/constants';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // add the CORS headers to the response
  const origin = request.headers.get('host');
  console.log('origin', origin);
  const allowed = allowedDomains.some((domain) => (origin ? domain.includes(origin) : false));
  console.log('allowed', allowed);
  if (allowed && !!origin) {
    request.headers.append('Access-Control-Allow-Credentials', 'true');
    request.headers.append('Access-Control-Allow-Origin', origin);
    request.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    request.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    );
  }

  return NextResponse.next();
}

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
};
