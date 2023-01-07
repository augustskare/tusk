import { createElement } from "react";
import { Form, Link, useTransition } from "@remix-run/react";

import type { Elements } from "~/utils/toots.server";
import type { Mastodon } from "~/utils/mastodon";

import { DisplayName } from "./DisplayName";
import { Time } from "./Time";

function Toot(
  props: Omit<Mastodon.Toot, "content"> & {
    highlighted?: boolean;
    content: Elements[];
  }
) {
  const toot = props.reblog || props;
  return (
    <article
      className={`toot ${props.highlighted ? "highlighted" : ""}`}
      lang={toot.language || undefined}
    >
      <header>
        <img src={toot.account.avatar} width={28} height={28} alt="" />
        <p>
          <DisplayName
            display_name={toot.account.display_name}
            acct={toot.account.acct}
            emojis={toot.account.emojis}
            showAcct
          />{" "}
          {toot.in_reply_to_id ? "replyed" : "posted"}{" "}
          <Link to={`/${toot.account.acct}/s/${toot.id}`}>
            <Time>{toot.created_at}</Time>
          </Link>
        </p>
      </header>

      <div>
        <TootContent nodes={toot.content} />
      </div>

      <Media media={toot.media_attachments} />

      <footer className="small">
        <dl className="details">
          <dt>Boosted</dt>
          <dd>{toot.reblogs_count}</dd>

          <dt>Favourites</dt>
          <dd>{toot.favourites_count}</dd>

          <dt>Replies</dt>
          <dd>{toot.replies_count}</dd>
        </dl>
      </footer>

      <Actions toot={toot} />

      {props.reblog ? (
        <aside className="small" style={{ marginBlockStart: ".5rem" }}>
          Boosted by{" "}
          <DisplayName
            display_name={props.account.display_name}
            emojis={props.account.emojis}
            acct={props.account.acct}
          />
        </aside>
      ) : null}
    </article>
  );
}

function Actions({ toot }: { toot: Mastodon.Toot }) {
  const transition = useTransition();
  const loading = transition.state !== "idle";
  return (
    <Form
      className="actions"
      method="post"
      action={`/${toot.account.acct}/s/${toot.id}`}
    >
      <button
        name="_action"
        disabled={loading}
        value={toot.favourited ? "unreblog" : "reblog"}
      >
        {toot.reblogged ? "Unboost" : "Boost"} {toot.reblogs_count}
      </button>
      <button
        name="_action"
        disabled={loading}
        value={toot.favourited ? "unfavourite" : "favourite"}
      >
        {toot.favourited ? "Unfavorite" : "Favorite"} {toot.favourites_count}
      </button>
      <button
        name="_action"
        disabled={loading}
        value={toot.bookmarked ? "unbookmark" : "bookmark"}
      >
        {toot.bookmarked ? "Unbookmark" : "Bookmark"}
      </button>
    </Form>
  );
}

function Media(props: { media: Mastodon.Toot["media_attachments"] }) {
  return (
    <div className="gallery">
      {props.media.map((media) => {
        if (media.type === "image") {
          return (
            <a key={media.id} href={media.url}>
              <img
                className="media"
                src={media.preview_url}
                width={media.meta.original.width}
                height={media.meta.original.height}
                alt=""
              />
            </a>
          );
        }
        if (media.type === "video") {
          return (
            <video
              key={media.id}
              src={media.remote_url}
              controls
              playsInline
              muted
              width={media.meta.original.width}
              height={media.meta.original.height}
            />
          );
        }

        if (media.type === "gifv") {
          return (
            <video
              key={media.id}
              src={media.remote_url}
              playsInline
              muted
              autoPlay
              loop
              width={media.meta.original.width}
              height={media.meta.original.height}
            />
          );
        }

        if (media.type === "audio") {
          return <audio key={media.id} src={media.remote_url} />;
        }
      })}
    </div>
  );
}

function TootContent(props: { nodes: Elements[] }) {
  return (
    <>
      {props.nodes.map((d, index) => {
        if (d.type === "element") {
          if (d.tagName === "br") {
            return <br key={index} />;
          }

          if (d.tagName === "a" && d.card) {
            return null;
          }

          return createElement(
            d.tagName,
            {
              key: index,
              href: d.href,
            },
            <TootContent nodes={d.children} />
          );
        }
        if (d.type === "emoji") {
          return (
            <img key={index} src={d.url} alt={d.shortcode} className="emoji" />
          );
        }
        if (d.type === "text") {
          return d.value;
        }
        if (d.type === "mention") {
          return (
            <Link key={index} to={`/${d.value}@${d.instance}`}>
              @{d.value}
            </Link>
          );
        }
        if (d.type === "hashtag") {
          return (
            <Link key={index} to={`/tags/${d.value}`}>
              #{d.value}
            </Link>
          );
        }

        return <></>;
      })}
    </>
  );
}

export { Toot };
