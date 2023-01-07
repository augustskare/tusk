import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { userSession } from "~/utils/session";

export async function loader({ request }: LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const session = await userSession.getSession(request.headers.get("Cookie"));

  if (!code) {
    return redirect("/");
  }

  const response = await fetch(new URL("/oauth/token", process.env.SERVICE), {
    method: "post",
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
      code: code,
      scope: process.env.SCOPE,
    }),
  });

  const { access_token } = (await response.json()) as {
    access_token: string;
    token_type: "Bearer";
    scope: string;
    created_at: number;
  };

  session.set("access_token", access_token);
  return redirect("/", {
    headers: {
      "Set-Cookie": await userSession.commitSession(session),
    },
  });
}
