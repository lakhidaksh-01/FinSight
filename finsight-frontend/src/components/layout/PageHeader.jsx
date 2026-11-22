/*
 * PageHeader
 * ----------
 * Reusable heading section for application pages.
 */
function PageHeader({ title, description, action, eyebrow }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{eyebrow}</p>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">{title}</h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)] sm:text-[15px]">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
