import { Link } from "@remix-run/react";
import { ReactNode } from "react";

import type { Mastodon } from "~/utils/mastodon";
import { Emoji } from "../Emoji";

import * as styles from "./styles.css";

export function DisplayName(
  props: Pick<Mastodon.Account, "display_name" | "emojis" | "acct"> & {
    showAcct?: boolean;
  }
) {
  return (
    <Link
      className={styles.root}
      to={`/${props.acct}`}
      title={`@${props.acct}`}
    >
      <PortalbleText
        nodes={ast(props.display_name, props.emojis)}
        components={{
          emoji: (props) => <Emoji {...props} />,
          text: ({ value }) => value,
        }}
      />
    </Link>
  );
}

type Emoji1 = {
  type: "emoji";
} & Mastodon.Emoji;

interface Text {
  type: "text";
  value: string;
}

type E = Emoji1 | Text;

function ast(text: string, emojis: Mastodon.Emoji[]): E[] {
  return text.split(/(:\w*?:)/).map((part) => {
    const [value, shortcode] = part.match(/:(\w*?):/) || [part];
    const emoji = emojis.find((e) => e.shortcode === shortcode);
    if (shortcode && emoji) {
      return {
        type: "emoji",
        ...emoji,
      };
    }
    return {
      type: "text",
      value,
    };
  });
}

interface Components {
  emoji: (props: Omit<Emoji1, "type">) => ReactNode;
  text: (props: Omit<Text, "type">) => ReactNode;
}

function PortalbleText(props: { nodes: E[]; components: Components }) {
  return (
    <>
      {props.nodes.map(({ type, ...node }, index) => {
        const Component = props.components[type];
        return <Component key={index} {...node} />;
      })}
    </>
  );
}
