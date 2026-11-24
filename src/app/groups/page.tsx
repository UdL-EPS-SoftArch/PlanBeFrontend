import type { Metadata } from "next";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const metadata: Metadata = { title: "Grupos" };

export default function GroupsPage() {
    return (
        <PageContainer>
            <PageHeader title="Grupos" description="Comunidades que organizan quedadas juntas." />
            <ComingSoon what="Listado de grupos" issue="[5.2] #68" />
        </PageContainer>
    );
}
