import type { Prettify } from "@/utils/type";
import type { Node } from "./type";

export * from "./type";

function node<T extends string>(type: T & Node["type"], meta: Prettify<Omit<Node & { type: T }, "type">>) {
  // @ts-ignore
  meta.type = type;
  return meta as Node & { type: T };
}

export const html = {
  node,
};
