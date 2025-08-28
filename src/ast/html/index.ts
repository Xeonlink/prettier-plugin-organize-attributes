import { ParseLocation, ParseSourceFile, ParseSourceSpan } from "angular-html-parser";
import { Attribute, Element } from "./type";
import { Node } from "./ast";
import type { Prettify } from "@/utils/type";

export * from "./type";

const sourceSpan = new ParseSourceSpan(
  new ParseLocation(new ParseSourceFile("", ""), 0, 0, 0),
  new ParseLocation(new ParseSourceFile("", ""), 0, 0, 0),
  new ParseLocation(new ParseSourceFile("", ""), 0, 0, 0),
);

function attribute(name: string, value: string): Attribute {
  // @ts-ignore
  return new Node({
    type: "attribute",
    name,
    value,
    keySpan: sourceSpan,
    valueSpan: sourceSpan,
    valueTokens: [],
    nameSpan: sourceSpan,
  });
}

type ElementMeta = Prettify<
  Pick<Element, "name" | "attrs" | "children" | "isSelfClosing"> & Partial<Pick<Element, "directives">>
>;

function element(meta: ElementMeta): Element {
  // @ts-ignore
  return new Node({
    type: "element",
    name: meta.name,
    attrs: meta.attrs,
    children: meta.children,
    isSelfClosing: meta.isSelfClosing,
    startSourceSpan: sourceSpan,
    endSourceSpan: sourceSpan,
    nameSpan: sourceSpan,
    directives: meta.directives ?? [],
  });
}

export const html = {
  attribute,
  element,
};
