import prettier from "prettier";
import { expect, test } from "vitest";
import SortAttributesPlugin from "./index";
import { Path } from "./utils/path";

const testcasesPath = new Path(__dirname, "tests");

for (const caseDirPath of testcasesPath.dirs) {
  test(`${caseDirPath.name}`, async () => {
    const files = caseDirPath.files;
    const inputFilePath = files.find((file) => file.name.startsWith("input"))!;
    const expectedFilePath = files.find((file) => file.name.startsWith("expected"))!;
    const configFilePath = files.find((file) => file.name === "config.json")!;

    expect(inputFilePath).toBeDefined();
    expect(expectedFilePath).toBeDefined();
    expect(configFilePath).toBeDefined();

    expect(inputFilePath.exists).toBe(true);
    expect(expectedFilePath.exists).toBe(true);
    expect(configFilePath.exists).toBe(true);

    const input = inputFilePath.readSync("utf-8").toString();
    const expected = expectedFilePath.readSync("utf-8").toString();
    const config = JSON.parse(configFilePath.readSync("utf-8").toString()) as prettier.Options;

    const converted = await prettier.format(input, {
      ...config,
      filepath: inputFilePath.full,
      plugins: [...(config.plugins ?? []), SortAttributesPlugin, "prettier-plugin-merge"],
    });

    expect(converted).toEqual(expected);
  });
}
