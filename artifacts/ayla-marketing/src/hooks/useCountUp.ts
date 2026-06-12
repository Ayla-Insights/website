import { useState, useEffect, useRef } from "react";

export function useCountUp(
  target: number,
  options?: { duration?: number; prefix?: string; suffix?: string; decimals?: number }
) {
  const { duration = 1200, prefix = "", suffix = "", decimals = 0 } = options || {};
  const [displayValue, setDisplayValue] = useState(prefix + "0" + suffix);
  const ref = useRef<HTMLElement | any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasRun = false;
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasRun) {
          hasRun = true;
          observer.disconnect();

          let startTimestamp: number;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = target * easeProgress;
            
            let formattedNumber = currentCount.toFixed(decimals);
            if (decimals === 0) {
                formattedNumber = Math.round(currentCount).toString();
            }
            
            const parts = formattedNumber.split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            formattedNumber = parts.join(".");

            setDisplayValue(prefix + formattedNumber + suffix);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(step);
            } else {
                let finalFormattedNumber = target.toFixed(decimals);
                if (decimals === 0) {
                    finalFormattedNumber = Math.round(target).toString();
                }
                const finalParts = finalFormattedNumber.split(".");
                finalParts[0] = finalParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                setDisplayValue(prefix + finalParts.join(".") + suffix);
            }
          };
          animationFrameId = requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, prefix, suffix, decimals]);

  return { ref, displayValue };
}
