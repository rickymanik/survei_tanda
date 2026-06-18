import type { ReactNode } from "react";

type DialogProps = {
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "info" | "danger";
  onConfirm?: () => void;
  onClose: () => void;
};

export function Dialog({
  title,
  children,
  confirmText = "OK",
  cancelText = "Batal",
  variant = "info",
  onConfirm,
  onClose
}: DialogProps) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <h2 id="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          {onConfirm && (
            <button className="ghost-button" type="button" onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button className={variant === "danger" ? "danger-button" : "primary-button"} type="button" onClick={onConfirm ?? onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
