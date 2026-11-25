"use client";

import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Confirmation for destructive actions (cancelar quedada, abandonar, borrar…).
 * The trigger opens it; `onConfirm` may be async and keeps the dialog open while it runs.
 */
export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = "Confirmar",
    cancelLabel = "Volver",
    destructive = true,
    onConfirm,
}: {
    trigger: React.ReactNode;
    title: string;
    description?: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void | Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    async function confirm() {
        setBusy(true);
        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setBusy(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" disabled={busy}>{cancelLabel}</Button>
                    </DialogClose>
                    <Button variant={destructive ? "destructive" : "default"} onClick={confirm} disabled={busy}>
                        {busy ? "Un momento…" : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
