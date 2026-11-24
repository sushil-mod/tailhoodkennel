/**
 * Tiny seeded PRNG (mulberry32) so decorative "random" layouts are generated
 * at build time and stay identical between builds.
 */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to a fixed number of decimals (keeps generated CSS short). */
export const r = (n: number, d = 2) => Number(n.toFixed(d));
