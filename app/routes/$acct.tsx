import { Fragment } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import type { Mastodon } from "~/utils/mastodon";
import { $fetch } from "~/utils/$fetch.server";

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

  return { profile };
}

export default function Profile() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <>
      <div
        style={{ borderBlockEnd: "1px solid var(--gray6)", padding: ".5rem" }}
      >
        <header>
          <img width={40} height={40} src={profile.avatar} alt="" />
          <h1>{profile.display_name}</h1>
        </header>
        <div dangerouslySetInnerHTML={{ __html: profile.note }} />

        <dl>
          <dt>Followers</dt>
          <dd>
            <Link to={`/${profile.acct}/followers`}>
              {profile.followers_count}
            </Link>
          </dd>
          <dt>Following</dt>
          <dd>
            <Link to={`/${profile.acct}/following`}>
              {profile.following_count}
            </Link>
          </dd>
          <dt>Statuses count</dt>
          <dd>{profile.statuses_count}</dd>
        </dl>

        <dl>
          {profile.fields.map((field) => {
            return (
              <Fragment key={field.name}>
                <dt>{field.name}</dt>
                <dd dangerouslySetInnerHTML={{ __html: field.value }} />
              </Fragment>
            );
          })}
        </dl>
      </div>

      <Outlet />
    </>
  );
}
