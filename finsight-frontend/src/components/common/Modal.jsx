import { X } from "lucide-react";
import { useEffect } from "react";

/*
 * Modal
 * -----
 * Reusable modal window for forms, confirmations,
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
  // Close the modal when Escape is pressed.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent rendering when modal is closed.
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
      {/* Background overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      {/* Modal content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`
          relative z-10 w-full
          ${sizes[size] || sizes.medium}
          max-h-[90vh]
          overflow-hidden
          rounded-2xl
          border border-white/[0.08]
          bg-slate-900
          shadow-2xl shadow-black/40
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <div className="min-w-0 pr-4">
            <h2
              id="modal-title"
              className="text-base font-semibold text-white sm:text-lg"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <X size={19} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
