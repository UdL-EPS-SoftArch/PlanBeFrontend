import type { Metadata } from "next";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const metadata: Metadata = { title: "Quedadas" };

export default function MeetupsPage() {
    return (
        <PageContainer>
            <PageHeader title="Quedadas" description="Solo ves las quedadas públicas y las de tus grupos." />
            <ComingSoon what="Listado y búsqueda de quedadas" issue="[3.2] #51" />
        </PageContainer>
    );
}
