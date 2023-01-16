import type { Mastodon } from "~/utils/mastodon";

import { fromHtml as hastFromHtml } from "hast-util-from-html";
import type { RootContent, ElementContent } from "hast";

export function formatToots(toot: Mastodon.Toot | Mastodon.Toot[]) {
  if (Array.isArray(toot)) {
    return toot.map((t) => {
      return {
        ...t,
        reblog: t.reblog
          ? {
              ...t.reblog,
              content: tootToAst(t.reblog.content, {
                emojis: t.reblog.emojis,
                card: t.reblog.card,
              }),
            }
          : null,
        content: t.content
          ? tootToAst(t.content, { emojis: t.emojis, card: t.card })
          : null,
      };
    });
  }

  return {
    ...toot,
    reblog: toot.reblog
      ? {
          ...toot.reblog,
          content: tootToAst(toot.reblog.content, {
            emojis: toot.reblog.emojis,
            card: toot.reblog.card,
          }),
        }
      : null,
    content: toot.content
      ? tootToAst(toot.content, { emojis: toot.emojis, card: toot.card })
      : null,
  };
}

export function tootToAst(
  content: string,
  options: {
    emojis: Mastodon.Toot["emojis"];
    card: Mastodon.Toot["card"];
  }
) {
  const cardUrl = options.card?.url ? new URL(options.card?.url) : undefined;

  const t = fromHtml(
    hastFromHtml(content, { fragment: true }).children
  ) as Elements[];

  return t;

  function fromHtml(nodes: RootContent[] | ElementContent[]) {
    return nodes.map((node) => {
      if (node.type === "element") {
        if (node.tagName === "a") {
          const className = (node?.properties?.className || []) as string[];
          const href = node.properties!.href as string;
          const type = className.includes("hashtag")
            ? "hashtag"
            : className.includes("u-url")
            ? "mention"
            : undefined;

          if (type !== undefined) {
            let _value = fromHtml(node.children);
            let value = _value[1] || _value[0];
            let n = {
              type,
              value: value[0].value,
            };

            if (n.type === "mention" && href) {
              n.instance = new URL(href).host;
            }

            return n;
          }

          return {
            type: "element",
            tagName: "a",
            card: new URL(href).href === cardUrl?.href,
            href,
            children: [{ type: "text", value: href }],
          };
        }

        if (node.tagName === "span") {
          return fromHtml(node.children)[0];
        }
        return {
          type: "element",
          tagName: node.tagName,
          children: fromHtml(node.children).flat(),
        };
      }

      if (node.type === "text") {
        const value = node.value;
        const parts = value.split(/(:\w*?:)/);

        let t = [];
        for (const p in parts) {
          const part = parts[p];
          const emoji = part.match(/:(\w*?):/);
          if (emoji) {
            const [, shortcode] = emoji;
            t.push({
              type: "emoji",
              shortcode,
              ...options.emojis.find((e) => e.shortcode === shortcode),
            });
          } else {
            t.push({ type: "text", value: part });
          }
        }

        return t;
      }

      return node;
    });
  }
}

type Emoji = {
  type: "emoji";
} & Mastodon.Emoji;

interface Mention {
  type: "mention";
  value: string;
  instance: string;
}

interface Hashtag {
  type: "hashtag";
  value: string;
}

interface Text {
  type: "text";
  value: string;
}

type TextElement = Text | Emoji | Mention | Hashtag;

interface BaseElement {
  type: "element";
  tagName: string;
  children: Elements[];
}

interface Element extends BaseElement {
  card?: never;
  href?: never;
}

interface AnchorElement extends Omit<BaseElement, "tagName"> {
  tagName: "a";
  card: boolean;
  href: string;
}

export type Elements = TextElement | Element | AnchorElement;

export interface Toot extends Omit<Mastodon.Toot, "content" | "reblog"> {
  content: Element[] | null;
  reblog: Toot;
}

/* interface Toot {
  id: string;
  created_at: string;
  in_reply_to_id: null;
  in_reply_to_account_id: null;
  sensitive: boolean;
  spoiler_text: string;
  visibility: "public" | string;
  language: string | null;
  uri: string;
  url: string | null;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  edited_at: string | null;
  favourited: boolean;
  reblogged: boolean;
  muted: boolean;
  bookmarked: boolean;
  content: string;
  filtered: [];
  reblog: Toot | null;
  account: Account;
  media_attachments: Attachment[];
  mentions: [];
  tags: {
    name: string;
    url: string;
  }[];
  emojis: Emoji[];
  card: {
    url: string;
    title: string;
    description: string;
    type: string;
    author_name: string;
    author_url: string;
    provider_name: string;
    provider_url: string;
    html: string;
    width: number;
    height: number;
    image: string | null;
    embed_url: string;
    blurhash: string | null;
  } | null;
  poll: {
    id: string;
    expires_at: string;
    expired: boolean;
    multiple: boolean;
    votes_count: number;
    voters_count: number;
    voted: boolean;
    own_votes: [];
    options: { title: string; vote_count: number }[];
    emojis: Emoji[];
  } | null;
} */
