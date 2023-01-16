import { green, greenDark, olive, oliveDark } from "@radix-ui/colors";
import {
  createThemeContract,
  style,
  assignVars,
  createTheme,
} from "@vanilla-extract/css";

const offset = ".5rem";
export const [theme, vars] = createTheme({
  offset: {
    inlineStart: `max(${offset}, env(safe-area-inset-left))`,
    inlineEnd: `max(${offset}, env(safe-area-inset-right))`,
  },
});

export const colors = createThemeContract({
  accent: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  11: null,
  12: null,
});

export const colorTheme = style({
  vars: assignVars(colors, {
    accent: green.green11,
    1: olive.olive1,
    2: olive.olive2,
    3: olive.olive3,
    4: olive.olive4,
    5: olive.olive5,
    6: olive.olive6,
    7: olive.olive7,
    8: olive.olive8,
    9: olive.olive9,
    10: olive.olive10,
    11: olive.olive11,
    12: olive.olive12,
  }),
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(colors, {
        accent: greenDark.green11,
        1: oliveDark.olive1,
        2: oliveDark.olive2,
        3: oliveDark.olive3,
        4: oliveDark.olive4,
        5: oliveDark.olive5,
        6: oliveDark.olive6,
        7: oliveDark.olive7,
        8: oliveDark.olive8,
        9: oliveDark.olive9,
        10: oliveDark.olive10,
        11: oliveDark.olive11,
        12: oliveDark.olive12,
      }),
    },
  },
});
