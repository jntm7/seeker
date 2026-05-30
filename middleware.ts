import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/auth/signin", "/api/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next()
  }

  const isDemo = request.cookies.get("demo_mode")?.value === "true"

  if (isDemo) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get("authjs.session-token") ?? request.cookies.get("__Secure-authjs.session-token")
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
