import insertJsxKey from "./insert-jsx-key";
import insertAttribute from "./insert-attribute";
import sortAttribute from "./sort-attribute";
import sortProperty from "./sort-property";
import styleAttribute from "./style-attribute";
import toplevelFunction from "./toplevel-function";
import declaratorCount from "./declarator-count";
import declarationKind from "./declaration-kind";

export const features = [
  // insert
  insertJsxKey,
  insertAttribute,
  declaratorCount,
  // update
  sortAttribute,
  sortProperty,
  styleAttribute,
  declarationKind,
  toplevelFunction,
];
