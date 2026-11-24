# PlanBe — Design

Fuente visual: [`docs/design/`](docs/design/README.md). Implementación: [`src/app/globals.css`](src/app/globals.css).

## Principios

- **Cercano:** tono directo y en tú. Las quedadas son lo importante; la interfaz acompaña.
- **Claro:** fecha, lugar y plazas siempre visibles. Un estado, un color, un texto.
- **Un solo acento:** el tomate marca la acción principal de cada pantalla. Nada más compite con él.

## Tokens

| Rol | Clase Tailwind | Claro | Oscuro | Uso |
|---|---|---|---|---|
| Marca | `bg-brand` / `text-brand` | `#E4572E` | `#F08A5D` | Logo e ilustración, nunca texto pequeño |
| Primario | `bg-primary` | `#C2410C` | `#F08A5D` | Botón principal y enlaces (5,2:1) |
| Acento | `bg-accent` | `#FDEBE4` | `#3A2219` | Selección, chips activos, fecha de tarjeta |
| Texto | `text-foreground` | `#16181D` | `#F3F2EF` | Texto principal |
| Texto secundario | `text-ink-soft` | `#4A4F5A` | `#C9CBD1` | Metadatos, descripciones |
| Apagado | `text-muted-foreground` | `#6B7080` | `#A3A7B0` | Ayudas, pies (4,9:1) |
| Superficie | `bg-muted` | `#F5F5F3` | `#2A2D34` | Bandas, filtros, estados vacíos |
| Borde | `border` | `#E7E5E0` | `#2A2D34` | Separadores y tarjetas |
| Éxito | `bg-success-soft` | `#E0F2F0` / `#0F766E` | | Abierta, Confirmado |
| Aviso | `bg-warning-soft` | `#FEF3C7` / `#B45309` | | Completa, Lista de espera |
| Peligro | `bg-destructive-soft` | `#FDE8E8` / `#B91C1C` | | Cancelada, errores |

## Tipografía

- Títulos: **Space Grotesk** 600–700 (`font-display`, aplicado por defecto a `h1`–`h3`).
- Texto: **Inter** 400–600 (`font-sans`).
- Escala: Display 56–72 · H1 36–40 · H2 24–32 · H3 18–20 · Body 16 · Small 14 · Label 12 mayúsculas.

## Forma

- Radio: 10 px en botones e inputs (`rounded-lg`), 16 px en tarjetas (`rounded-xl`), píldora en estados (`rounded-full`).
- Alturas: botón 40 px (`default`), 48 px (`lg`); inputs de formulario 44–48 px; objetivo táctil mínimo 44 px.
- Espaciado en múltiplos de 4: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72.
- Sombra solo al pasar por encima de tarjetas enlazables.
