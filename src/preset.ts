const BASE_PRESET = {
  // HTML
  $CLASS: /^(class|className)$/,
  $ID: /^id$/,
  $NAME: /^name$/,
  $DATA: /^data-/,
  $SRC: /^src$/,
  $FOR: /^(for|htmlFor)$/,
  $TYPE: /^type$/,
  $HREF: /^href$/,
  $VALUE: /^value$/,
  $TITLE: /^title$/,
  $ALT: /^alt$/,
  $ROLE: /^role$/,
  $ARIA: /^aria-/,

  // Angular
  $ANGULAR_STRUCTURAL_DIRECTIVE: /^\*/,
  $ANGULAR_TWO_WAY_BINDING: /^\[\(/,
  $ANGULAR_ANIMATION: /^\@/,
  $ANGULAR_ANIMATION_INPUT: /^\[@/,
  $ANGULAR_INPUT: /^\[[^(@]/,
  $ANGULAR_OUTPUT: /^\(/,
  $ANGULAR_ELEMENT_REF: /^#/,

  // Vue
  $VUE_ATTRIBUTE: /^v-/,

  // Svelte
  $SVELTE_THIS: /^this/,
  $SVELTE_SLOT: /^slot/,
  $SVELTE_STYLE_PROPS: /^--/,

  // Svelte Directive
  $SVELTE_DIRECTIVE: /^(animate|bind|class|let|on|style|transition|in|out|use):/,
  $SVELTE_DIRECTIVE_ANIMATE: /^animate:/,
  $SVELTE_DIRECTIVE_BIND: /^bind:/,
  $SVELTE_DIRECTIVE_BIND_THIS: /^bind:this/,
  $SVELTE_DIRECTIVE_CLASS: /^class:/,
  $SVELTE_DIRECTIVE_LET: /^let:/,
  $SVELTE_DIRECTIVE_ON: /^on:/,
  $SVELTE_DIRECTIVE_STYLE: /^style:/,
  $SVELTE_DIRECTIVE_TRANSITION: /^transition:/,
  $SVELTE_DIRECTIVE_IN: /^in:/,
  $SVELTE_DIRECTIVE_OUT: /^out:/,
  $SVELTE_DIRECTIVE_USE: /^use:/,
} satisfies Record<`$${string}`, RegExp>;

const PRESET_GROUPS = {
  /**
   * Angular
   *
   * https://angular.io/
   */
  $ANGULAR: [
    BASE_PRESET.$CLASS,
    BASE_PRESET.$ID,
    BASE_PRESET.$ANGULAR_ELEMENT_REF,
    BASE_PRESET.$ANGULAR_STRUCTURAL_DIRECTIVE,
    BASE_PRESET.$ANGULAR_ANIMATION,
    BASE_PRESET.$ANGULAR_ANIMATION_INPUT,
    BASE_PRESET.$ANGULAR_TWO_WAY_BINDING,
    BASE_PRESET.$ANGULAR_INPUT,
    BASE_PRESET.$ANGULAR_OUTPUT,
  ],
  /**
   * Code Guide by @mdo
   *
   * https://codeguide.co/#html-attribute-order
   */
  $CODE_GUIDE: [
    BASE_PRESET.$CLASS,
    BASE_PRESET.$ID,
    BASE_PRESET.$NAME,
    BASE_PRESET.$DATA,
    BASE_PRESET.$SRC,
    BASE_PRESET.$FOR,
    BASE_PRESET.$TYPE,
    BASE_PRESET.$HREF,
    BASE_PRESET.$VALUE,
    BASE_PRESET.$TITLE,
    BASE_PRESET.$ALT,
    BASE_PRESET.$ROLE,
    BASE_PRESET.$ARIA,
  ],
  $HTML: [
    //
    BASE_PRESET.$CLASS,
    BASE_PRESET.$ID,
  ],
  $VUE: [
    //
    BASE_PRESET.$CLASS,
    BASE_PRESET.$ID,
    BASE_PRESET.$VUE_ATTRIBUTE,
  ],
  /**
   * eslint-plugin-svelte
   *
   * @link https://sveltejs.github.io/eslint-plugin-svelte/rules/sort-attributes/
   */
  $SVELTE: [
    BASE_PRESET.$SVELTE_THIS,
    BASE_PRESET.$SVELTE_DIRECTIVE_BIND_THIS,
    BASE_PRESET.$ID,
    BASE_PRESET.$NAME,
    BASE_PRESET.$SVELTE_SLOT,
    BASE_PRESET.$SVELTE_STYLE_PROPS,
    /^style:?/,
    /^class[^:]?/,
    BASE_PRESET.$SVELTE_DIRECTIVE_CLASS,
    /^(bind:|on:)/,
    BASE_PRESET.$SVELTE_DIRECTIVE_USE,
    BASE_PRESET.$SVELTE_DIRECTIVE_TRANSITION,
    BASE_PRESET.$SVELTE_DIRECTIVE_IN,
    BASE_PRESET.$SVELTE_DIRECTIVE_OUT,
    BASE_PRESET.$SVELTE_DIRECTIVE_ANIMATE,
    BASE_PRESET.$SVELTE_DIRECTIVE_LET,
  ],
} satisfies Record<`$${string}`, RegExp[]>;

const MERGED_PRESET = {
  ...BASE_PRESET,
  ...PRESET_GROUPS,
};

const RAW_PRESET = Object.fromEntries(
  Object.entries(MERGED_PRESET).map(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, value.map((v) => v.toString().slice(1, -1))];
    }
    return [key, value.toString().slice(1, -1)];
  }),
) as Record<string, string | string[]>;

const RAW_PRESET_KEYS = Object.fromEntries(
  Object.keys(MERGED_PRESET).map((key) => {
    return [key, key];
  }),
) as { [key in keyof typeof MERGED_PRESET]: key };

export const PRESET = {
  raw: RAW_PRESET,
  keys: RAW_PRESET_KEYS,
};
