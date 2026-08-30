import React, { createContext, useContext, useState } from "react";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [pending, setPending] = useState(null);

  const confirm = (title, message, onConfirm, onCancel = null) => {
    return new Promise((resolve) => {
      setPending({
        title,
        message,
        onConfirm: async () => {
          try {
            await onConfirm?.();
          } finally {
            setPending(null);
            resolve(true);
          }
        },
        onCancel: () => {
          onCancel?.();
          setPending(null);
          resolve(false);
        },
      });
    });
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {pending && (
        <ConfirmDialog
          title={pending.title}
          message={pending.message}
          onConfirm={pending.onConfirm}
          onCancel={pending.onCancel}
        />
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
};

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button
            className="button secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="button danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
