// Returns a random integer between a and b
export const rand = (b: number, a = 0): number => Math.floor((b - a) * Math.random() + a);

export const range = <T = number>(length: number, map?: (n: number) => T, start = 0): T[] => {
   const array = new Array(length).fill(null);
   return array.map((_, i) => map ? map(i + start) : i + start) as T[]
};