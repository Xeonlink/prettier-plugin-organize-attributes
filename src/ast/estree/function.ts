import { omit } from "@/utils/utils";
import { estree } from ".";
import type {
  ArrowFunctionExpression,
  Function,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  MaybeNamedFunctionDeclaration,
} from "./type";

type BroadFunction = Function | MaybeNamedFunctionDeclaration;

function _body2BlockStatement(body: BroadFunction["body"]) {
  if (body.type === "BlockStatement") {
    return body;
  } else {
    return estree.node("BlockStatement", {
      body: [
        estree.node("ReturnStatement", {
          argument: body,
        }),
      ],
    });
  }
}

function _clearTypeAnnotation(identifier: Identifier): Identifier {
  const { name, type, leadingComments, loc, range, trailingComments } = identifier;
  return { name, type, leadingComments, loc, range, trailingComments };
}

export function convertFunction(base: BroadFunction) {
  const baseType = base.type;
  const common = omit(base, "type");
  const body = _body2BlockStatement(base.body);

  const toArrowFunctionExpression = () => {
    if (baseType === "ArrowFunctionExpression") {
      return base as ArrowFunctionExpression;
    } else {
      return estree.node("ArrowFunctionExpression", { ...common, expression: false, body });
    }
  };
  const toFunctionExpression = () => {
    if (baseType === "FunctionExpression") {
      return base as FunctionExpression;
    } else {
      return estree.node("FunctionExpression", { ...common, body });
    }
  };
  const toMaybeNamedFunctionDeclaration = (_id: Identifier | null = null) => {
    if (baseType === "FunctionDeclaration") {
      return base as MaybeNamedFunctionDeclaration;
    } else {
      const id = _id === null ? _id : _clearTypeAnnotation(_id);
      // @ts-expect-error MaybeNamedFunction
      return estree.node("FunctionDeclaration", { ...common, id, body });
    }
  };
  const toFunctionDeclaration = (_id: Identifier) => {
    if (baseType === "FunctionDeclaration") {
      return base as FunctionDeclaration;
    } else {
      const id = _clearTypeAnnotation(_id);
      return estree.node("FunctionDeclaration", { ...common, id, body });
    }
  };

  return {
    toArrowFunctionExpression,
    toFunctionExpression,
    toFunctionDeclaration,
    toMaybeNamedFunctionDeclaration,
  };
}
