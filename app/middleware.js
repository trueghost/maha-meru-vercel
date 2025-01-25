import { NextResponse } from 'next/server';

export function middleware(req) {
  const cacheHeader = new Headers();
  cacheHeader.set('Cache-Control', 's-maxage=31536000, stale-while-revalidate');

  return NextResponse.next({ headers: cacheHeader });
}