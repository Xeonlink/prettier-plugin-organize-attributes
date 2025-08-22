import type { JSXAttribute, JSXOpeningElement, Node } from "estree-jsx";
import type { Parser } from "prettier";
import rawBabelParsers from "prettier/parser-babel";
import rawTsParsers from "prettier/parser-typescript";

const babelParsers = rawBabelParsers.parsers;
const tsParsers = rawTsParsers.parsers;

function getAttributeKey(attribute: JSXAttribute) {
  if (attribute.name.type === "JSXIdentifier") {
    return attribute.name.name;
  }
  if (attribute.name.type === "JSXNamespacedName") {
    return attribute.name.name.name;
  }
  return "";
}

function sortAttributes(jsxOpeningElement: JSXOpeningElement) {
  const attributes = jsxOpeningElement.attributes;

  let currentGroup: JSXAttribute[] = [];
  let startIndex = 0;

  for (let i = 0; i <= attributes.length; i++) {
    const attribute = attributes[i];

    if (i === attributes.length || attribute.type === "JSXSpreadAttribute") {
      currentGroup.sort((a, b) => {
        const aKey = getAttributeKey(a);
        const bKey = getAttributeKey(b);

        if (aKey < bKey) return -1;
        if (aKey > bKey) return 1;
        return 0;
      });

      attributes.splice(startIndex, currentGroup.length, ...currentGroup);
      startIndex = i + 1;
      currentGroup = [];
    } else {
      currentGroup.push(attribute);
    }
  }
}

function isNode(value: unknown): value is Node {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  if (!("type" in value)) return false;
  return true;
}

function travel(node: Node, callback: (node: Node) => void) {
  callback(node);

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNode(item)) {
          travel(item, callback);
        }
      }
      continue;
    }
    if (isNode(value)) {
      travel(value, callback);
      continue;
    }
  }
}

function withParser(parser: Parser): Parser {
  return {
    ...parser,
    parse: (text, options) => {
      const ast = parser.parse(text, options);

      travel(ast, (node) => {
        if (node.type === "JSXOpeningElement") {
          sortAttributes(node);
        }
      });

      return ast;
    },
  };
}

export const parsers: Record<string, Parser> = {
  ...babelParsers,
  ["babel"]: withParser(babelParsers["babel"]),
  ["babel-ts"]: withParser(babelParsers["babel-ts"]),
  ["typescript"]: withParser(tsParsers["typescript"]),
};
