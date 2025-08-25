import type { Parser } from "prettier";
import angularParsers from "prettier/parser-angular";
import babelParsers from "prettier/parser-babel";
import estreeParsers from "prettier/parser-espree";
import flowParsers from "prettier/parser-flow";
import glimmerParsers from "prettier/parser-glimmer";
import graphqlParsers from "prettier/parser-graphql";
import htmlParsers from "prettier/parser-html";
import markdownParsers from "prettier/parser-markdown";
import meriyahParsers from "prettier/parser-meriyah";
import postcssParsers from "prettier/parser-postcss";
import tsParsers from "prettier/parser-typescript";
import yamlParsers from "prettier/parser-yaml";

export const builtInParsers = {
  ...angularParsers.parsers,
  ...babelParsers.parsers,
  ...estreeParsers.parsers,
  ...flowParsers.parsers,
  ...glimmerParsers.parsers,
  ...graphqlParsers.parsers,
  ...htmlParsers.parsers,
  ...markdownParsers.parsers,
  ...meriyahParsers.parsers,
  ...postcssParsers.parsers,
  ...tsParsers.parsers,
  ...yamlParsers.parsers,
} satisfies Record<string, Parser>;
