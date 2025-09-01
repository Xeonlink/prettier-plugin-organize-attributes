import { describe, expect, it } from "vitest";
import { miniOrganize, DEFAULT_GROUP } from "../src/organize";

describe("miniorganize", () => {
  it("should miniorganize", () => {
    const input = ["c", "a1", "b1", "a2", "b2"];
    const expected = ["a1", "a2", "b1", "b2", "c"];

    const result = miniOrganize(input, {
      groups: ["^a", "^b"],
      sort: "NONE",
      ignoreCase: true,
      getKey: (attr) => attr,
    });

    expect(result).toStrictEqual(expected);
  });

  it("should manually place not matches", () => {
    const input = ["a", "b", "c", "other"];
    const expected = ["other", "a", "b", "c"];

    const result = miniOrganize(input, {
      groups: [DEFAULT_GROUP, "^a", "^b", "^c"],
      sort: "NONE",
      ignoreCase: true,
      getKey: (attr) => attr,
    });

    expect(result).toStrictEqual(expected);
  });

  it("should organize objects", () => {
    const input = [{ name: "c" }, { name: "a1" }, { name: "b1" }, { name: "a2" }, { name: "b2" }];
    const expected = [{ name: "a1" }, { name: "a2" }, { name: "b1" }, { name: "b2" }, { name: "c" }];

    const result = miniOrganize(input, {
      groups: ["^a", "^b"],
      sort: "NONE",
      ignoreCase: true,
      getKey: (attr) => attr.name,
    });

    expect(result).toEqual(expected);
  });

  it("should sort groups ASC internally", () => {
    const input = ["ab", "aa", "ac", "bc", "bb", "ba"];
    const expected = ["aa", "ab", "ac", "ba", "bb", "bc"];

    const result = miniOrganize(input, {
      groups: ["^a", "^b"],
      sort: "ASC",
      ignoreCase: true,
      getKey: (attr) => attr,
    });

    expect(result).toEqual(expected);
  });

  it("should sort groups DESC internally", () => {
    const input = ["ab", "aa", "ac", "bc", "bb", "ba"];
    const expected = ["ac", "ab", "aa", "bc", "bb", "ba"];

    const result = miniOrganize(input, {
      groups: ["^a", "^b"],
      sort: "DESC",
      ignoreCase: true,
      getKey: (attr) => attr,
    });

    expect(result).toEqual(expected);
  });

  it("should NOT sort groups internally", () => {
    const input = ["ab", "aa", "ac", "bc", "bb", "ba"];
    const expected = ["ab", "aa", "ac", "bc", "bb", "ba"];

    const result = miniOrganize(input, {
      groups: ["^a", "^b"],
      sort: "NONE",
      ignoreCase: true,
      getKey: (attr) => attr,
    });

    expect(result).toEqual(expected);
  });

  it("should ignore casing when ignoreCase is true", () => {
    const input = ["attr1", "ATTR1", "attr2", "ATTR2"];
    const expected = ["attr1", "ATTR1", "attr2", "ATTR2"];

    const result = miniOrganize(input, {
      groups: ["^attr", "^ATTR"],
      sort: "NONE",
      ignoreCase: true,
      getKey: (attr) => attr,
    });

    expect(result).toEqual(expected);
  });

  it("should NOT ignore casing when ignoreCase is false", () => {
    const input = ["attr1", "ATTR1", "attr2", "ATTR2"];
    const expected = ["attr1", "attr2", "ATTR1", "ATTR2"];

    const result = miniOrganize(input, {
      groups: ["^attr", "^ATTR"],
      sort: "NONE",
      ignoreCase: false,
      getKey: (attr) => attr,
    });

    expect(result).toEqual(expected);
  });
});
