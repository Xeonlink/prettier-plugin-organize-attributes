const BASE_PRESET = {
  $NULL: /^\/^\&\%\$null\$\%\&^\/$/,
  $UNDEFINED: /^\/^\&\%\$undefined\$\%\&^\/$/,
  $EXPRESSION: /^\/^\&\%\$Expression\$\%\&^\/$/,
} satisfies Record<`$${string}`, RegExp>;

const PRESET_GROUPS = {} satisfies Record<`$${string}`, RegExp[]>;

export const PRESET = Object.fromEntries(
  Object.entries({ ...BASE_PRESET, ...PRESET_GROUPS }).map(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, value.map((v) => v.toString())];
    }
    return [key, value.toString()];
  }),
) as Record<string, string | string[]>;
