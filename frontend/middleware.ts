import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
        // Authorided gove acess to req and token

    
        const {pathname} = req.nextUrl;

        if(
            pathname.startsWith("/api/auth")||
            pathname === "/login"||
            (pathname === "/register")){
                return true;
            }

        // sb
        
        if(pathname === "/") return true


      return !!token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
});

// This configuration controls which routes the middleware applies to
export const config = {
  matcher: [
    /*
      This pattern:
      - Matches any path NOT starting with _next/static, _next/image, favicon.ico, or public/
      - Equivalent to: ^/(?!_next/static|_next/image|favicon\.ico|public/).*
    */
    "/((?!_next/static|_next/image|favicon\\.ico|public/).*)"
  ]
};
