import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

/*
 * Modal
 * -----
 * Premium modal window for forms, confirmations,
 * details and other temporary content.
 */
function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "medium",
  showCloseButton = true,
}) {
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement;
    const panel = panelRef.current;

    window.requestAnimationFrame(() => {
      panel
        ?.querySelector(
          "button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
        ?.focus();
    });

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleFocusTrap = (event) => {
      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusable = [
        ...panel.querySelectorAll(
          "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
        ),
      ];

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleFocusTrap);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleFocusTrap);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizes = {
    small: "max-w-md",
    medium: "max-w-lg",
    large: "max-w-2xl",
    extraLarge: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm transition-opacity"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full ${sizes[size] || sizes.medium} max-h-[90vh] overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-lg)]`}
      >
        <div className="flex items-start justify-between border-b border-[var(--border-subtle)] px-6 py-5 sm:px-7">
          <div className="min-w-0 pr-4">
            <h2 id="modal-title" className="text-base font-semibold tracking-tight text-[var(--text-primary)] sm:text-lg">
              {title}
            </h2>
            {description && (
              <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
            >
              <X size={19} strokeWidth={1.8} />
            </button>
          )}
        </div>

        <div className="max-h-[calc(90vh-110px)] overflow-y-auto p-6 sm:p-7">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default Modal;
