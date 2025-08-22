import * as prettier from "prettier";
import { expect, test } from "vitest";
import { Path } from "./path";

const testcasesPath = new Path(__dirname, "testcases");

for (const caseDirPath of testcasesPath.dirs) {
  test(`${caseDirPath.basename}`, async () => {
    const files = caseDirPath.files;
    const inputFilePath = files.find((file) => file.basename.startsWith("input"))!;
    const expectedFilePath = files.find((file) => file.basename.startsWith("expected"))!;

    expect(inputFilePath).toBeDefined();
    expect(expectedFilePath).toBeDefined();

    const input = inputFilePath.readSync("utf-8").toString();
    const expected = expectedFilePath.readSync("utf-8").toString();

    const converted = await prettier.format(input, {
      singleQuote: false,
      semi: true,
      printWidth: 120,
      trailingComma: "all",

      filepath: inputFilePath.name,
      plugins: ["./dist/index.mjs"],
    });

    expect(converted).toEqual(expected);
  });
}
