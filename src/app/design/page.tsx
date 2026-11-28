"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, CalendarSearch, ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageContainer } from "@/components/common/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { LoadingState } from "@/components/common/LoadingState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { UserAvatar } from "@/components/common/UserAvatar";
import { MeetupCard } from "@/components/meetups/MeetupCard";

/**
 * [0.2] Catálogo de componentes de PlanBe. Referencia viva para el equipo: muestra cada componente
 * con sus variantes y cuándo usarlo. Los datos son de ejemplo.
 */

const SAMPLE_MEETUP = {
    title: "Ruta en bici por La Mitjana",
    capacity: 12,
    category: "SPORTS",
    status: "OPEN",
    startDate: "2026-12-13T09:30:00Z",
    endDate: "2026-12-13T12:00:00Z",
    location: { name: "Seu Vella", city: "Lleida" },
};

function Section({ title, usage, children }: { title: string; usage: string; children: React.ReactNode }) {
    return (
        <section className="flex flex-col gap-5 border-t py-10">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="max-w-2xl text-[15px] text-ink-soft">{usage}</p>
            </div>
            {children}
        </section>
    );
}

type ExampleForm = { title: string; description: string };

export default function DesignPage() {
    const [date, setDate] = useState<Date | undefined>(new Date(2026, 11, 13));
    const form = useForm<ExampleForm>({ defaultValues: { title: "", description: "" } });

    return (
        <PageContainer>
            <PageHeader
                title="Componentes"
                description="Catálogo del sistema de diseño de PlanBe (issue [0.2]). Usa estos componentes antes de crear estilos nuevos."
            />

            <Section title="Botones" usage="Un solo botón principal por pantalla. Secundario con outline, cancelar con ghost, acciones destructivas siempre con confirmación.">
                <div className="flex flex-wrap items-center gap-3">
                    <Button><Plus aria-hidden="true" />Crear quedada</Button>
                    <Button variant="outline">Invitar</Button>
                    <Button variant="ghost">Cancelar</Button>
                    <Button variant="destructive">Cancelar quedada</Button>
                    <Button variant="link">Ver todas</Button>
                    <Button disabled>Completa</Button>
                    <Button size="sm" variant="outline">Pequeño</Button>
                    <Button size="lg">Grande</Button>
                </div>
            </Section>

            <Section title="Estados y etiquetas" usage="Badge para estados de quedada y participación. Cada estado tiene siempre el mismo color y texto.">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="success">Abierta</Badge>
                    <Badge variant="warning">Completa</Badge>
                    <Badge variant="danger">Cancelada</Badge>
                    <Badge variant="muted">Finalizada</Badge>
                    <Badge variant="success">Confirmado</Badge>
                    <Badge variant="warning">En lista de espera</Badge>
                    <Badge variant="accent">Deporte</Badge>
                    <Badge variant="outline" className="rounded-md">Privada</Badge>
                </div>
            </Section>

            <Section title="Formularios" usage="react-hook-form + Form. Cada campo con Label; los errores de cliente y del backend (HalError.fieldMessage) van debajo del campo.">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(() => toast.success("Formulario válido"))}
                        className="grid max-w-3xl gap-5 sm:grid-cols-2"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            rules={{ required: "El título es obligatorio." }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl><Input placeholder="Tarde de juegos de mesa" {...field} /></FormControl>
                                    <FormDescription>Máximo 80 caracteres.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-2">
                            <Label htmlFor="ds-category">Categoría</Label>
                            <Select defaultValue="sports">
                                <SelectTrigger id="ds-category" className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sports">Deporte</SelectItem>
                                    <SelectItem value="culture">Cultura</SelectItem>
                                    <SelectItem value="leisure">Ocio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-2">
                            <Label htmlFor="ds-date">Fecha</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button id="ds-date" variant="outline" className="justify-start font-normal">
                                        <CalendarDays aria-hidden="true" />
                                        {date ? date.toLocaleDateString("es-ES", { dateStyle: "long" }) : "Elige una fecha"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={date} onSelect={setDate} locale={es} />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-col justify-end gap-4">
                            <div className="flex items-center gap-2">
                                <Checkbox id="ds-terms" defaultChecked />
                                <Label htmlFor="ds-terms">Acepto las normas de la quedada</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch id="ds-privacy" />
                                <Label htmlFor="ds-privacy">Mostrar mis datos personales</Label>
                            </div>
                        </div>
                        <div className="flex gap-3 sm:col-span-2">
                            <Button type="submit">Guardar</Button>
                            <Button type="button" variant="ghost" onClick={() => form.reset()}>Limpiar</Button>
                        </div>
                    </form>
                </Form>
            </Section>

            <Section title="Avisos" usage="Alert para mensajes dentro de la página; toast (sonner) para confirmar una acción que ya ha terminado.">
                <div className="flex max-w-3xl flex-col gap-4">
                    <Alert>
                        <AlertTitle>Estás en la lista de espera</AlertTitle>
                        <AlertDescription>Te avisaremos si se libera una plaza.</AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                        <AlertTitle>No se ha podido guardar</AlertTitle>
                        <AlertDescription>La fecha de fin tiene que ser posterior a la de inicio.</AlertDescription>
                    </Alert>
                    <div>
                        <Button variant="outline" onClick={() => toast.success("Te has unido a la quedada")}>Mostrar un toast</Button>
                    </div>
                </div>
            </Section>

            <Section title="Navegación dentro de una página" usage="Tabs para vistas hermanas (Participo / Organizo); Pagination siguiendo los enlaces HAL next/prev.">
                <Tabs defaultValue="part" className="max-w-3xl">
                    <TabsList>
                        <TabsTrigger value="part">Participo</TabsTrigger>
                        <TabsTrigger value="org">Organizo</TabsTrigger>
                    </TabsList>
                    <TabsContent value="part" className="pt-3 text-[15px] text-ink-soft">Quedadas a las que te has apuntado.</TabsContent>
                    <TabsContent value="org" className="pt-3 text-[15px] text-ink-soft">Quedadas que organizas tú.</TabsContent>
                </Tabs>
                <Pagination className="justify-start">
                    <PaginationContent>
                        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
                        <PaginationItem><PaginationEllipsis /></PaginationItem>
                        <PaginationItem><PaginationNext href="#" /></PaginationItem>
                    </PaginationContent>
                </Pagination>
            </Section>

            <Section title="Tablas" usage="Solo para datos que se comparan en columnas (paneles de administración). Para quedadas, usa tarjetas.">
                <div className="max-w-3xl overflow-x-auto rounded-xl border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Interés</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Senderismo</TableCell>
                                <TableCell>Naturaleza</TableCell>
                                <TableCell className="text-right"><Button size="sm" variant="ghost">Editar</Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Juegos de mesa</TableCell>
                                <TableCell>Ocio</TableCell>
                                <TableCell className="text-right"><Button size="sm" variant="ghost">Editar</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Section>

            <Section title="Capas" usage="Dialog (ConfirmDialog) para confirmar, Sheet para paneles laterales y menús en móvil, DropdownMenu para acciones secundarias.">
                <div className="flex flex-wrap gap-3">
                    <ConfirmDialog
                        trigger={<Button variant="destructive">Cancelar quedada</Button>}
                        title="¿Cancelar la quedada?"
                        description="Avisaremos a las 8 personas apuntadas. No se puede deshacer."
                        confirmLabel="Sí, cancelar"
                        onConfirm={() => { toast("Quedada cancelada"); }}
                    />
                    <Sheet>
                        <SheetTrigger asChild><Button variant="outline">Abrir filtros</Button></SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filtros</SheetTitle>
                                <SheetDescription>Panel lateral de ejemplo.</SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">Más acciones<ChevronDown aria-hidden="true" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Section>

            <Section title="Contenido" usage="MeetupCard en todas las listas de quedadas; UserAvatar con iniciales cuando no hay foto; Separator entre bloques relacionados.">
                <div className="flex flex-wrap items-start gap-8">
                    <div className="w-[340px]"><MeetupCard meetup={SAMPLE_MEETUP} /></div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <UserAvatar user={{ username: "laia", displayName: "Laia Martí" }} size="sm" />
                            <UserAvatar user={{ username: "laia", displayName: "Laia Martí" }} />
                            <UserAvatar user={{ username: "laia", displayName: "Laia Martí" }} size="lg" />
                        </div>
                        <Separator />
                        <span className="text-sm text-ink-soft">sm · md · lg</span>
                    </div>
                </div>
            </Section>

            <Section title="Carga, vacío y error" usage="Toda sección que llama al backend muestra uno de estos tres estados mientras no hay datos.">
                <div className="grid gap-5 lg:grid-cols-3">
                    <div className="rounded-xl border p-6"><LoadingState /><Skeleton className="mt-3 h-24" /></div>
                    <EmptyState icon={<CalendarSearch />} title="No hay quedadas" description="Prueba con otros filtros o crea una." />
                    <ErrorState message="No se puede conectar con el servidor." />
                </div>
            </Section>
        </PageContainer>
    );
}
