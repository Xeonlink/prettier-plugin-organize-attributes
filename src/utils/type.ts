export type LowerAlphabet =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

export type UpperAlphabet = Uppercase<LowerAlphabet>;

export type Alphabet = LowerAlphabet | UpperAlphabet;

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type UpperFirst<T extends string> = T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T;

export type LowerFirst<T extends string> = T extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : T;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ValueOf<T> = T[keyof T];

export type TODO = any;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type LiteralUnion<T extends U, U = string> = T | (Pick<U, never> & { _?: never | undefined });
