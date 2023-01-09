import { createCookieSessionStorage } from "@remix-run/node";

export const userSession = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.COOKIE_SECRET || "supersecret"],
    sameSite: "lax",
    path: "/",
    maxAge: 31556926,
    httpOnly: true,
  },
});
