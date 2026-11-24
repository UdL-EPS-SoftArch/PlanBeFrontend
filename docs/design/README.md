# Diseño base de PlanBe

Punto de partida visual común para todo el equipo. Hay dos formas de verlo:

1. **Lienzo interactivo (recomendado):** [PlanBe — Diseño base](https://claude.ai/artifact/J1yN9q4M7vh6Q1jmn9qEZY).
   Tiene dos páginas: *Sistema de diseño* (guía de estilo y componentes) y *Pantallas* (flujos Must en escritorio y móvil,
   enlazados entre sí con el botón ▶ Play). El enlace solo funciona si su propietario lo ha compartido con tu cuenta.
2. **Fuentes en este repositorio:** [`canvas/`](canvas) contiene cada pantalla como un fichero `.dc.html` y el índice
   `canvas.json`. Son la copia de referencia del lienzo y sirven para revisar cambios en un PR; se renderizan dentro del lienzo,
   no abriéndolos directamente en el navegador.

## Pantallas

| Fichero | Pantalla | Issue que la implementa |
|---|---|---|
| `Main.dc.html` | Guía de estilo: color, tipografía, botones, formularios, estados, espaciado | [0.2] #33 |
| `Navbar.dc.html`, `Footer.dc.html` | Navegación y pie compartidos | [0.1] #32 |
| `MeetupCard.dc.html` | Tarjeta de quedada | [0.2] #33, [3.2] #51 |
| `Home.dc.html`, `HomeMovil.dc.html` | Inicio pública | [0.5] #36 |
| `Login.dc.html`, `Registro.dc.html` | Entrar y crear cuenta | [1.2] #40, [1.3] #41 |
| `Quedadas.dc.html` | Listado con filtros y paginación | [3.2] #51 |
| `Detalle.dc.html`, `DetalleMovil.dc.html` | Detalle, unirse, ubicación, comentarios | [3.3] #52, [4.1] #60, [7.1] #77 |
| `Crear.dc.html` | Crear quedada | [3.4] #53 |
| `MisQuedadas.dc.html` | Participo / Organizo | [3.6] #55, [4.4] #63 |
| `Perfil.dc.html` | Perfil, intereses y privacidad | [2.1] #44, [2.3] #46 |

## Del diseño al código

- Los colores, radios y fuentes ya están en [`src/app/globals.css`](../../src/app/globals.css) como variables de shadcn/ui más
  `brand`, `success`, `warning` y `ink-soft`. Usa las clases (`bg-primary`, `text-ink-soft`, `bg-success-soft`…), nunca hexadecimales sueltos.
- Los componentes de composición (`PageContainer`, `PageHeader`, `EmptyState`, `ErrorState`, `LoadingState`, `ConfirmDialog`,
  `UserAvatar`, `MeetupCard`) están en `src/components/`. Ver [`CONVENTIONS.md`](../../CONVENTIONS.md).
- El texto de las pantallas es de ejemplo (Lleida, nombres inventados). Los datos reales vienen siempre del backend.
