import { userSession } from "./session";

interface Options extends RequestInit {
  params?: Record<string, string>;
}

export async function $fetch<R>(
  endpoint: string,
  { params, ...init }: Options = {},
  request?: Request
): Promise<R> {
  const url = new URL(
    endpoint.startsWith("/") ? endpoint : `/api/v1/${endpoint}`,
    process.env.SERVICE
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers = new Headers();
  if (request) {
    const session = await userSession.getSession(request.headers.get("Cookie"));
    const access_token = session.get("access_token");
    headers.set("Authorization", `Bearer ${access_token}`);
  }

  const response = await fetch(url, { ...init, headers });

  if (response.ok) {
    return response.json();
  }

  throw response;
}
