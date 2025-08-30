export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as Pick<T, K>,
  );
}

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  return keys.reduce(
    (acc, key) => {
      delete acc[key];
      return acc;
    },
    { ...obj },
  ) as Omit<T, K>;
}

/**
 * 배열을 지정된 크기의 청크로 나눕니다.
 *
 * @param arr - 나눌 배열
 * @param size - 각 청크의 크기
 * @returns 청크로 나뉜 2차원 배열
 *
 * @example
 * ```typescript
 * chunk([1, 2, 3, 4, 5, 6], 2)
 * // 결과: [[1, 2], [3, 4], [5, 6]]
 *
 * chunk([1, 2, 3, 4, 5], 3)
 * // 결과: [[1, 2, 3], [4, 5]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }

  return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
    arr.slice(index * size, (index + 1) * size),
  );
}

export function regex(pattern: string): RegExp {
  const matched1 = pattern.match(/^\/(.*)\/([ig]*)$/);
  if (matched1) {
    return new RegExp(matched1[1], matched1[2]);
  }
  const matched2 = pattern.match(/^\/(.*)\/$/);
  if (matched2) {
    return new RegExp(matched2[1]);
  }
  return new RegExp(pattern);
}

export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export function* iter<T>(arr: T[]) {
  for (let i = 0; i < arr.length; i++) {
    yield [i, arr[i]] as const;
  }
}
