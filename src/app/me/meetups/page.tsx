import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export const metadata: Metadata = { title: "Mis quedadas" };

export default async function MyMeetupsPage() {
    await requireUser("/me/meetups");
    return (
        <PageContainer width="default">
            <PageHeader title="Mis quedadas" description="Las que organizas y a las que te has apuntado." />
            <ComingSoon what="Mis quedadas" issue="[3.6] #55 y [4.4] #63" />
        </PageContainer>
    );
}
