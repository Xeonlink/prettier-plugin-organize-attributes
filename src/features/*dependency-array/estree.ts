import { defineAstModifier, isNode, travelAst } from "@/ast";
import { estree, type Node } from "@/ast/estree";
import type { options } from "./options";
import { isTargetCallExpression, type TargetCallExpression } from "./target";

function getCalleeName(node: TargetCallExpression) {
  switch (node.callee.type) {
    case "MemberExpression":
      return node.callee.property.name;
    case "Identifier":
      return node.callee.name;
  }
}

const dependencyArrayFns = new Set(["useEffect", "useLayoutEffect", "useInsertionEffect", "useCallback", "useMemo"]);

export const withEstreeModifier = defineAstModifier<Node, typeof options.infer>((node, options) => {
  const { dependencyArray } = options;

  if (node.type === "CallExpression") {
    const target = node;
    if (isTargetCallExpression(target)) {
      const calleeName = getCalleeName(target);
      if (dependencyArrayFns.has(calleeName)) {
        if (dependencyArray !== "preserve") {
          // ensure-array
          target.arguments[1] ??= estree.node("ArrayExpression", {
            elements: [],
          });

          if (dependencyArray !== "ensure-array") {
            // ensure-dependency
            const dependenciesAlreadyExists = new Set<string>();

            for (const element of target.arguments[1].elements) {
              if (element?.type === "Identifier") {
                dependenciesAlreadyExists.add(element.name);
              }
            }

            const resolvedDependencies = new Set<string>();

            travelAst<Node>(target.arguments[0].body, isNode, (node) => {
              if (node.type === "Identifier") {
                resolvedDependencies.add(node.name);
              }
            });

            const notExistDependencies = resolvedDependencies.difference(dependenciesAlreadyExists);

            for (const dependency of notExistDependencies) {
              target.arguments[1].elements.push(estree.identifier(dependency));
            }

            if (dependencyArray !== "ensure-dependency") {
              // ensure-only-dependency
              target.arguments[1].elements = [];

              for (const dependency of resolvedDependencies) {
                target.arguments[1].elements.push(estree.identifier(dependency));
              }
            }
          }
        }
      }
    }
  }
});
