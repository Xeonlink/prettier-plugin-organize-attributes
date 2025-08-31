import { describe, expect, it } from "vitest";
import { createEmptyGroupDefs, DFEAULT_PRESET, grouping, type GroupDef } from "./organize";
import { PRESET } from "./preset";

describe(`createEmptyGroupDefs`, () => {
  it(`should create group defs`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$CLASS, PRESET.keys.$ID],
      attributeIgnoreCase: false,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [] },
      { type: "regex", regex: /^id$/, values: [] },
      { type: "default", values: [] },
    ]);
  });

  it(`should create with ${DFEAULT_PRESET}`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$CLASS, DFEAULT_PRESET, PRESET.keys.$ID],
      attributeIgnoreCase: false,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [] },
      { type: "default", values: [] },
      { type: "regex", regex: /^id$/, values: [] },
    ]);
  });

  it(`should create html default`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$HTML],
      attributeIgnoreCase: false,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [] },
      { type: "regex", regex: /^id$/, values: [] },
      { type: "default", values: [] },
    ]);
  });

  it(`should create vue default`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$VUE],
      attributeIgnoreCase: false,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [] },
      { type: "regex", regex: /^id$/, values: [] },
      { type: "regex", regex: /^v-/, values: [] },
      { type: "default", values: [] },
    ]);
  });

  it(`should create angular default`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$ANGULAR],
      attributeIgnoreCase: false,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [] },
      { type: "regex", regex: /^id$/, values: [] },
      { type: "regex", regex: /^#/, values: [] },
      { type: "regex", regex: /^\*/, values: [] },
      { type: "regex", regex: /^\@/, values: [] },
      { type: "regex", regex: /^\[@/, values: [] },
      { type: "regex", regex: /^\[\(/, values: [] },
      { type: "regex", regex: /^\[[^(@]/, values: [] },
      { type: "regex", regex: /^\(/, values: [] },
      { type: "default", values: [] },
    ]);
  });

  it(`should create code guide default`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$CODE_GUIDE],
      attributeIgnoreCase: false,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [] },
      { type: "regex", regex: /^id$/, values: [] },

      { type: "regex", regex: /^name$/, values: [] },
      { type: "regex", regex: /^data-/, values: [] },
      { type: "regex", regex: /^src$/, values: [] },
      { type: "regex", regex: /^(for|htmlFor)$/, values: [] },
      { type: "regex", regex: /^type$/, values: [] },
      { type: "regex", regex: /^href$/, values: [] },
      { type: "regex", regex: /^value$/, values: [] },

      { type: "regex", regex: /^title$/, values: [] },
      { type: "regex", regex: /^alt$/, values: [] },
      { type: "regex", regex: /^role$/, values: [] },
      { type: "regex", regex: /^aria-/, values: [] },
      { type: "default", values: [] },
    ]);
  });

  it(`should create ignore case regexp`, () => {
    const output = createEmptyGroupDefs({
      attributeGroups: [PRESET.keys.$CLASS, PRESET.keys.$ID],
      attributeIgnoreCase: true,
    });

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/i, values: [] },
      { type: "regex", regex: /^id$/i, values: [] },
      { type: "default", values: [] },
    ]);
  });
});

describe(`grouping`, () => {
  it(`should group attributes`, () => {
    const output = grouping(
      [
        { type: "regex", regex: /^(class|className)$/, values: [] },
        { type: "regex", regex: /^id$/, values: [] },
        { type: "default", values: [] },
      ],
      [
        { type: "attribute", name: "class" },
        { type: "attribute", name: "id" },
      ],
      (attr) => attr.name,
    );

    expect(output).toEqual([
      { type: "regex", regex: /^(class|className)$/, values: [{ type: "attribute", name: "class" }] },
      { type: "regex", regex: /^id$/, values: [{ type: "attribute", name: "id" }] },
      { type: "default", values: [] },
    ]);
  });
});
