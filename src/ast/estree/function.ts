import { estree } from ".";
import type { Function, Identifier, MaybeNamedFunctionDeclaration } from "./type";

type BroadFunction = Function | MaybeNamedFunctionDeclaration;

function _pickCommon(base: BroadFunction) {
  const { body, params, async, generator, type, leadingComments, loc, range, trailingComments } = base;
  return { body, params, async, generator, type, leadingComments, loc, range, trailingComments };
}

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

export function convertFunction(base: BroadFunction) {
  const common = _pickCommon(base);
  const body = _body2BlockStatement(base.body);

  const toArrowFunctionExpression = () => {
    return estree.node("ArrowFunctionExpression", { ...common, expression: false, body });
  };
  const toFunctionExpression = () => {
    return estree.node("FunctionExpression", { ...common, body });
  };
  const toFunctionDeclaration = (id: Identifier) => {
    return estree.node("FunctionDeclaration", { ...common, id, body });
  };

  return {
    toArrowFunctionExpression,
    toFunctionExpression,
    toFunctionDeclaration,
  };
}
