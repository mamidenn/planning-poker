import { range } from "lodash";

export const fibonacci = (n: number): number[] => {
  if (n < 1) return [];
  if (n === 1) return [1];
  const res = [1, 2];
  for (const _ of range(n - 2)) {
    const a = res.pop()!;
    const b = res.pop()!;
    res.push(b, a, a + b);
  }
  return res;
};
