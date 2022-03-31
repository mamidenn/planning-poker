import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest, ev: NextFetchEvent) => {
  if (!req.cookies.user) {
    const url = req.nextUrl.clone();
    url.pathname = "register";
    url.searchParams.append("source", req.nextUrl.pathname);
    console.log(url);
    return NextResponse.redirect(url);
  }
};
