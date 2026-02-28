import createMiddleware from 'next-intl/middleware';
import { locales } from './lib/navigation';

export default createMiddleware({
  locales,
  defaultLocale: 'en'
});

export const config = {
  // Match all routes except Next.js internals and static files
  matcher: ['/((?!_next|_vercel|.*\\..*).*)']
};
