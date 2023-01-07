import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Mastodon } from "~/utils/mastodon";
import { $fetch } from "~/utils/$fetch.server";
import { formatToots } from "~/utils/toots.server";

import { Toot } from "~/components/Toot";

export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.acct !== "string") {
    throw new Response("Not found", { status: 404 });
  }

  const profile = await $fetch<Mastodon.Account>(
    "accounts/lookup",
    {
      params: { acct: params.acct },
    },
    request
  );
  const statuses = formatToots(
    await $fetch<Mastodon.Toot[]>(
      `accounts/${profile.id}/statuses`,
      undefined,
      request
    )
  );

  return { profile, statuses };
}

export default function Profile() {
  const { statuses } = useLoaderData<typeof loader>();

  return (
    <ul>
      {statuses.map((item) => {
        return (
          <li key={item.id}>
            <Toot {...item} />
          </li>
        );
      })}
    </ul>
  );
}
