import Link from "next/link";
import { Construction } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";

/** Placeholder for routes the navigation already links to but a later issue builds. */
export function ComingSoon({ what, issue }: { what: string; issue: string }) {
    return (
        <EmptyState
            icon={<Construction />}
            title={`${what}: muy pronto`}
            description={<>Esta pantalla se construye en la issue <span className="font-semibold text-foreground">{issue}</span>. Mientras tanto, echa un vistazo a las próximas quedadas.</>}
            action={<Button asChild variant="outline"><Link href="/">Ir al inicio</Link></Button>}
        />
    );
}
