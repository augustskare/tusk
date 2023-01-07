import { createCookieSessionStorage } from "@remix-run/node";

export const userSession = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.COOKIE_SECRET || "supersecret"],
    sameSite: "lax",
    path: "/",
    /* how long is the session valid? */
    /* maxAge: 86400, */
    httpOnly: true,
  },
});
