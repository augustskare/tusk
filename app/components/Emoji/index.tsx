import type { Mastodon } from "~/utils/mastodon";
import * as styles from "./styles.css";

function Emoji(props: Mastodon.Emoji) {
  return <img src={props.url} alt={props.shortcode} className={styles.emoji} />;
}

export { Emoji };
