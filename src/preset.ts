const PRESET_BASE = {
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
} satisfies Record<`$${string}`, RegExp>;

const PRESET_GROUPS = {
  /**
   * Angular
   *
   * https://angular.io/
   */
  $ANGULAR: [
    PRESET_BASE.$CLASS,
    PRESET_BASE.$ID,
    PRESET_BASE.$ANGULAR_ELEMENT_REF,
    PRESET_BASE.$ANGULAR_STRUCTURAL_DIRECTIVE,
    PRESET_BASE.$ANGULAR_ANIMATION,
    PRESET_BASE.$ANGULAR_ANIMATION_INPUT,
    PRESET_BASE.$ANGULAR_TWO_WAY_BINDING,
    PRESET_BASE.$ANGULAR_INPUT,
    PRESET_BASE.$ANGULAR_OUTPUT,
  ],
  /**
   * Code Guide by @mdo
   *
   * https://codeguide.co/#html-attribute-order
   */
  $CODE_GUIDE: [
    PRESET_BASE.$CLASS,
    PRESET_BASE.$ID,
    PRESET_BASE.$NAME,
    PRESET_BASE.$DATA,
    PRESET_BASE.$SRC,
    PRESET_BASE.$FOR,
    PRESET_BASE.$TYPE,
    PRESET_BASE.$HREF,
    PRESET_BASE.$VALUE,
    PRESET_BASE.$TITLE,
    PRESET_BASE.$ALT,
    PRESET_BASE.$ROLE,
    PRESET_BASE.$ARIA,
  ],
  $HTML: [PRESET_BASE.$CLASS, PRESET_BASE.$ID],
  $VUE: [PRESET_BASE.$CLASS, PRESET_BASE.$ID, PRESET_BASE.$VUE_ATTRIBUTE],
} satisfies Record<`$${string}`, RegExp[]>;

export const PRESET = Object.fromEntries(
  Object.entries({ ...PRESET_BASE, ...PRESET_GROUPS }).map(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, value.map((v) => v.toString())];
    }
    return [key, value.toString()];
  }),
) as Record<string, string | string[]>;
