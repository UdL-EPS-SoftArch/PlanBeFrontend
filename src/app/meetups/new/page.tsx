"use client";

import { RequireAuth } from "@/components/common/RequireAuth";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function NewMeetupPage() {
    return (
        <PageContainer width="default">
            <RequireAuth>
                <PageHeader title="Crear quedada" />
                <ComingSoon what="El formulario de creación" issue="[3.4] #53" />
            </RequireAuth>
        </PageContainer>
    );
}
