import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALUMNI_LOGOS } from '../data/logos';

/* ------------------------------------------------------------------
 * Career outcomes wall.
 *
 * Headline sits above the grid (no center hole) so the copy can
 * breathe and "create impact" gets real display-type weight. The
 * grid still cycles one random slot at a time — so even with more
 * logos than visible cells, the wall feels alive.
 *
 *   Desktop : 6 cols × 3 rows = 18 visible slots
 *   Mobile  : 3 cols × 4 rows = 12 visible slots
 * ------------------------------------------------------------------ */

const DESKTOP_COLS = 6;
const DESKTOP_ROWS = 3;
const MOBILE_COLS = 3;
const MOBILE_ROWS = 4;

const FADE_MS = 500;
const CYCLE_MS = 2200;

const AlumniLogoWall: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cols = isDesktop ? DESKTOP_COLS : MOBILE_COLS;
  const rows = isDesktop ? DESKTOP_ROWS : MOBILE_ROWS;
  const totalCells = cols * rows;

  /* Build an initial layout + a fair-rotation queue.
   *
   * Why shuffle: if we always took the first N entries from
   * ALUMNI_LOGOS, anything appended to the end of the array would
   * never appear on first render and could take a long time to
   * cycle in. Shuffling means every logo has equal chance of being
   * visible immediately, so adding a new entry "just shows up".
   *
   * Why a queue: random cycling can leave specific logos hidden for
   * very long stretches by chance. A FIFO queue of off-screen logos
   * guarantees every logo gets its turn within a bounded time —
   * specifically `queue.length * CYCLE_MS`. */
  const { initialSlots, initialQueue } = useMemo(() => {
    if (ALUMNI_LOGOS.length === 0) {
      return {
        initialSlots: new Array(totalCells).fill(null) as (string | null)[],
        initialQueue: [] as string[],
      };
    }
    const shuffled = [...ALUMNI_LOGOS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const slots: (string | null)[] = new Array(totalCells).fill(null);
    for (let i = 0; i < totalCells; i++) {
      slots[i] = shuffled[i % shuffled.length];
    }
    const queue = shuffled.slice(totalCells);
    return { initialSlots: slots, initialQueue: queue };
  }, [totalCells]);

  const [slots, setSlots] = useState<(string | null)[]>(initialSlots);
  const [fadingIdx, setFadingIdx] = useState<number | null>(null);
  const queueRef = useRef<string[]>(initialQueue);
  /* slotsRef mirrors `slots`. We need this because the queue
   * mutation must happen synchronously and OUTSIDE React's setState
   * updater — strict-mode dev calls updater fns twice to detect
   * impure code, which would otherwise double-shift/push the queue
   * and corrupt it with duplicates. */
  const slotsRef = useRef<(string | null)[]>(initialSlots);

  // Reset on layout change (mobile↔desktop crosses the breakpoint).
  useEffect(() => {
    setSlots(initialSlots);
    setFadingIdx(null);
    queueRef.current = [...initialQueue];
    slotsRef.current = [...initialSlots];
  }, [initialSlots, initialQueue]);

  /* Cycle: every tick, pop the next off-screen logo from the queue,
   * preload it, fade out a random slot, then swap in the queued logo
   * and push the displaced logo to the back of the queue. */
  useEffect(() => {
    if (ALUMNI_LOGOS.length <= totalCells) return; // nothing waiting
    let cancelled = false;
    let inFlight = false;
    let swapTimeout: ReturnType<typeof setTimeout> | undefined;

    const preload = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = `/logos/${src}`;
      });

    const tick = async () => {
      if (inFlight || queueRef.current.length === 0) return;
      const incoming = queueRef.current[0];
      if (!incoming) return;

      inFlight = true;
      // Wait for the next logo so the fade doesn't land on a blank slot.
      await preload(incoming);
      if (cancelled || queueRef.current[0] !== incoming) {
        inFlight = false;
        return;
      }

      const slotIdx = Math.floor(Math.random() * totalCells);
      setFadingIdx(slotIdx);

      swapTimeout = setTimeout(() => {
        if (cancelled) {
          inFlight = false;
          return;
        }
        if (queueRef.current.length === 0) {
          setFadingIdx(null);
          inFlight = false;
          return;
        }
        const next = queueRef.current.shift()!;
        // Sanity: if the incoming logo is somehow already on screen,
        // skip the swap and re-queue it. Prevents duplicate display
        // even if state ever drifts out of sync.
        if (slotsRef.current.includes(next)) {
          queueRef.current.push(next);
          setFadingIdx(null);
          inFlight = false;
          return;
        }
        const displaced = slotsRef.current[slotIdx];
        const newSlots = [...slotsRef.current];
        newSlots[slotIdx] = next;
        slotsRef.current = newSlots;
        if (displaced) queueRef.current.push(displaced);
        setSlots(newSlots);
        // Keep faded for one frame, then fade the new logo in.
        requestAnimationFrame(() => {
          if (!cancelled) setFadingIdx(null);
          inFlight = false;
        });
      }, FADE_MS);
    };

    const interval = setInterval(() => {
      void tick();
    }, CYCLE_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (swapTimeout) clearTimeout(swapTimeout);
    };
  }, [totalCells]);

  return (
    /* No internal vertical padding — the wrapping layer in
     * AboutPage owns the top/bottom spacing so the headline never
     * rides up behind the fixed nav. */
    <section className="relative w-full px-4 md:px-8">
      <div className="max-w-5xl mx-auto">

        {/* Headline — eyebrow + intro + display-type emphasis line. */}
        <div className="text-center mb-8 md:mb-12">
          <span className="block text-slate-400 text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase">
            Beyond Cornell
          </span>
          <h2 className="text-[#17558E] font-medium tracking-tight leading-[0.95] mt-3 md:mt-4">
            <span className="block text-xl md:text-2xl lg:text-3xl">
              Our members go on to
            </span>
            <span
              className="block text-5xl md:text-7xl lg:text-[5.5rem] italic mt-1 md:mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              create real impact.
            </span>
          </h2>
        </div>

        {/* Logo grid */}
        <div
          className="grid gap-2.5 md:gap-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: totalCells }, (_, i) => {
            const logo = slots[i];
            const isFading = fadingIdx === i;
            return (
              <div
                key={i}
                className="aspect-[5/3] rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center p-3 md:p-4"
              >
                {logo ? (
                  /* The inner box clamps every logo to the same
                   * bounding region. PNGs ship at wildly different
                   * aspect ratios (Microsoft wordmark vs. Apple
                   * mark), so without this they'd render at very
                   * different visual sizes. The height cap is the
                   * dominant constraint, which gives the wall a
                   * uniform x-height and makes the logos read as
                   * "the same size" at a glance. */
                  <div className="w-[80%] h-[55%] flex items-center justify-center">
                    <img
                      src={`/logos/${logo}`}
                      alt=""
                      className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-out opacity-80 hover:opacity-100"
                      style={{ opacity: isFading ? 0 : undefined }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-md bg-slate-50" />
                )}
              </div>
            );
          })}
        </div>

        {ALUMNI_LOGOS.length === 0 && (
          <p className="mt-6 text-center text-slate-400 text-xs tracking-wide">
            Add SVG logos to /public/logos and list them in data/logos.ts to
            populate this wall.
          </p>
        )}
      </div>
    </section>
  );
};

export default AlumniLogoWall;
