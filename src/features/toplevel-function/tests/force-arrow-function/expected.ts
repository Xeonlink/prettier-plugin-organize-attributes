/**
 * comment1
 */

export default () => {
  return 1;
};

export const Named = <T extends string>(test: T): number => {
  return 2;
};

const Named2 = <const T extends { [key: string]: { named: number } }>(
  test: T,
): { named: string } => {
  return {
    named: "",
  };
};

() => {
  return 4;
};
