import { Path } from "@/utils/path";
import prettier from "prettier";
import { describe, expect, test } from "vitest";
import MyPlugin from "./index";

const testsPath = new Path(__dirname, "tests");

for (const langDirPath of testsPath.dirs) {
  describe(`${langDirPath.name}`, () => {
    for (const caseDirPath of langDirPath.dirs) {
      test(`${caseDirPath.name}`, async () => {
        const files = caseDirPath.files;
        const inputFilePath = files.find((file) => file.name.startsWith("input"))!;
        const expectedFilePath = files.find((file) => file.name.startsWith("expected"))!;
        const configFilePath = files.find((file) => file.name === ".prettierrc")!;

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
          plugins: [...(config.plugins ?? []), MyPlugin, "prettier-plugin-merge"],
        });

        expect(converted).toEqual(expected);
      });
    }
  });
}
