import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Mastodon } from "~/utils/mastodon";
import { formatToots } from "~/utils/toots.server";
import { $fetch } from "~/utils/$fetch.server";

import { Toot } from "~/components/Toot";

export async function loader({ request }: LoaderArgs) {
  let timeline: Mastodon.Toot[];
  try {
    timeline = await $fetch<Mastodon.Toot[]>(
      "timelines/home",
      { params: { limit: "40" } },
      request
    );
  } catch (error) {
    timeline = await $fetch<Mastodon.Toot[]>(
      "timelines/public",
      { params: { limit: "40" } },
      request
    );
  }

  return json({ timeline: formatToots(timeline) });
}

export default function Index() {
  const { timeline } = useLoaderData<typeof loader>();

  return (
    <ol>
      {timeline.map((toot) => {
        return (
          <li key={toot.id}>
            <Toot {...toot} />
          </li>
        );
      })}
    </ol>
  );
}
