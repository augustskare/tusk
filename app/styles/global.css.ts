import { fontFace, globalStyle, style } from "@vanilla-extract/css";
import { colors, colorTheme, theme, vars } from "./theme.css";

const monaSans = fontFace({
  src: 'url("./mona-sans.woff2") format("woff2 supports variations"), url("./mona-sans.woff2") format("woff2-variations")',
  fontWeight: "200 900",
  fontStretch: "75% 125%",
  fontDisplay: "swap",
});

globalStyle("*, :before, :after", {
  boxSizing: "border-box",
});

globalStyle("html", {
  WebkitTextSizeAdjust: "100%",
});

export const body = style([
  theme,
  colorTheme,
  {
    fontFamily: `${monaSans}, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
    backgroundColor: colors[1],
    color: colors[12],
    margin: 0,
  },
]);

globalStyle("ul, ol", {
  margin: 0,
  padding: 0,
  listStyle: "none",
});

globalStyle("img", {
  maxWidth: "100%",
  height: "auto",
});

globalStyle("p", { margin: 0 });

globalStyle("a", {
  color: colors.accent,
  textDecoration: "none",
});

export const header = style({
  paddingBlock: ".5rem",
  paddingInline: `${vars.offset.inlineStart} ${vars.offset.inlineEnd}`,
  borderBlockEnd: `1px solid ${colors[6]}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const logo = style({
  fontSize: "1.25rem",
  lineHeight: 1,
  fontWeight: 620,
  fontVariationSettings: '"ital" 0',
  fontStretch: "125%",
  margin: 0,
});
