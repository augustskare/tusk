import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { Mastodon } from "~/utils/mastodon";
import { $fetch } from "~/utils/$fetch.server";
import { formatToots } from "~/utils/toots.server";

import { Toot } from "~/components/Toot";

export async function loader({ params, request }: LoaderArgs) {
  const replies = await $fetch<{
    ancestors: Mastodon.Toot[];
    descendants: Mastodon.Toot[];
  }>(`statuses/${params.status}/context`, undefined, request);

  let toot = formatToots(
    await $fetch<Mastodon.Toot>(`statuses/${params.status}`, undefined, request)
  );

  return {
    replies: {
      ancestors: formatToots(replies.ancestors),
      descendants: formatToots(replies.descendants),
    },
    toot,
  };
}

export async function action({ request, params }: ActionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action") as "reblog" | "favourite" | "bookmark";

  await $fetch(
    `/api/v1/statuses/${params.status}/${action}`,
    {
      method: "post",
    },
    request
  );
  return redirect(request.url);
}

export default function Profile() {
  const { toot, replies } = useLoaderData<typeof loader>();

  return (
    <ul>
      {replies.ancestors.map((toot) => (
        <li key={toot.id}>
          <Toot {...toot} />
        </li>
      ))}
      <li>
        <Toot {...toot} highlighted />
      </li>
      {replies.descendants.map((toot) => (
        <li key={toot.id}>
          <Toot {...toot} />
        </li>
      ))}
    </ul>
  );
}
