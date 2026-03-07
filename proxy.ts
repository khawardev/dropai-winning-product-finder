import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const publicPaths = ['/', '/login', '/signup', '/api/auth']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = publicPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isPublicPath) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
