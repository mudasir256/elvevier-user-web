// The store opens on empulse.store at midnight Pakistan time on 1 November 2026.
// Until then the proxy shows /coming-soon there; afterwards it serves the full store.
export const LAUNCH_AT = new Date("2026-11-01T00:00:00+05:00").getTime();

export function hasLaunched(now = Date.now()) {
  return now >= LAUNCH_AT;
}
