import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";
import { forwardRef } from "react";

export const FadeInSection = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, className, ...props }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={reduced ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
FadeInSection.displayName = "FadeInSection";

export const StaggerChildren = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, className, ...props }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reduced ? 0 : 0.09,
            },
          },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerChildren.displayName = "StaggerChildren";

export const StaggerItem = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, className, ...props }, ref) => {
    const reduced = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
          visible: { opacity: 1, y: 0, transition: reduced ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";
