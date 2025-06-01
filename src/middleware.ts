import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/ilan-ver',
    '/ilan-ver/:path*',
    '/profil',
    '/profil/:path*',
    '/favoriler',
    '/favoriler/:path*',
    '/mesajlar',
    '/mesajlar/:path*',
  ],
}; 