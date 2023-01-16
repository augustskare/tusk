import { defineProperties, createSprinkles } from "@vanilla-extract/sprinkles";

const properties = defineProperties({
  properties: {
    fontSize: {
      small: ".875em",
    },
    borderRadius: {
      small: ".25rem",
    },
  },
});

export const sprinkles = createSprinkles(properties);
export type Sprinkles = Parameters<typeof sprinkles>[0];
