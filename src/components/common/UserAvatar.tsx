import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { userInitials, userLabel, type UserEntity } from "@/types/user";

const SIZES = {
    sm: "size-7 text-[11px]",
    md: "size-9 text-[13px]",
    lg: "size-28 text-4xl font-display",
} as const;

/** Avatar with `avatarUrl` when present and initials as fallback. */
export function UserAvatar({
    user,
    size = "md",
    className,
}: {
    user: Pick<UserEntity, "username" | "displayName" | "avatarUrl">;
    size?: keyof typeof SIZES;
    className?: string;
}) {
    return (
        <Avatar className={cn(SIZES[size], className)}>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
            <AvatarFallback className="bg-accent font-bold text-accent-foreground" aria-label={userLabel(user)}>
                {userInitials(user)}
            </AvatarFallback>
        </Avatar>
    );
}
