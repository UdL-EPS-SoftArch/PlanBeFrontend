import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export default async function MeetupDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    return (
        <PageContainer>
            <PageHeader title={`Quedada #${id}`} />
            <ComingSoon what="Detalle de quedada" issue="[3.3] #52" />
        </PageContainer>
    );
}
