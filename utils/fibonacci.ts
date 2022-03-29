import { range } from "lodash";

export const fibonacci = (n: number): string[] => {
  if (n < 1) return [];
  if (n === 1) return ["1"];
  const res = [1, 2];
  for (const _ of range(n - 2)) {
    res.push(res.at(-2)! + res.at(-1)!);
  }
  return res.map((i) => i.toString());
};
