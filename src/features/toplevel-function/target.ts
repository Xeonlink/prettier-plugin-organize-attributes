import type {
  ArrowFunctionExpression,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  MaybeNamedFunctionDeclaration,
  Program,
  VariableDeclaration,
  VariableDeclarator,
} from "@/ast/estree";
import type { Prettify } from "@/utils/type";

type Target0 = Prettify<
  Omit<ExportDefaultDeclaration, "declaration"> & {
    declaration: ArrowFunctionExpression;
  }
>;

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example export default () => {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isTarget0(node: Program["body"][number]): node is Target0 {
  if (node.type !== "ExportDefaultDeclaration") return false;
  if (node.declaration.type !== "ArrowFunctionExpression") return false;
  return true;
}

type Target1 = Prettify<
  Omit<ExportDefaultDeclaration, "declaration"> & {
    declaration: MaybeNamedFunctionDeclaration | FunctionExpression;
  }
>;

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example export default function Named() {}
 * @example export default function () {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isTarget1(node: Program["body"][number]): node is Target1 {
  if (node.type !== "ExportDefaultDeclaration") return false;
  if (node.declaration.type !== "FunctionExpression" && node.declaration.type !== "FunctionDeclaration") return false;

  return true;
}

type Target2 = Omit<ExportNamedDeclaration, "declaration"> & {
  declaration: FunctionDeclaration;
};

/**
 * 주어진 노드가 형태에 맞는지 검사합니다.
 *
 * @example export function Named() {}
 * @param node 검사할 노드
 * @returns 형태에 맞으면 true, 아니면 false
 */
export function isTarget2(node: Program["body"][number]): node is Target2 {
  if (node.type !== "ExportNamedDeclaration") return false;
  if (node.declaration?.type !== "FunctionDeclaration") return false;
  return true;
}

type Target4 = Omit<ExportNamedDeclaration, "declaration"> & {
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
export function isTarget4(node: Program["body"][number]): node is Target4 {
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

type Target5 = Omit<VariableDeclaration, "declarations"> & {
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
export function isTarget5(node: Program["body"][number]): node is Target5 {
  if (node.type !== "VariableDeclaration") return false;
  if (node.declarations[0]?.id.type !== "Identifier") return false;
  const initExpression = node.declarations[0]?.init;
  if (initExpression?.type !== "FunctionExpression" && initExpression?.type !== "ArrowFunctionExpression") return false;

  return true;
}
