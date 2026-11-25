import { useEffect } from "react";

let toastTimer: NodeJS.Timeout | null = null;

export function useToast() {
    const toast = (options: {
        title: string;
        description: string;
        variant?: "default" | "destructive";
    }) => {
        // Si ja existeix un toast actiu, el suprimim
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }

        // Creem el toast amb sonner
        const div = document.createElement("div");
        div.setAttribute("data-toast", "true");

        // Use sonner's Toaster if available, otherwise simple alert
        const sonner = (window as any)?.Sonner?.toast;
        if (sonner) {
            sonner({
                title: options.title,
                description: options.description,
                variant: options.variant || "default",
            });
        } else {
            // Fallback: simple alert
            alert(`${options.title}\n\n${options.description}`);
        }

        // Auto-dismiss after 5 seconds
        toastTimer = setTimeout(() => {
            if (div?.remove) div.remove();
            toastTimer = null;
        }, 5000);
    };

    return { toast };
}