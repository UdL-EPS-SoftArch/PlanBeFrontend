import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/common/PageContainer";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Acceso denegado" };

export default function ForbiddenPage() {
    return (
        <PageContainer width="narrow" className="py-20">
            <ErrorState
                title="No tienes acceso a esta página"
                message="Esta sección es solo para administradores. Si crees que es un error, habla con el equipo de PlanBe."
                action={<Button asChild variant="outline"><Link href="/">Volver al inicio</Link></Button>}
            />
        </PageContainer>
    );
}
