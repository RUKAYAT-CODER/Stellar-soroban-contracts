import { useCallback } from "react";
import { toast } from "sonner";

interface OperationalError {
  message: string;
  code?: string | number;
}

export function useErrorToast() {
  const triggerErrorToast = useCallback((error: unknown, fallbackCode = "ERR_UNKNOWN") => {
    const err = error as OperationalError;
    const message = err?.message || "An unhandled interface operation failed.";
    const code = err?.code || fallbackCode;

    toast.error(`Error context [${code}]`, {
      description: message,
      duration: 5000,
      closeButton: true,
    });
  }, []);

  return { triggerErrorToast };
}