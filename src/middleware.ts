import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdminRoutes, authRoutes, protectedRoutes } from '@/routes/routes';
import { jwtDecode } from 'jwt-decode';

// Flip to false to take the site out of maintenance mode.
const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  if (MAINTENANCE_MODE) {
    if (request.nextUrl.pathname !== '/maintenance') {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    return NextResponse.next();
  }

  const currentUser = request.cookies.get('currentUser')?.value;

  if (
    protectedRoutes.includes(request.nextUrl.pathname) &&
    (!currentUser || Date.now() > JSON.parse(currentUser).expiredAt)
  ) {
    request.cookies.delete('currentUser');
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('currentUser');

    return response;
  }

  if (authRoutes.includes(request.nextUrl.pathname) && currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    (!currentUser ||
      Date.now() > JSON.parse(currentUser).expiredAt ||
      getRoleFromJWT(JSON.parse(currentUser).accessToken) !== 'ADMIN')
  ) {
    request.cookies.delete('currentUser');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('currentUser');

    return response;
  }

  if (authAdminRoutes.includes(request.nextUrl.pathname) && currentUser) {
    return NextResponse.redirect(new URL('/admin/users', request.url));
  }
}

const getRoleFromJWT = (token: string) => {
  const decodedToken = jwtDecode<{ role: string }>(token);
  if (!decodedToken) return null;

  return decodedToken.role;
};

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico)$).*)',
  ],
};
