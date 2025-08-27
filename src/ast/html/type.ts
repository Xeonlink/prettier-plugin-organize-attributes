export interface SourceFile {
  content: string;
  url: string;
}

export interface SourceCursor {
  file: SourceFile;
  offset: number;
  line: number;
  col: number;
}

export interface SourceSpan {
  start: SourceCursor;
  end: SourceCursor;
  fillStart: SourceCursor;
  details: null;
}

export interface BaseNode {
  sourceSpan?: SourceSpan;
}

export interface RootNode extends BaseNode {
  type: "root";
  parent: undefined;
  children: ElementNode[];
}

export interface ElementNode extends BaseNode {
  type: "element";
  name: string; // tag name like "div"
  attrs: AttributeNode[];
  children: ElementNode[];
  startSourceSpan?: SourceSpan;
  endSourceSpan?: SourceSpan;
  nameSpan?: SourceSpan;
  namespace?: null;
  hasExplicitNameSpace?: boolean;
  tagDefinition?: {
    closedByChildren: {};
    closedByParent: boolean;
    isVoid: boolean;
    implicitNamespacePrefix: null;
    contentType: number;
    ignoreFirstLf: boolean;
    preventNamespaceInheritance: boolean;
    canSelfClose: boolean;
  };
}

export interface AttributeNode extends BaseNode {
  type: "attribute";
  name: string;
  value: string;
  keySpan?: SourceSpan;
  valueSpan?: SourceSpan;
  valueTokens?: T16Node[];
  namespace?: null;
  hasExplicitNamespace?: boolean;
}

export interface T16Node extends BaseNode {
  type: 16;
  parts: string[];
}

export interface NodeMap {
  RootNode: RootNode;
  ElementNode: ElementNode;
  AttributeNode: AttributeNode;
  T16Node: T16Node;
}

export type Node = NodeMap[keyof NodeMap];
