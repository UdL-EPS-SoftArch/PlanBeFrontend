---
name: nextjs-ui-pages
description: Build Next.js App Router pages and components (src/app/) using Server Components, Client Components, react-hook-form, shadcn/ui, and AuthProvider.
---

# Next.js App Router Pages & Forms Skill

Guide AI agents to build Next.js 16 App Router pages (`src/app/.../page.tsx`) and components (`src/app/components/...`) following the project's authentication, form handling, and UI conventions.

## Conventions & Rules

1. **Server Components vs. Client Components**:
   - **Server Components (default)**: Use for read-only list and detail pages (`src/app/<entities>/page.tsx`, `src/app/<entities>/[id]/page.tsx`). Pass `serverAuthProvider` to API services. In Next.js 16 dynamic routes, `params` is a Promise: `props: { params: Promise<{ id: string }> }` -> `(await props.params).id`.
   - **Client Components (`"use client"`)**: Use for interactive pages with forms, state, or mutations (`src/app/users/[id]/page.tsx`, `src/app/login/page.tsx`). Pass `clientAuthProvider()` to API services, read dynamic params via `useParams()`, and access session state via `useAuth()`.

2. **Forms with `react-hook-form` & shadcn/ui**:
   - Use `useForm<FormValues>()` with `register`, `handleSubmit`, `formState: { errors, isSubmitting }`, and `reset`.
   - Always set `id="<field>"` on `<Input>` / `<Textarea>` matching `<Label htmlFor="<field>">` so Playwright steps can target `#<field>`.
   - Render field errors as `<p className="text-sm text-red-600 mt-1">{errors.<field>.message}</p>`.
   - Reuse shadcn/ui primitives from `@/components/ui/card`, `@/components/ui/input`, `@/components/ui/textarea`, `@/components/ui/label`, and `@/components/ui/button`.

3. **Navigation & Links**:
   - Link to entities using `<Link href={entity.uri}>` (backend `UriEntity` provides `/<entities>/<id>`) or `<Link href={\`/<entities>/\${id}\`}>`.
   - Register top-level navigation items in `src/app/components/navbar.tsx` (`navLinks` array, adding `roles: ["ROLE_USER"]` for authenticated routes).

## Server Component Detail Page Template (`src/app/<entities>/[id]/page.tsx`)

```tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serverAuthProvider } from "@/lib/authProvider";
import { <Entity>Service } from "@/api/<entity>Api";
import { <Entity> } from "@/types/<entity>";
import { User } from "@/types/user";

export default async function <Entity>Page(props: { params: Promise<{ id: string }> }) {
    const service = new <Entity>Service(serverAuthProvider);
    const entity: <Entity> = await service.get<Entity>ById((await props.params).id);
    const owner: User = await service.get<Entity>Relation<User>(entity, "ownedBy");

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <div className="space-y-4 w-full">
                        <h1 className="text-2xl font-semibold"><Entity></h1>
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>{entity.name}</CardTitle>
                                {entity.description && (
                                    <CardDescription>{entity.description}</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent>
                                {owner && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        <b>Owner</b>: <Link href={`/users/${owner.username}`} className="text-blue-600 hover:underline">{owner.username}</Link>
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
```

## Client Component Form Snippet (`"use client"`)

```tsx
const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>();

const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
        const service = new <Entity>Service(clientAuthProvider());
        const created = await service.create<Entity>({ name: data.name, description: data.description || undefined } as <Entity>);
        setItems((prev) => [...prev, created]);
        reset();
    } catch {
        setError("Failed to create <entity>.");
    }
};
```
