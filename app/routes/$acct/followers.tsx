import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Mastodon } from "~/utils/mastodon";
import { $fetch } from "~/utils/$fetch.server";

import { DisplayName } from "~/components/DisplayName";

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
  const accounts = await $fetch<Mastodon.Account[]>(
    `accounts/${profile.id}/followers`,
    undefined,
    request
  );

  return { accounts };
}

export default function ProfileFollowers() {
  const { accounts } = useLoaderData<typeof loader>();

  return (
    <ul>
      {accounts.map((account) => {
        return (
          <li
            key={account.id}
            style={{
              borderBlockEnd: "1px solid var(--gray6)",
              padding: ".5rem",
            }}
          >
            <DisplayName
              acct={account.acct}
              display_name={account.display_name}
              emojis={account.emojis}
            />
          </li>
        );
      })}
    </ul>
  );
}
