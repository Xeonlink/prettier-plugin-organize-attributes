import type {
  ArrowFunctionExpression,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  Function,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  MaybeNamedFunctionDeclaration,
  Program,
  VariableDeclaration,
  VariableDeclarator,
} from "@/ast/estree";
import type { Prettify } from "@/utils/type";

type ExportDefaultFunctionShape = Prettify<
  Omit<ExportDefaultDeclaration, "declaration"> & {
    declaration: Function | MaybeNamedFunctionDeclaration;
  }
>;

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example export default function () {}
 * @example export default function Named2() {}
 * @example export default () => {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isExportDefaultFunctionShape(node: Program["body"][number]): node is ExportDefaultFunctionShape {
  if (node.type !== "ExportDefaultDeclaration") return false;

  switch (node.declaration.type) {
    case "ArrowFunctionExpression":
    case "FunctionExpression":
    case "FunctionDeclaration":
      break;
    default:
      return false;
  }

  return true;
}

type ExportExpressionFnShape = Omit<ExportNamedDeclaration, "declaration"> & {
  declaration: FunctionDeclaration;
};

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example export function Named() {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isExportExpressionFnShape(node: Program["body"][number]): node is ExportExpressionFnShape {
  if (node.type !== "ExportNamedDeclaration") return false;
  if (node.declaration?.type !== "FunctionDeclaration") return false;
  return true;
}

type ExportVarFnShape = Omit<ExportNamedDeclaration, "declaration"> & {
  declaration: Omit<VariableDeclaration, "declarations"> & {
    declarations: [
      Omit<VariableDeclarator, "id" | "init"> & {
        id: Identifier;
        init: FunctionExpression | ArrowFunctionExpression;
      },
    ];
  };
};

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example export const Named = function () {}
 * @example export const Named = function Named2() {}
 * @example export const Named = () => {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isExportVarFnShape(node: Program["body"][number]): node is ExportVarFnShape {
  if (node.type !== "ExportNamedDeclaration") return false;
  if (node.declaration?.type !== "VariableDeclaration") return false;
  if (node.declaration.declarations[0]?.id.type !== "Identifier") return false;
  const initExpression = node.declaration.declarations[0]?.init;
  if (initExpression?.type !== "FunctionExpression" && initExpression?.type !== "ArrowFunctionExpression") return false;

  return true;
}

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example function Named() {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isFunctionDeclaration(node: Program["body"][number]): node is FunctionDeclaration {
  if (node.type !== "FunctionDeclaration") return false;
  return true;
}

type VarFnShape = Omit<VariableDeclaration, "declarations"> & {
  declarations: [
    Omit<VariableDeclarator, "id" | "init"> & {
      id: Identifier;
      init: FunctionExpression | ArrowFunctionExpression;
    },
  ];
};

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example const Named = function () {}
 * @example const Named = function Named2() {}
 * @example const Named = () => {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isVarFnShape(node: Program["body"][number]): node is VarFnShape {
  if (node.type !== "VariableDeclaration") return false;
  if (node.declarations[0]?.id.type !== "Identifier") return false;

  switch (node.declarations[0]?.init?.type) {
    case "FunctionExpression":
    case "ArrowFunctionExpression":
      break;
    default:
      return false;
  }

  return true;
}
