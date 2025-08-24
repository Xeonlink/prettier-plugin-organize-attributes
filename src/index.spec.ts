import SortAttributesPlugin from "./index";
import MergePlugin from "../merge";
import { Path } from "./utils/path";
import * as prettier from "prettier";
import { expect, test } from "vitest";

const config = await prettier.resolveConfig(process.cwd());

const testcasesPath = new Path(__dirname, "tests");

for (const caseDirPath of testcasesPath.dirs) {
  if (caseDirPath.name !== "base-vue") continue;

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
      filepath: inputFilePath.name,
      plugins: [...(config.plugins ?? []), SortAttributesPlugin, MergePlugin],
    });

    expect(converted).toEqual(expected);
  });
}
