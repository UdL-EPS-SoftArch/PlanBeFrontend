import Link from "next/link";
import { ErrorState } from "@/components/common/ErrorState";
import { PageContainer } from "@/components/common/PageContainer";
import { Button } from "@/components/ui/button";

export default function MeetupNotFound() {
    return (
        <PageContainer width="narrow" className="py-20">
            <ErrorState
                title="No hemos encontrado la quedada"
                message="Puede que se haya eliminado, que el enlace no sea correcto o que no tengas permiso para verla."
                action={<Button asChild variant="outline"><Link href="/meetups">Volver a quedadas</Link></Button>}
            />
        </PageContainer>
    );
}
