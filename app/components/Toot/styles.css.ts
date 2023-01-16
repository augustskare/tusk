import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { colors } from "~/styles/theme.css";

const tootBase = style({
  maxWidth: "40rem",
  borderBlockEnd: `1px solid ${colors[6]}`,
  paddingBlock: ".75rem",
  paddingInline: ".5rem",
  overflowWrap: "break-word",
  wordWrap: "break-word",
  wordBreak: ["break-all", "break-word"],
  hyphens: "auto",
});

export const toot = styleVariants({
  default: [tootBase],
  highlighted: [
    tootBase,
    {
      backgroundColor: colors[5],
    },
  ],
});

export const header = style({
  marginBlockEnd: ".5rem",
  display: "flex",
  gap: ".5rem",
  alignItems: "flex-end",
});

export const content = style({});
globalStyle(`${content} > *:not(:last-child)`, {
  marginBlockEnd: "1em",
});

globalStyle(`${content} a`, {
  textDecoration: "underline",
});

export const media = style({
  maxWidth: "80%",
  height: "auto",
});
