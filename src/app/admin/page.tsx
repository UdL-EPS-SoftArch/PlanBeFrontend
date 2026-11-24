import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const metadata: Metadata = { title: "Administración" };

export default async function AdminPage() {
    await requireUser("/admin", ["ROLE_ADMIN"]);
    return (
        <PageContainer>
            <PageHeader title="Administración" description="Moderación y catálogos de PlanBe." />
            <ComingSoon what="El panel de moderación" issue="[11.3] #93" />
        </PageContainer>
    );
}
