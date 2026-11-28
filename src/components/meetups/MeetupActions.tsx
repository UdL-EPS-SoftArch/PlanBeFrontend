"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarPlus, LogOut, MailPlus, MessageCircle, Pencil, XCircle } from "lucide-react";
import { InvitationService } from "@/api/invitationApi";
import { MeetupService } from "@/api/meetupApi";
import { ParticipationService } from "@/api/participationApi";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clientAuthProvider } from "@/lib/authProvider";
import { getErrorMessage } from "@/lib/errors";
import type { MeetupPermissions } from "@/types/meetupDetail";

type BusyAction = "join" | "leave" | "cancel" | "invite";

/** Action bar of `/meetups/[id]`. Each button is rendered only when the backend would allow it. */
export function MeetupActions({
    meetupId,
    permissions,
    participationId,
}: {
    meetupId: string;
    permissions: MeetupPermissions;
    participationId?: number;
}) {
    const router = useRouter();
    const services = useMemo(() => {
        const auth = clientAuthProvider();
        return {
            participations: new ParticipationService(auth),
            invitations: new InvitationService(auth),
            meetups: new MeetupService(auth),
        };
    }, []);
    const [busy, setBusy] = useState<BusyAction | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [invitee, setInvitee] = useState("");

    async function run(action: BusyAction, successMessage: string, request: () => Promise<void>): Promise<boolean> {
        setBusy(action);
        setError(null);
        try {
            await request();
            toast.success(successMessage);
            router.refresh();
            return true;
        } catch (caught) {
            const message = getErrorMessage(caught);
            setError(message);
            toast.error(message);
            return false;
        } finally {
            setBusy(null);
        }
    }

    async function submitInvite(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const username = invitee.trim();
        if (!username || busy) return;
        const sent = await run("invite", `Invitación enviada a ${username}`, () =>
            services.invitations.invite(meetupId, username));
        if (sent) {
            setInvitee("");
            setInviteOpen(false);
        }
    }

    return (
        <section aria-label="Acciones de la quedada" className="rounded-xl border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Tu participación</h2>
            <p className="mt-1 text-sm text-ink-soft">
                Solo se muestran las acciones que tienes permiso para realizar.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {permissions.canJoin && (
                    <Button
                        type="button"
                        data-testid="join-meetup"
                        disabled={busy !== null}
                        onClick={() => void run("join", "Te has apuntado a la quedada", () =>
                            services.participations.join(meetupId))}
                    >
                        <CalendarPlus aria-hidden="true" />
                        {busy === "join" ? "Uniendo…" : "Unirme"}
                    </Button>
                )}

                {permissions.canLeave && (
                    <Button
                        type="button"
                        variant="outline"
                        data-testid="leave-meetup"
                        disabled={busy !== null || participationId === undefined}
                        onClick={() => {
                            if (participationId === undefined) return;
                            void run("leave", "Has abandonado la quedada", () =>
                                services.participations.leave(participationId));
                        }}
                    >
                        <LogOut aria-hidden="true" />
                        {busy === "leave" ? "Saliendo…" : "Abandonar"}
                    </Button>
                )}

                {permissions.canEdit && (
                    <Button asChild variant="outline">
                        <Link href={`/meetups/${meetupId}/edit`} data-testid="edit-meetup">
                            <Pencil aria-hidden="true" /> Editar
                        </Link>
                    </Button>
                )}

                {permissions.canCancel && (
                    <ConfirmDialog
                        trigger={
                            <Button type="button" variant="destructive" data-testid="cancel-meetup" disabled={busy !== null}>
                                <XCircle aria-hidden="true" /> Cancelar quedada
                            </Button>
                        }
                        title="¿Cancelar la quedada?"
                        description="La quedada dejará de estar abierta y se avisará a las personas apuntadas."
                        confirmLabel="Cancelar quedada"
                        onConfirm={() => {
                            void run("cancel", "Quedada cancelada", async () => {
                                await services.meetups.updateMeetup(meetupId, { status: "CANCELLED" });
                            });
                        }}
                    />
                )}

                {permissions.canInvite && (
                    <Button
                        type="button"
                        variant="outline"
                        data-testid="invite-meetup"
                        aria-expanded={inviteOpen}
                        onClick={() => setInviteOpen(open => !open)}
                    >
                        <MailPlus aria-hidden="true" /> Invitar
                    </Button>
                )}

                {permissions.canComment && (
                    <Button asChild variant="ghost">
                        <a href="#comentarios" data-testid="comment-meetup">
                            <MessageCircle aria-hidden="true" /> Comentar
                        </a>
                    </Button>
                )}
            </div>

            {inviteOpen && (
                <form onSubmit={event => void submitInvite(event)} className="mt-4 flex flex-col gap-2 rounded-lg border p-3">
                    <Label htmlFor="invitee">Nombre de usuario a invitar</Label>
                    <div className="flex gap-2">
                        <Input
                            id="invitee"
                            name="invitee"
                            autoComplete="off"
                            placeholder="usuario"
                            value={invitee}
                            onChange={event => setInvitee(event.target.value)}
                        />
                        <Button type="submit" data-testid="send-invite" disabled={busy !== null || !invitee.trim()}>
                            {busy === "invite" ? "Enviando…" : "Enviar"}
                        </Button>
                    </div>
                </form>
            )}

            {error && <p role="alert" className="mt-4 rounded-lg bg-destructive-soft px-3 py-2 text-sm text-destructive-soft-foreground">{error}</p>}
        </section>
    );
}
