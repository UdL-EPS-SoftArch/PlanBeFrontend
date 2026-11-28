import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MeetupDetailService } from "@/api/meetupDetailApi";
import { ErrorState } from "@/components/common/ErrorState";
import { PageContainer } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";
import { MeetupDetail } from "@/components/meetups/MeetupDetail";
import { serverAuthProvider } from "@/lib/authProvider";
import { getErrorMessage, HalError } from "@/lib/errors";
import { requireUser } from "@/lib/session";
import type { MeetupDetailData } from "@/types/meetupDetail";
import type { UserEntity } from "@/types/user";

export const metadata: Metadata = { title: "Detalle de la quedada" };

type DetailState =
    | { kind: "data"; data: MeetupDetailData }
    | { kind: "forbidden" }
    | { kind: "missing" }
    | { kind: "error"; message: string };

async function loadDetail(id: string, user: UserEntity): Promise<DetailState> {
    try {
        const data = await new MeetupDetailService(serverAuthProvider).load(id, user);
        return { kind: "data", data };
    } catch (error) {
        // `notFound()` and `redirect()` must be called outside this catch, so only map statuses here.
        if (error instanceof HalError) {
            if (error.status === 403) return { kind: "forbidden" };
            if (error.status === 404) return { kind: "missing" };
        }
        return { kind: "error", message: getErrorMessage(error) };
    }
}

export default async function MeetupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!/^\d+$/.test(id)) notFound();

    const user = await requireUser(`/meetups/${id}`);
    const state = await loadDetail(id, user);

    if (state.kind === "missing") notFound();

    if (state.kind === "forbidden") {
        return (
            <PageContainer width="narrow" className="py-20">
                <ErrorState
                    title="No tienes acceso a esta quedada"
                    message="Es privada o pertenece a un grupo al que no perteneces. Si crees que es un error, pide una invitación a la persona organizadora."
                    action={<Button asChild variant="outline"><Link href="/meetups">Ver otras quedadas</Link></Button>}
                />
            </PageContainer>
        );
    }

    if (state.kind === "error") {
        return (
            <PageContainer width="narrow" className="py-20">
                <ErrorState
                    title="No hemos podido cargar la quedada"
                    message={state.message}
                    action={<Button asChild variant="outline"><Link href="/meetups">Volver a quedadas</Link></Button>}
                />
            </PageContainer>
        );
    }

    return <MeetupDetail data={state.data} />;
}
