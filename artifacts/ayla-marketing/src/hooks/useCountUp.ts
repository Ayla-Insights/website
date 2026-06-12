import { useState, useEffect, useRef } from "react";

export function useCountUp(
  target: number,
  options?: { duration?: number; prefix?: string; suffix?: string; decimals?: number }
) {
  const { duration = 1200, prefix = "", suffix = "", decimals = 0 } = options || {};
  const [displayValue, setDisplayValue] = useState(prefix + "0" + suffix);
  const ref = useRef<HTMLElement | any>(null);
  const hasRun = useRef(false);

  const runAnimation = () => {
    if (hasRun.current) return;
    hasRun.current = true;

    let animationFrameId: number;
    let startTimestamp: number;

    const format = (value: number) => {
      let formatted = decimals === 0
        ? Math.round(value).toString()
        : value.toFixed(decimals);
      const parts = formatted.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return prefix + parts.join(".") + suffix;
    };

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(format(target * easeProgress));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(format(target));
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId); };
  };

  useEffect(() => {
    const el = ref.current;

    // Fallback: if the element is already in-view on load (e.g. hero section)
    // or the ref ends up on a hidden duplicate (display:none), start after 600ms.
    const fallbackTimer = setTimeout(runAnimation, 600);

    // Also watch via IntersectionObserver so off-screen sections still animate in.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          clearTimeout(fallbackTimer);
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (el) observer.observe(el);

    return () => {
      clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, prefix, suffix, decimals]);

  return { ref, displayValue };
}
