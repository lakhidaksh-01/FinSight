/*
 * LoadingSkeleton
 * ---------------
 * Reusable animated placeholder while data is loading.
 */
function LoadingSkeleton({ className = "", count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-[pulse-glow_2s_ease-in-out_infinite] rounded-xl bg-[var(--surface-raised)] ${className}`}
        />
      ))}
    </>
  );
}

export default LoadingSkeleton;
