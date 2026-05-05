import { useEffect, useState } from 'react';

/* ------------------------------------------------------------------
 * Shared scroll-phase utilities used by every layered page on the
 * site (Home, About, Our Work, Work With Us).
 *
 * The core idea:
 *  - Each page is a tall scroll container with several visual
 *    "layers" stacked as fixed-position elements at the viewport.
 *  - Scrolling drives one or more `phase` values from 0 → 1, and
 *    layer opacity / position is derived from those phases.
 *
 * The math is identical across pages, so it lives here.
 * ------------------------------------------------------------------ */

export const clamp01 = (v: number): number => Math.min(Math.max(v, 0), 1);

/**
 * Normalize a phase value (already 0..1) into a sub-segment.
 * Returns 0 below `start`, 1 above `end`, ramps linearly between.
 *
 * Example: `normalize(scrollPhase2, 0.55, 0.95)` is 0 until the
 * second phase is 55% complete, then ramps to 1 by 95%.
 */
export function normalize(phase: number, start: number, end: number): number {
  if (end <= start) return phase >= end ? 1 : 0;
  return clamp01((phase - start) / (end - start));
}

/**
 * Subscribe to window.scrollY and return one normalized 0..1 phase
 * value per layer transition.
 *
 * Each phase represents one transition between consecutive layers.
 * Phases are spaced `holdVh + transitionVh` apart, so layer N has:
 *   - a `holdVh`-tall "fully visible" zone before its transition
 *   - a `transitionVh`-tall fade-to-next-layer zone
 *
 * Defaults match the design used across the site: 1vh hold + 1.5vh
 * transition = 2.5vh stride. With 4 phases, useful scroll distance
 * is ~10vh (enough to give every layer a settled moment).
 *
 * Usage:
 *   const [phase1, phase2] = useScrollPhases(2);
 *
 * @param count          Number of phase transitions
 * @param holdVh         Hold duration before each transition, in vh
 * @param transitionVh   Length of each transition, in vh
 */
export function useScrollPhases(
  count: number,
  holdVh: number = 1,
  transitionVh: number = 1.5,
): number[] {
  const [values, setValues] = useState<number[]>(() =>
    new Array(count).fill(0),
  );

  useEffect(() => {
    const stride = holdVh + transitionVh;
    const recompute = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      setValues(
        Array.from({ length: count }, (_, i) =>
          clamp01((y - vh * (holdVh + stride * i)) / (vh * transitionVh)),
        ),
      );
    };
    recompute();
    window.addEventListener('scroll', recompute, { passive: true });
    return () => window.removeEventListener('scroll', recompute);
  }, [count, holdVh, transitionVh]);

  return values;
}

/**
 * Track whether the viewport is below `breakpointPx` wide.
 * Re-renders the consuming component on resize across the breakpoint.
 *
 * Mirrors Tailwind's `md` default (768px) so it lines up with the
 * `md:` utility classes used throughout the site.
 */
export function useIsMobile(breakpointPx: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpointPx : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpointPx);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpointPx]);

  return isMobile;
}

/**
 * Build the inline-style block every fixed layer uses: opacity +
 * translateY transform + pointerEvents/visibility gating.
 *
 *   - `opacity <= 0.01` flips visibility to `hidden` so off-screen
 *     layers don't paint or capture touches.
 *   - `opacity > 0.1` enables pointer events; below that, clicks
 *     pass through to whatever's underneath. Pass `interactive` to
 *     override (the home page Projects layer needs a custom mobile
 *     "settled" check, for instance).
 */
export function fixedLayerStyle(
  opacity: number,
  translateY: number = 0,
  interactive?: boolean,
): React.CSSProperties {
  return {
    opacity,
    transform: `translateY(${translateY}px)`,
    pointerEvents:
      (interactive ?? opacity > 0.1) ? 'auto' : 'none',
    visibility: opacity <= 0.01 ? 'hidden' : 'visible',
  };
}
