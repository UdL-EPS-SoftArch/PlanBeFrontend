"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_IDS, type Category, type CategoryId } from "@/types/category";
import type { InterestOption } from "@/types/interest";

export type MeetupFilterValues = {
    category: string;
    city: string;
    startDate: string;
    interest: string;
};

const CATEGORY_LABELS: Record<string, string> = {
    TECHNOLOGY: "Tecnología",
    SPORTS: "Deporte",
    ARTS: "Arte",
    CULTURE: "Cultura",
    EDUCATION: "Educación",
    HEALTH: "Salud",
    OTHER: "Otros",
};

function categoryLabel(id: string): string {
    const text = CATEGORY_LABELS[id] ?? id.replace(/[_-]+/g, " ").toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Filter bar for `/meetups`. Selecting values and submitting pushes them to `searchParams`,
 * so the URL is shareable and survives a reload (the server page reads them back as props).
 */
export function MeetupFilters({
    values,
    categories,
    interests,
}: {
    values: MeetupFilterValues;
    categories: Category[];
    interests: InterestOption[];
}) {
    const router = useRouter();
    const [category, setCategory] = useState(values.category);
    const [city, setCity] = useState(values.city);
    const [startDate, setStartDate] = useState(values.startDate);
    const [interest, setInterest] = useState(values.interest);

    // The same client component instance is reused when only searchParams change.
    useEffect(() => {
        setCategory(values.category);
        setCity(values.city);
        setStartDate(values.startDate);
        setInterest(values.interest);
    }, [values.category, values.city, values.startDate, values.interest]);

    const categoryOptions: readonly CategoryId[] = categories.length > 0
        ? categories.map(c => String(c.id))
        : CATEGORY_IDS;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (city.trim()) params.set("city", city.trim());
        if (startDate) params.set("startDate", startDate);
        if (interest) params.set("interest", interest);
        const query = params.toString();
        router.push(query ? `/meetups?${query}` : "/meetups");
    }

    return (
        <form role="search" aria-label="Filtrar quedadas" onSubmit={submit} className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={category || "all"} onValueChange={value => setCategory(value === "all" ? "" : value)}>
                        <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categoryOptions.map(id => (
                                <SelectItem key={id} value={id}>{categoryLabel(id)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                        id="city"
                        value={city}
                        onChange={event => setCity(event.target.value)}
                        placeholder="Todas las ciudades"
                        autoComplete="off"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="startDate">Fecha desde</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="interest">Interés</Label>
                    <Select value={interest || "all"} onValueChange={value => setInterest(value === "all" ? "" : value)}>
                        <SelectTrigger id="interest" className="w-full">
                            <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {interests.map(option => (
                                <SelectItem key={option.ref} value={option.ref}>{option.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button type="submit">
                    <Search aria-hidden="true" /> Buscar
                </Button>
                <Button type="button" variant="ghost" onClick={() => router.push("/meetups")}>
                    <X aria-hidden="true" /> Limpiar filtros
                </Button>
            </div>
        </form>
    );
}
