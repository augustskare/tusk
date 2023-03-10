import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";

import type { Mastodon } from "./utils/mastodon";
import { $fetch } from "./utils/$fetch.server";

import * as styles from "./styles/global.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cssBundleHref || "" },
];

export const meta: MetaFunction = () => ({
  title: "Tusk",
  charset: "utf-8",
  viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
});

export async function loader({ request }: LoaderArgs) {
  let profile: Mastodon.Account | undefined;
  try {
    profile = await $fetch<Mastodon.Account>(
      "accounts/verify_credentials",
      undefined,
      request
    );
  } catch (error) {}
  return json({
    profile,
    service: process.env.SERVICE,
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className={styles.body}>
        <header className={styles.header}>
          <h1 className={styles.logo}>
            <Link to="/">Tusk</Link>
          </h1>

          {data.profile ? (
            <Link to={data.profile.acct}>@{data.profile.acct}</Link>
          ) : (
            <a
              href={`${data.service}/oauth/authorize?client_id=${data.client_id}&scope=read+write+push&redirect_uri=${data.redirect_uri}&response_type=code`}
            >
              Sign in
            </a>
          )}
        </header>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
