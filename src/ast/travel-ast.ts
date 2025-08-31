function isNode<T>(unknown: unknown): unknown is T {
  if (typeof unknown !== "object") return false;
  if (unknown === null) return false;
  if (!("type" in unknown)) return false;
  if (typeof unknown.type !== "string") return false;
  return true;
}

export function travelAst<N extends object>(node: N, visitor: (node: N) => void) {
  visitor(node);

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (isNode<N>(item)) {
          travelAst(item, visitor);
        }
      }
      continue;
    }
    if (isNode<N>(value)) {
      travelAst(value, visitor);
      continue;
    }
  }
}
