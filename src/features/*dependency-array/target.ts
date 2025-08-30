import type {
  ArrayExpression,
  ArrowFunctionExpression,
  FunctionExpression,
  Identifier,
  MemberExpression,
  Node,
  SimpleCallExpression,
} from "@/ast/estree";

type BuiltInDependencyArrayFn = "useEffect" | "useLayoutEffect" | "useInsertionEffect" | "useCallback" | "useMemo";

export type TargetCallExpression = Omit<SimpleCallExpression, "callee" | "arguments"> & {
  callee:
    | (Omit<MemberExpression, "property"> & {
        property: Identifier;
      })
    | Identifier;
  arguments:
    | [FunctionExpression | ArrowFunctionExpression, ArrayExpression]
    | [ArrowFunctionExpression, ArrayExpression];
};

export function isTargetCallExpression(node: Node): node is TargetCallExpression {
  if (node.type !== "CallExpression") return false;

  switch (node.callee.type) {
    case "MemberExpression":
      if (node.callee.property.type !== "Identifier") return false;
      break;
    case "Identifier":
      break;
    default:
      return false;
  }

  if (node.arguments.length > 2) return false;
  if (node.arguments[0].type !== "FunctionExpression" && node.arguments[0].type !== "ArrowFunctionExpression")
    return false;
  if (node.arguments.length === 2 && node.arguments[1].type !== "ArrayExpression") return false;

  return true;
}
