import { motion } from "motion/react";

/*
 * Card
 * ----
 * Premium surface primitive used across FinSight.
 *
 *   <Card hover padding="lg">
 *     ...
 *   </Card>
 */
function Card({
  children,
  className = "",
  hover = false,
  padding = "base",
  bordered = true,
  ...props
}) {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    base: "p-5",
    lg: "p-6",
    xl: "p-8",
  };

  return (
    <motion.div
      whileHover={
        hover
          ? { y: -2, transition: { duration: 0.2, ease: "easeOut" } }
          : undefined
      }
      className={`relative overflow-hidden rounded-3xl ${
        bordered
          ? "border border-[var(--border-subtle)]"
          : ""
      } bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all duration-200 ${
        hover
          ? "hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)]"
          : ""
      } ${paddings[padding] || paddings.base} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default Card;
