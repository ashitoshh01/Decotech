import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'hi', 'es'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(hi|en|es)/:path*']
};
