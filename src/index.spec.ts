import prettier from "prettier";
import { describe, expect, test } from "vitest";
import MyPlugin from "./index";
import { Path } from "@/utils/path";

const featuresPath = new Path(__dirname, "features");

for (const featureDirPath of featuresPath.dirs) {
  if (featureDirPath.name.startsWith("*")) continue;

  const testsDirPath = featureDirPath.dirs.find((dir) => dir.name === "tests");
  if (!testsDirPath) {
    console.warn(`tests directory not found in ${featureDirPath.name}`);
    continue;
  }
  const caseDirPaths = testsDirPath.dirs.filter((dir) => !dir.name.startsWith("*"));
  if (caseDirPaths.length === 0) {
    console.warn(`no test cases found in ${featureDirPath.name}`);
    continue;
  }

  describe(featureDirPath.name, () => {
    for (const caseDirPath of caseDirPaths) {
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
