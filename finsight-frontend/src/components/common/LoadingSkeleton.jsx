/*
 * LoadingSkeleton
 * ---------------
 * Reusable animated placeholder while data is loading.
 *
 * Use:
 *
 * <LoadingSkeleton className="h-20 w-full" />
 *
 * Or:
 *
 * <LoadingSkeleton count={4} className="h-16 w-full" />
 */
function LoadingSkeleton({
  className = "",
  count = 1,
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`
            animate-pulse
            rounded-xl
            bg-white/[0.06]
            ${className}
          `}
        />
      ))}
    </>
  );
}

export default LoadingSkeleton;
