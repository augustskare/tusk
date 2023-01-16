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

export const gallery = style({
  display: "grid",
  gridTemplateColumns: "auto auto",
  gridTemplateRows: "150px 150px",
  gap: ".125rem",
  borderRadius: ".25rem",
  overflow: "hidden",
  marginBlock: ".5rem",
});

export const galleryItem = style({
  objectFit: "cover",
  width: "100%",
  height: "100%",
  selectors: {
    [`${gallery}:has(&:last-of-type:nth-of-type(odd)) &:first-of-type`]: {
      gridRow: "1 / -1",
    },
  },
});

export const media = style({
  maxWidth: "80%",
  height: "auto",
  marginBlock: ".5rem",
});
