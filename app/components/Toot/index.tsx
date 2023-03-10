import { createElement } from "react";
import { Form, Link, useTransition } from "@remix-run/react";

import type { Elements, Toot as TootP } from "~/utils/toots.server";

import { DisplayName } from "../DisplayName";
import { Time } from "../Time";
import {
  BookmarkIcon,
  RocketIcon,
  StarIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

import * as styles from "./styles.css";
import { Emoji } from "../Emoji";
import { sprinkles } from "~/styles/sprinkles.css";
import { Mastodon } from "~/utils/mastodon";

interface TootProps extends TootP {
  highlighted?: boolean;
}

function Toot(props: TootProps) {
  const toot = props.reblog || props;

  return (
    <article
      className={styles.toot[props.highlighted ? "highlighted" : "default"]}
      lang={toot.language || undefined}
    >
      <header className={styles.header}>
        <img
          className={sprinkles({ borderRadius: "small" })}
          src={toot.account.avatar}
          width={28}
          height={28}
          alt=""
        />
        <p>
          <DisplayName
            display_name={toot.account.display_name}
            acct={toot.account.acct}
            emojis={toot.account.emojis}
            showAcct
          />{" "}
          <span className={sprinkles({ fontSize: "small" })}>
            {toot.in_reply_to_id ? "replyed" : "posted"}{" "}
            <Link to={`/${toot.account.acct}/s/${toot.id}`}>
              <Time>{toot.created_at}</Time>
            </Link>
          </span>
        </p>
      </header>

      {toot.content ? (
        <div className={styles.content}>
          <TootContent nodes={toot.content} />
        </div>
      ) : null}

      <Attachments attachments={toot.media_attachments} />

      <Actions toot={toot} />

      {props.reblog ? (
        <aside
          className={sprinkles({ fontSize: "small" })}
          style={{ marginBlockStart: ".5rem" }}
        >
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

function Actions({ toot }: { toot: TootP }) {
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
        className="boost"
      >
        <RocketIcon />
        {toot.reblogs_count}{" "}
        <span hidden>boosted. {toot.reblogged ? "Unboost" : "Boost"}</span>
      </button>
      <button
        name="_action"
        disabled={loading}
        value={toot.favourited ? "unfavourite" : "favourite"}
        className="like"
      >
        <StarIcon />
        {toot.favourites_count}{" "}
        <span hidden>
          favorited. {toot.favourited ? "Unfavorite" : "Favorite"}
        </span>
      </button>
      <button name="_action" disabled={loading} className="reply">
        <ChatBubbleIcon />
        {toot.replies_count}
      </button>
      <button
        name="_action"
        disabled={loading}
        value={toot.bookmarked ? "unbookmark" : "bookmark"}
        className="bookmark"
      >
        <BookmarkIcon />
        <span hidden>{toot.bookmarked ? "Unbookmark" : "Bookmark"}</span>
      </button>
    </Form>
  );
}

function Attachments(props: { attachments: Mastodon.Attachment[] }) {
  if (!props.attachments.length) {
    return null;
  }

  if (props.attachments.length === 1) {
    return (
      <Attachment className={styles.media} attachment={props.attachments[0]} />
    );
  }

  return (
    <div className={props.attachments.length > 1 ? styles.gallery : undefined}>
      {props.attachments.map((attachment) => (
        <Attachment
          className={styles.galleryItem}
          key={attachment.id}
          attachment={attachment}
        />
      ))}
    </div>
  );
}

function Attachment({
  attachment,
  className,
}: {
  attachment: Mastodon.Attachment;
  className?: string;
}) {
  if (attachment.type === "audio") {
    return <audio className={className} src={attachment.url} controls />;
  }
  if (attachment.type === "video" || attachment.type === "gifv") {
    return (
      <video
        className={className}
        src={attachment.url}
        playsInline
        muted
        width={attachment.meta.original.width}
        height={attachment.meta.original.height}
        controls={attachment.type === "video"}
        autoPlay={attachment.type === "gifv"}
        loop={attachment.type === "gifv"}
      />
    );
  }

  return (
    <img
      className={className}
      src={attachment.preview_url}
      width={attachment.meta.original.width}
      height={attachment.meta.original.height}
      alt={attachment.description || ""}
    />
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

          /* if (d.tagName === "a" && d.card) {
            return null;
          } */

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
          return <Emoji key={index} {...d} />;
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
