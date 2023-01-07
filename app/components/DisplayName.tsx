import { Link } from "@remix-run/react";

import type { Mastodon } from "~/utils/mastodon";

export function DisplayName(
  props: Pick<Mastodon.Account, "display_name" | "emojis" | "acct"> & {
    showAcct?: boolean;
  }
) {
  const displayname = props.display_name.split(/(:\w*?:)/);

  return (
    <Link
      className="display-name"
      to={`/${props.acct}`}
      title={`@${props.acct}`}
    >
      {displayname.map((part) => {
        const emoji = part.match(/:(\w*?):/);
        if (emoji) {
          const e = props.emojis.find((e) => e.shortcode === emoji[1]);
          return (
            <img
              key={e?.shortcode}
              src={e?.url}
              alt={e?.shortcode}
              className="emoji"
            />
          );
        }
        return part;
      })}
    </Link>
  );
}
