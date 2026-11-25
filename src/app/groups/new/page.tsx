"use client";

import { RequireAuth } from "@/components/common/RequireAuth";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function NewGroupPage() {
    return (
        <PageContainer width="default">
            <RequireAuth>
                <PageHeader title="Crear grupo" />
                <ComingSoon what="El formulario de grupos" issue="[5.3] #69" />
            </RequireAuth>
        </PageContainer>
    );
}
