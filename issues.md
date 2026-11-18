# PlanBe Frontend — Backlog de issues

> Documento de trabajo para crear las issues del frontend de **PlanBe** en GitHub.
> Se basa en el estado real de [`PlanBeBackend`](../PlanBeBackend) (`docs/PLAN.md`, `README.md`) y en el estado actual de [`PlanBeFrontend`](../PlanBeFrontend).

---

## 1. Situación actual

### 1.1 Qué hay ya en el backend

El backend de PlanBe está prácticamente completo. Según `docs/PLAN.md` y el `README.md`:

| Iteración | Funcionalidad | Estado |
|---|---|---|
| 0 | Registro / login base | Implementado |
| 1 | Perfil e intereses | Implementado |
| 2 | Gestión de quedadas (`Meetup`, `Location`, categorías, visibilidad) | Implementado |
| 3 | Participación, aforo y lista de espera | Implementado |
| 4 | Invitaciones | Implementado |
| 5 | Grupos y membresías | Implementado |
| 6 | Comentarios | Implementado |
| 7 | Valoraciones | Implementado |
| 8 | Notificaciones | Implementado |
| 9 | Recomendaciones | Implementado |
| 10 | Moderación (bloqueos y reportes) | Implementado |
| 11 | Recurrencia de quedadas | Implementado |
| 12 | Chat REST y WebSocket/STOMP | Implementado |
| 13 | Correcciones de feedback | En curso |

El backend expone recursos HAL en `http://127.0.0.1:8080`:

- `/identity`, `/users`, `/interests`
- `/meetups`, `/participations`, `/invitations`
- `/groups`, `/memberships`
- `/comments`, `/reviews`, `/notifications`
- `/blocks`, `/reports`, `/chatMessages`
- Catálogos: `/categories`, `/meetupStatuses`, `/participationStatuses`, `/invitationStatuses`, `/membershipStatuses`, `/notificationTypes`, `/reportStatuses`

### 1.2 Qué hay ya en el frontend

`PlanBeFrontend` es todavía el **template de React** adaptado a Next.js. Tiene:

- `src/api/halClient.ts`: cliente HAL básico (`getHal`, `postHal`, `mergeHal`, `mergeHalArray`).
- `src/api/userApi.ts`: servicio de usuarios (`UsersService`).
- `src/api/recordApi.ts`, `src/types/record.ts`, `src/app/records/...`: **restos del template** que no pertenecen a PlanBe.
- `src/app/login/page.tsx`: login con Basic Auth y cookie `MYAPP_AUTH`.
- `src/app/users/register/page.tsx`: registro.
- `src/app/users/[id]/page.tsx`: página de usuario con un formulario de “Records” del template.
- `src/components/ui/`: `avatar`, `button`, `card`, `input`, `label`, `textarea`.
- `tests/e2e/`: un único `login.feature` con Cucumber + Playwright.

Por tanto, el trabajo del frontend consiste en **sustituir el dominio Record por el dominio PlanBe** y construir las pantallas que consumen los recursos que ya existen en el backend.

### 1.3 Tecnologías y para qué sirve cada una

| Tecnología | Uso en PlanBe Frontend |
|---|---|
| **Next.js 16 (App Router)** | Rutas (`src/app/...`), layouts, páginas Server/Client, metadata, carga de datos y navegación. En Next.js 16 los `params` de páginas servidor se resuelven con `await props.params`. |
| **React 19** | Componentes, estado (`useState`, `useEffect`), hooks, composición de UI y formularios. |
| **shadcn/ui** | Componentes accesibles copiados al proyecto (`src/components/ui`). No es una dependencia opaca: el código es nuestro y se puede adaptar. |
| **shadcn skill** | Permite que un agente genere o actualice componentes shadcn/ui siguiendo la documentación oficial y el registro del proyecto (`components.json`). |
| **GitHub Template (`react-template`)** | Estructura de referencia: cliente HAL, `AuthProvider`, cookies de Basic Auth, patrones de páginas y BDD con Cucumber + Playwright. Ya está clonado como `PlanBeFrontend`. |
| **Impeccable** | Revisión y mejora de la calidad visual: jerarquía, espaciado, tipografía, color, estados y consistencia del design system. Se usa junto a shadcn/ui y Tailwind. |
| **Cucumber + Playwright** | Tests E2E que describen los flujos de usuario en `.feature` y los ejecutan contra el frontend y el backend reales. |

### 1.4 Reglas del frontend (ya definidas en `PlanBeFrontend/AGENTS.md`)

- Comunicación con el backend siempre a través de `src/api/halClient.ts` usando HAL (`Accept: application/hal+json`).
- Tipos en `src/types/<entity>.ts` con la forma `<Entity> = <Entity>Entity & Resource`.
- Servicios en `src/api/<entity>Api.ts`, inyectando un `AuthProvider`.
- Server Components para lectura; Client Components (`"use client"`) para formularios y mutaciones con `react-hook-form` + shadcn/ui.
- Autenticación unificada: `serverAuthProvider` en servidor y `clientAuthProvider()` en cliente, leyendo la cookie `MYAPP_AUTH`.
- Cada flujo importante debe tener su `.feature` en `tests/e2e/` y sus steps en `tests/e2e/steps/`.

---

## 2. Convenciones de estas issues

### 2.1 Títulos

- Epic: `[N] Nombre del epic`
- Sub-issue: `[N.M] Nombre de la sub-issue`

El número `N` coincide con el requisito funcional de `docs/PLAN.md` cuando sea posible (`[2]` = RF-2, `[3]` = RF-3, etc.).

### 2.2 Labels

Crear en GitHub, como mínimo:

- `epic`
- `frontend`
- `priority: must`
- `priority: should`
- `priority: could`
- `priority: won't`
- `area: base`
- `area: auth`
- `area: profile`
- `area: meetups`
- `area: participation`
- `area: groups`
- `area: location`
- `area: comments`
- `area: reviews`
- `area: recommendations`
- `area: notifications`
- `area: moderation`
- `area: chat`
- `area: quality`

### 2.3 Milestones

- `It.0 – Base del frontend`
- `It.1 – Autenticación y perfil`
- `It.2 – Quedadas`
- `It.3 – Participación y lista de espera`
- `It.4 – Invitaciones`
- `It.5 – Grupos y membresías`
- `It.6 – Comentarios`
- `It.7 – Valoraciones`
- `It.8 – Notificaciones`
- `It.9 – Recomendaciones`
- `It.10 – Moderación`
- `It.11 – Recurrencia`
- `It.12 – Chat`
- `It.13 – Calidad y entrega`

### 2.4 Formato del cuerpo de cada issue

Cada epic debe llevar:

```md
**Requisitos:** RF-X (docs/PLAN.md)

Descripción breve de la funcionalidad.

**Sub-issues**
- [ ] [N.M] Título de la sub-issue
```

Y cada sub-issue:

```md
**Requisitos:** RF-X.Y (docs/PLAN.md)
**Epic:** [N] Nombre del epic
**Labels:** frontend, priority: must, area: ...
**Milestone:** It.X – Nombre

**Contexto**
...

**Tareas**
- [ ] ...

**Criterios de aceptación**
- [ ] ...

**Ficheros previstos**
- `src/...`

**Endpoints**
- `GET /...`
```

### 2.5 Definition of Done común

Una issue se considera terminada cuando:

- [ ] La pantalla o componente funciona contra el backend real en `http://127.0.0.1:8080`.
- [ ] Usa los tipos y el servicio HAL correspondientes; no hay `fetch` sueltos en componentes.
- [ ] Tiene estados de carga, error y vacío.
- [ ] Es usable con teclado y tiene etiquetas accesibles.
- [ ] Se ve correctamente en móvil y escritorio.
- [ ] Pasa `npm run lint` y `npm run build`.
- [ ] Si el flujo es Must, tiene un `.feature` E2E que pasa con `npm run test:e2e:ci`.
- [ ] No quedan referencias al dominio `Record` del template en el código tocado.

---

## 3. Resumen de epics

| Epic | Requisitos | Prioridad | Milestone | Depende de |
|---|---|---|---|---|
| [0] Base de la aplicación y sistema de diseño | RNF-1..RNF-7 / `AGENTS.md` | must | It.0 | — |
| [1] Autenticación y cuenta | RF-1 | must | It.1 | [0] |
| [2] Perfil de usuario | RF-2 | must | It.1 | [1] |
| [3] Quedadas | RF-3 | must | It.2 | [1], [2], [6] |
| [4] Participación e invitaciones | RF-4 | must | It.3 / It.4 | [3] |
| [5] Grupos y membresías | RF-5 | should | It.5 | [1], [3] |
| [6] Ubicación | RF-6 | must | It.2 | [3] |
| [7] Comentarios | RF-7 | should | It.6 | [3], [4] |
| [8] Valoraciones | RF-8 | could | It.7 | [3], [4] |
| [9] Recomendaciones | RF-9 | could | It.9 | [2], [3] |
| [10] Notificaciones | RF-10 | could | It.8 | [3], [4], [5] |
| [11] Moderación | RF-11 | could | It.10 | [1], [3], [7] |
| [12] Chat de quedada | RF-12 | won't (v1) / could | It.12 | [4] |
| [13] Calidad, accesibilidad y entrega | RNF-6 / `sdd-bdd-verifier` | must | It.13 | todos |

---

## 4. Epics y sub-issues

# EPIC [0] Base de la aplicación y sistema de diseño

**Título:** `[0] Base de la aplicación y sistema de diseño`

**Labels:** `epic`, `frontend`, `priority: must`, `area: base`

**Milestone:** `It.0 – Base del frontend`

**Requisitos:** RNF-1..RNF-7 (docs/PLAN.md) y `PlanBeFrontend/AGENTS.md`

**Descripción**

Dejar de ser el template de React y convertirse en la base de PlanBe: layout, navegación, design system con shadcn/ui e Impeccable, cliente HAL completo y estados globales de carga/error. Sin esta base, el resto de issues duplicarían trabajo.

**Sub-issues**

- [ ] [0.1] Rebranding y layout global de PlanBe
- [ ] [0.2] Sistema de diseño con shadcn/ui e Impeccable
- [ ] [0.3] Ampliar el cliente HAL (PUT/PATCH/DELETE, `text/uri-list`, errores y paginación)
- [ ] [0.4] Guards de navegación y sesión
- [ ] [0.5] Home pública con quedadas destacadas
- [ ] [0.6] Limpiar los restos del template (`Record`)

**Criterios de aceptación del epic**

- [ ] La aplicación se llama PlanBe en metadata, navbar y home.
- [ ] La navbar muestra enlaces según el rol y el estado de sesión.
- [ ] Existe una paleta, tipografía y componentes base documentados.
- [ ] El cliente HAL permite todas las operaciones que necesitan las issues siguientes.
- [ ] No queda ninguna página, tipo o servicio de `Record` en el frontend.

---

### [0.1] Rebranding y layout global de PlanBe

**Requisitos:** RNF-1 (docs/PLAN.md)
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: base`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

El layout actual usa el logo de Next.js, el título “Create Next App” y enlaces del template. Hay que sustituirlo por la identidad de PlanBe y una estructura común para todas las páginas.

**Tareas**

- [ ] Cambiar `metadata` en `src/app/layout.tsx` (`title: "PlanBe"`, descripción).
- [ ] Crear un logo/texto de marca y un footer sencillo.
- [ ] Rehacer `src/app/components/navbar.tsx` con enlaces: Inicio, Quedadas, Grupos, Mis quedadas, Perfil.
- [ ] Mostrar/ocultar enlaces según `user.roles` (`ROLE_USER`, `ROLE_ADMIN`).
- [ ] Crear un contenedor de página reutilizable (`PageContainer`) con ancho máximo y padding.
- [ ] Adaptar `Loginbar` para mostrar avatar, nombre y menú de cuenta.
- [ ] Revisar `globals.css` y los tokens de color para que el modo claro/oscuro sea coherente.

**Criterios de aceptación**

- [ ] Ninguna página muestra “Next.js” ni “Template”.
- [ ] La navbar es la misma en todas las páginas.
- [ ] En móvil la navegación sigue siendo usable.

**Ficheros previstos**

- `src/app/layout.tsx`
- `src/app/components/navbar.tsx`
- `src/app/components/loginbar.tsx`
- `src/app/globals.css`

---

### [0.2] Sistema de diseño con shadcn/ui e Impeccable

**Requisitos:** RNF-1 (docs/PLAN.md)
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: base`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

Solo están instalados `avatar`, `button`, `card`, `input`, `label` y `textarea`. PlanBe necesita más componentes y una guía visual consistente. Se usarán shadcn/ui (código propio en `src/components/ui`) e Impeccable para revisar jerarquía, espaciado, color y estados.

**Tareas**

- [ ] Añadir los componentes shadcn/ui necesarios con la shadcn skill: `badge`, `select`, `dialog`, `dropdown-menu`, `tabs`, `separator`, `skeleton`, `sonner` (toast), `form`, `checkbox`, `switch`, `calendar`, `popover`, `alert`, `table`, `pagination`, `sheet`.
- [ ] Definir tokens semánticos en `globals.css`: marca, superficies, texto, éxito, aviso, peligro.
- [ ] Documentar en `CONVENTIONS.md` cuándo usar cada componente y qué variantes existen.
- [ ] Crear componentes de composición: `PageHeader`, `EmptyState`, `ErrorState`, `LoadingState`, `ConfirmDialog`, `UserAvatar`, `MeetupCard`.
- [ ] Pasar una revisión con Impeccable y anotar los cambios aplicados.

**Criterios de aceptación**

- [ ] Los componentes nuevos compilan y se usan en al menos una pantalla.
- [ ] Hay contraste suficiente en modo claro y oscuro.
- [ ] Los formularios muestran errores de validación de forma consistente.
- [ ] No se copian estilos ad hoc si existe un componente o token.

**Ficheros previstos**

- `src/components/ui/*`
- `src/components/common/*`
- `src/app/globals.css`
- `CONVENTIONS.md`

---

### [0.3] Ampliar el cliente HAL (PUT/PATCH/DELETE, `text/uri-list`, errores y paginación)

**Requisitos:** RNF-1, RNF-4 (docs/PLAN.md)
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: base`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

`src/api/halClient.ts` solo tiene `getHal` y `postHal`. PlanBe necesita actualizar recursos, borrar, gestionar asociaciones (`PUT /users/{id}/interests` con `Content-Type: text/uri-list`) y leer páginas HAL (`_embedded`, `page`).

**Tareas**

- [ ] Añadir `putHal`, `patchHal` y `deleteHal`.
- [ ] Añadir `putUriList`/`patchUriList` para asociaciones.
- [ ] Unificar el tratamiento de errores: leer `message`/`errors` del backend y lanzar un `ApiError` con `status` y mensaje.
- [ ] Añadir helpers de paginación: `getPage`, `getEmbedded`, `getNextPage`.
- [ ] Añadir `followLink(resource, rel)` para navegar por enlaces HAL.
- [ ] Añadir tests unitarios o de integración del cliente si se decide incluir Vitest.

**Criterios de aceptación**

- [ ] Un 400 del backend muestra el mensaje de validación al usuario.
- [ ] Se pueden hacer las operaciones CRUD de todas las entidades sin `fetch` manual.
- [ ] Las listas paginadas pueden cargar la página siguiente.

**Ficheros previstos**

- `src/api/halClient.ts`
- `src/types/hal.ts`
- `src/lib/errors.ts`

**Endpoints de referencia**

- Cualquier recurso HAL del backend.

---

### [0.4] Guards de navegación y sesión

**Requisitos:** RF-1.2 (docs/PLAN.md)
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: auth`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

El template no protege páginas. Las pantallas de perfil, creación de quedadas, grupos y moderación deben redirigir a login si no hay sesión.

**Tareas**

- [ ] Revisar `AuthProvider` y `useAuth()` para exponer `user`, `loading` y `setUser`.
- [ ] Crear un componente `RequireAuth` para Client Components.
- [ ] Crear un helper `requireUser()` para Server Components que redirija a `/login`.
- [ ] Redirigir a `/login?next=<ruta>` y volver a la ruta original tras el login.
- [ ] Mostrar `401`/`403` con una página de error amigable.
- [ ] Ocultar acciones no permitidas según rol.

**Criterios de aceptación**

- [ ] Sin sesión, `/users/[id]`, `/meetups/new` y `/groups/new` redirigen a login.
- [ ] Tras el login se vuelve a la ruta solicitada.
- [ ] Un usuario normal no ve el panel de admin.

**Ficheros previstos**

- `src/app/components/authentication.tsx`
- `src/lib/authProvider.ts`
- `src/components/common/RequireAuth.tsx`
- `src/app/login/page.tsx`

---

### [0.5] Home pública con quedadas destacadas

**Requisitos:** RF-3.4, RF-3.5 (docs/PLAN.md)
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: base`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

La home actual es la página de bienvenida del template. Debe explicar PlanBe y mostrar quedadas públicas próximas para que un usuario anónimo vea valor desde el primer momento.

**Tareas**

- [ ] Crear un hero con el mensaje de PlanBe y CTA “Explorar quedadas” / “Crear cuenta”.
- [ ] Consumir `/meetups/search/findVisibleMeetups` y mostrar las próximas 6 quedadas con `MeetupCard`.
- [ ] Añadir estados de carga, vacío y error.
- [ ] Enlazar cada tarjeta a `/meetups/[id]`.
- [ ] Si hay sesión, mostrar un bloque “Recomendadas para ti” (puede quedar para [9.2]).

**Criterios de aceptación**

- [ ] Un usuario anónimo ve quedadas públicas sin iniciar sesión.
- [ ] La home funciona con el backend vacío.
- [ ] La home es responsive.

**Ficheros previstos**

- `src/app/page.tsx`
- `src/components/meetups/MeetupCard.tsx`

**Endpoints**

- `GET /meetups/search/findVisibleMeetups`

---

### [0.6] Limpiar los restos del template (`Record`)

**Requisitos:** RNF-1 (docs/PLAN.md) / `AGENTS.md` del frontend
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: base`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

El frontend conserva `recordApi.ts`, `types/record.ts`, `app/records/[id]/page.tsx` y un formulario de Records dentro del perfil de usuario. PlanBe no usa `Record`; el backend lo sustituye por `Meetup`.

**Tareas**

- [ ] Eliminar `src/api/recordApi.ts`.
- [ ] Eliminar `src/types/record.ts`.
- [ ] Eliminar `src/app/records/`.
- [ ] Quitar el formulario y el listado de Records de `src/app/users/[id]/page.tsx`.
- [ ] Sustituir el enlace “Users” del navbar por enlaces de PlanBe.
- [ ] Buscar referencias a `Record`, `record` y `records` y eliminarlas.

**Criterios de aceptación**

- [ ] `npm run build` pasa sin referencias a `Record`.
- [ ] No queda ninguna ruta `/records`.
- [ ] El perfil de usuario ya no muestra “Add New Record”.

**Ficheros previstos**

- `src/api/recordApi.ts`
- `src/types/record.ts`
- `src/app/records/`
- `src/app/users/[id]/page.tsx`
- `src/app/components/navbar.tsx`

---

# EPIC [1] Autenticación y cuenta

**Título:** `[1] Autenticación y cuenta`

**Labels:** `epic`, `frontend`, `priority: must`, `area: auth`

**Milestone:** `It.1 – Autenticación y perfil`

**Requisitos:** RF-1 (docs/PLAN.md)

**Descripción**

Consolidar el registro, login, logout y cambio de contraseña usando `GET /identity` y la cookie `MYAPP_AUTH`. El template ya tiene una base, pero hay que adaptarla a PlanBe y eliminar el flujo de Records.

**Sub-issues**

- [ ] [1.1] Tipos y servicio de autenticación
- [ ] [1.2] Registro de usuario
- [ ] [1.3] Login, logout y sesión persistente
- [ ] [1.4] Cambio de contraseña (Should)

**Criterios de aceptación del epic**

- [ ] Un usuario puede registrarse, entrar, recargar la página y seguir autenticado.
- [ ] El logout borra la cookie y redirige a la home.
- [ ] Los errores de credenciales se muestran sin romper la aplicación.

---

### [1.1] Tipos y servicio de autenticación

**Requisitos:** RF-1.1, RF-1.2 (docs/PLAN.md)
**Epic:** [1] Autenticación y cuenta
**Labels:** `frontend`, `priority: must`, `area: auth`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

`src/types/user.ts` y `src/api/userApi.ts` son del template. Hay que ampliarlos con los campos de PlanBe y añadir `getCurrentUser()` basado en `/identity`.

**Tareas**

- [ ] Definir `UserEntity` con `id`, `username`, `email`, `displayName`, `bio`, `avatarUrl`, `city`, `showPersonalData`, `birthDate?`, `age?`, `gender?`, `interests?`, `authorities?`.
- [ ] Definir `User = UserEntity & Resource`.
- [ ] Implementar `getCurrentUser()`, `getUserById()`, `getUsers()`, `createUser()`, `updateUser()`.
- [ ] Implementar `changePassword()`.
- [ ] Tipar los errores de validación del backend.

**Criterios de aceptación**

- [ ] El tipo `User` refleja los campos reales del backend.
- [ ] `getCurrentUser()` devuelve `null` si no hay cookie.
- [ ] No hay `any` en el servicio.

**Ficheros previstos**

- `src/types/user.ts`
- `src/api/userApi.ts`

**Endpoints**

- `GET /identity`
- `GET /users/{id}`
- `POST /users`
- `PATCH /users/{id}`

---

### [1.2] Registro de usuario

**Requisitos:** RF-1.1 (docs/PLAN.md)
**Epic:** [1] Autenticación y cuenta
**Labels:** `frontend`, `priority: must`, `area: auth`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

La página de registro existe, pero valida la contraseña con mínimo 6 y el mensaje dice “Minimum 8 characters”. El backend exige mínimo 8 y email único.

**Tareas**

- [ ] Corregir la validación a mínimo 8 caracteres.
- [ ] Validar username obligatorio y sin espacios.
- [ ] Validar email con el mismo criterio del backend.
- [ ] Mostrar el mensaje de error del backend si el email ya existe.
- [ ] Tras registrar, redirigir a `/login` con un mensaje de éxito.
- [ ] Añadir un enlace “Ya tengo cuenta”.

**Criterios de aceptación**

- [ ] Un registro válido crea el usuario y redirige a login.
- [ ] Un email duplicado muestra un error legible.
- [ ] Una contraseña de 7 caracteres se rechaza en cliente.

**Ficheros previstos**

- `src/app/users/register/page.tsx`
- `src/types/user.ts`
- `src/api/userApi.ts`

**Endpoints**

- `POST /users`

---

### [1.3] Login, logout y sesión persistente

**Requisitos:** RF-1.2 (docs/PLAN.md)
**Epic:** [1] Autenticación y cuenta
**Labels:** `frontend`, `priority: must`, `area: auth`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

El login actual guarda la cookie y llama a `getCurrentUser()`, pero no hay logout explícito ni redirección de retorno. La cookie se crea con `secure: true`, lo que puede fallar en `http://localhost`.

**Tareas**

- [ ] Revisar la creación de la cookie `MYAPP_AUTH` para que funcione en local y en producción.
- [ ] Implementar logout en `Loginbar` (borrar cookie, limpiar `user`, redirigir a `/`).
- [ ] Soportar `?next=` para volver a la página solicitada.
- [ ] Mostrar errores de credenciales sin dejar la cookie.
- [ ] Evitar parpadeos de “no autenticado” durante la carga inicial.

**Criterios de aceptación**

- [ ] Login correcto redirige al perfil o a `next`.
- [ ] Login incorrecto borra la cookie y muestra “Credenciales incorrectas”.
- [ ] Al recargar, la sesión se mantiene.
- [ ] Logout deja la navbar en estado anónimo.

**Ficheros previstos**

- `src/app/login/page.tsx`
- `src/app/components/loginbar.tsx`
- `src/app/components/authentication.tsx`
- `src/lib/authProvider.ts`

**Endpoints**

- `GET /identity`

---

### [1.4] Cambio de contraseña (Should)

**Requisitos:** RF-1.3 (docs/PLAN.md)
**Epic:** [1] Autenticación y cuenta
**Labels:** `frontend`, `priority: should`, `area: auth`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

El backend tiene `ChangePassword.feature`. El frontend debe permitir cambiar la contraseña desde el perfil sin pedir la contraseña actual si el backend no lo exige, o pidiéndola si se decide añadir esa validación.

**Tareas**

- [ ] Añadir una sección “Seguridad” en el perfil.
- [ ] Formulario con nueva contraseña y confirmación.
- [ ] Validar mínimo 8 y coincidencia.
- [ ] Enviar `PATCH /users/{id}` con `password`.
- [ ] Cerrar sesión o mantenerla según el comportamiento del backend.

**Criterios de aceptación**

- [ ] El cambio de contraseña funciona contra el backend.
- [ ] Los errores de validación se muestran.
- [ ] La contraseña nunca se muestra en claro.

**Ficheros previstos**

- `src/app/users/[id]/page.tsx`
- `src/api/userApi.ts`

**Endpoints**

- `PATCH /users/{id}`

---

# EPIC [2] Perfil de usuario

**Título:** `[2] Perfil de usuario`

**Labels:** `epic`, `frontend`, `priority: must`, `area: profile`

**Milestone:** `It.1 – Autenticación y perfil`

**Requisitos:** RF-2 (docs/PLAN.md)

**Descripción**

Ampliar `User` con datos de perfil, intereses y privacidad. El backend ya implementa los campos; el frontend debe permitir verlos y editarlos, respetando que `birthDate` y `gender` solo se muestran si `showPersonalData` es `true` o si es el propio usuario/ADMIN.

**Sub-issues**

- [ ] [2.1] Campos básicos del perfil
- [ ] [2.2] Fecha de nacimiento, género y edad mínima
- [ ] [2.3] Privacidad de datos personales
- [ ] [2.4] Catálogo de intereses
- [ ] [2.5] Asignar intereses al usuario

**Criterios de aceptación del epic**

- [ ] El usuario puede ver y editar su perfil.
- [ ] Los datos personales se ocultan a terceros por defecto.
- [ ] El usuario puede seleccionar intereses del catálogo.
- [ ] La edad mínima se valida en cliente y backend.

---

### [2.1] Campos básicos del perfil

**Requisitos:** RF-2.1, RF-2.3 (docs/PLAN.md)
**Epic:** [2] Perfil de usuario
**Labels:** `frontend`, `priority: must`, `area: profile`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

El perfil actual muestra username, email y un formulario de Records. Hay que sustituirlo por los campos reales: `displayName`, `bio`, `avatarUrl` y `city`. Solo el propio usuario o un ADMIN puede editar.

**Tareas**

- [ ] Rehacer `src/app/users/[id]/page.tsx` como perfil de PlanBe.
- [ ] Mostrar avatar, `displayName`, username, ciudad y bio.
- [ ] Añadir formulario de edición con `react-hook-form` y shadcn/ui.
- [ ] Permitir editar `displayName`, `bio`, `avatarUrl` y `city`.
- [ ] Mostrar el botón “Editar” solo si `user.id === id` o el usuario es ADMIN.
- [ ] Mostrar los intereses del usuario como badges.
- [ ] Mostrar un `EmptyState` si el perfil está incompleto.

**Criterios de aceptación**

- [ ] El propietario puede guardar cambios y verlos reflejados.
- [ ] Un tercero ve el perfil en modo lectura.
- [ ] `avatarUrl` inválida muestra un fallback.
- [ ] El formulario valida longitudes máximas (`displayName` 50, `bio` 500, `city` 100).

**Ficheros previstos**

- `src/app/users/[id]/page.tsx`
- `src/components/profile/ProfileForm.tsx`
- `src/components/profile/ProfileCard.tsx`
- `src/types/user.ts`
- `src/api/userApi.ts`

**Endpoints**

- `GET /users/{id}`
- `PATCH /users/{id}`

---

### [2.2] Fecha de nacimiento, género y edad mínima

**Requisitos:** RF-2.1, RF-2.4 (docs/PLAN.md)
**Epic:** [2] Perfil de usuario
**Labels:** `frontend`, `priority: must`, `area: profile`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

El backend acepta `birthDate` (`LocalDate`) y `gender` (`MALE`, `FEMALE`, `NON_BINARY`, `UNDISCLOSED`), valida edad mínima 18 y deriva `age`. Esos campos son `WRITE_ONLY` en la entidad y se devuelven en `personalData` solo si son visibles.

**Tareas**

- [ ] Añadir selector de fecha de nacimiento.
- [ ] Añadir selector de género con la opción “Prefiero no decirlo”.
- [ ] Mostrar la edad calculada cuando esté disponible.
- [ ] Validar en cliente que la edad sea >= 18 antes de enviar.
- [ ] Mostrar el error del backend si la fecha no es válida.
- [ ] Ocultar estos campos a terceros si `showPersonalData` es `false`.

**Criterios de aceptación**

- [ ] Un usuario de 17 años no puede guardar el perfil.
- [ ] El género se guarda y se recupera correctamente.
- [ ] La edad se muestra solo cuando corresponde.

**Ficheros previstos**

- `src/app/users/[id]/page.tsx`
- `src/components/profile/ProfileForm.tsx`
- `src/types/user.ts`

**Endpoints**

- `PATCH /users/{id}`

---

### [2.3] Privacidad de datos personales

**Requisitos:** RF-2.5, RNF-7 (docs/PLAN.md)
**Epic:** [2] Perfil de usuario
**Labels:** `frontend`, `priority: must`, `area: profile`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

`showPersonalData` controla si `birthDate` y `gender` se serializan para otros usuarios. El frontend debe explicarlo y permitir cambiarlo.

**Tareas**

- [ ] Añadir un `Switch` “Mostrar fecha de nacimiento y género en mi perfil público”.
- [ ] Explicar qué datos se comparten y con quién.
- [ ] Reflejar el estado actual en el formulario.
- [ ] Enviar `showPersonalData` en el `PATCH`.
- [ ] Revisar que un tercero no vea los datos si está desactivado.

**Criterios de aceptación**

- [ ] El switch persiste el valor.
- [ ] Con el switch apagado, el perfil público no muestra fecha ni género.
- [ ] Con el switch encendido, sí los muestra.
- [ ] El propio usuario siempre ve sus datos.

**Ficheros previstos**

- `src/components/profile/PrivacySettings.tsx`
- `src/app/users/[id]/page.tsx`
- `src/types/user.ts`

**Endpoints**

- `PATCH /users/{id}`

---

### [2.4] Catálogo de intereses

**Requisitos:** RF-2.2 (docs/PLAN.md)
**Epic:** [2] Perfil de usuario
**Labels:** `frontend`, `priority: must`, `area: profile`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

`Interest` es un catálogo gestionado por ADMIN (`/interests`). Los usuarios solo lo leen; el ADMIN puede crear, editar y borrar. Cada interés puede tener `name` y `category`.

**Tareas**

- [ ] Crear `src/types/interest.ts` y `src/api/interestApi.ts`.
- [ ] Implementar `getInterests()`, `searchInterests(text)`, `createInterest()`, `updateInterest()`, `deleteInterest()`.
- [ ] Crear una página `/admin/interests` solo para ADMIN.
- [ ] Mostrar el catálogo en una tabla con búsqueda.
- [ ] Permitir crear/editar/borrar intereses desde el panel.
- [ ] Enlazar el panel desde la navbar de admin.

**Criterios de aceptación**

- [ ] Cualquier usuario puede leer intereses.
- [ ] Solo ADMIN ve y usa el panel de gestión.
- [ ] El buscador usa `findByNameContainingIgnoreCase`.
- [ ] Las operaciones de escritura muestran errores del backend.

**Ficheros previstos**

- `src/types/interest.ts`
- `src/api/interestApi.ts`
- `src/app/admin/interests/page.tsx`
- `src/components/interests/InterestTable.tsx`

**Endpoints**

- `GET /interests`
- `GET /interests/search/findByNameContainingIgnoreCase?text=...`
- `POST /interests`
- `PATCH /interests/{id}`
- `DELETE /interests/{id}`

---

### [2.5] Asignar intereses al usuario

**Requisitos:** RF-2.2 (docs/PLAN.md)
**Epic:** [2] Perfil de usuario
**Labels:** `frontend`, `priority: must`, `area: profile`
**Milestone:** `It.1 – Autenticación y perfil`

**Contexto**

`User.interests` es una asociación N:M expuesta como `/users/{id}/interests`. Se debe poder seleccionar y quitar intereses desde el perfil.

**Tareas**

- [ ] Añadir un selector múltiple de intereses en el perfil.
- [ ] Cargar el catálogo con `GET /interests`.
- [ ] Cargar los intereses actuales desde `GET /users/{id}/interests`.
- [ ] Guardar con `PUT /users/{id}/interests` y `Content-Type: text/uri-list`.
- [ ] Permitir quitar un interés con `DELETE /users/{id}/interests/{interestId}`.
- [ ] Mostrar los intereses seleccionados como badges.
- [ ] Manejar el caso de lista vacía.

**Criterios de aceptación**

- [ ] El usuario puede añadir y quitar intereses.
- [ ] Los cambios persisten al recargar.
- [ ] Un tercero solo ve los intereses, no puede editarlos.
- [ ] La UI no permite duplicados.

**Ficheros previstos**

- `src/components/profile/InterestPicker.tsx`
- `src/app/users/[id]/page.tsx`
- `src/api/userApi.ts`
- `src/api/halClient.ts`

**Endpoints**

- `GET /users/{id}/interests`
- `PUT /users/{id}/interests`
- `DELETE /users/{id}/interests/{interestId}`

---

# EPIC [3] Quedadas

**Título:** `[3] Quedadas`

**Labels:** `epic`, `frontend`, `priority: must`, `area: meetups`

**Milestone:** `It.2 – Quedadas`

**Requisitos:** RF-3 (docs/PLAN.md)

**Descripción**

Construir el núcleo de PlanBe: listar, buscar, ver, crear, editar y cancelar quedadas. El backend ya aplica visibilidad y validaciones; el frontend debe consumir los recursos y mostrar solo las acciones permitidas.

**Sub-issues**

- [ ] [3.1] Tipos y servicio HAL de `Meetup`, `Location` y `Category`
- [ ] [3.2] Listado y búsqueda de quedadas
- [ ] [3.3] Detalle de quedada
- [ ] [3.4] Crear quedada
- [ ] [3.5] Editar, cancelar y eliminar quedada
- [ ] [3.6] Mis quedadas
- [ ] [3.7] Restricciones de edad y género (Could)
- [ ] [3.8] Precio por persona (Could)
- [ ] [3.9] Recurrencia de quedadas (Could)

**Criterios de aceptación del epic**

- [ ] Se pueden listar y filtrar quedadas.
- [ ] Se puede crear una quedada válida y verla en el listado.
- [ ] El organizador puede editarla y cancelarla.
- [ ] Un usuario sin permisos no ve acciones de edición.

---

### [3.1] Tipos y servicio HAL de `Meetup`, `Location` y `Category`

**Requisitos:** RF-3.1, RF-6 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

Hay que modelar en TypeScript los campos reales de `Meetup` y `Location`, y los catálogos que se envían como texto (`category`, `status`).

**Tareas**

- [ ] Crear `src/types/location.ts` con `name`, `address`, `city`, `latitude`, `longitude`.
- [ ] Crear `src/types/meetup.ts` con todos los campos de `Meetup`.
- [ ] Crear `src/types/category.ts` y `src/api/categoryApi.ts`.
- [ ] Crear `src/api/meetupApi.ts` con `getMeetups`, `getMeetupById`, `createMeetup`, `updateMeetup`, `deleteMeetup`, `searchByCategory`, `searchByCity`, `searchByStartDate`, `searchByOrganizer`, `getRecommended`.
- [ ] Tipar `visibility` (`PUBLIC`, `PRIVATE`, `GROUP`), `status` (`DRAFT`, `OPEN`, `FULL`, `CANCELLED`, `FINISHED`), `recurrence` (`NONE`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`) y `targetGender`.
- [ ] Documentar que `category` y `status` se envían como string.

**Criterios de aceptación**

- [ ] El tipo `Meetup` incluye `organizer`, `group`, `tags`, `location`, `price`, `minAge`, `maxAge`, `targetGender`, `recurrence` y `recurrenceEnd`.
- [ ] El servicio cubre todas las búsquedas del `README.md`.
- [ ] No hay `any` en los tipos.

**Ficheros previstos**

- `src/types/meetup.ts`
- `src/types/location.ts`
- `src/types/category.ts`
- `src/api/meetupApi.ts`
- `src/api/categoryApi.ts`

**Endpoints**

- `GET /meetups`
- `GET /meetups/{id}`
- `POST /meetups`
- `PATCH /meetups/{id}`
- `DELETE /meetups/{id}`
- `GET /categories`

---

### [3.2] Listado y búsqueda de quedadas

**Requisitos:** RF-3.4, RF-3.5 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

La pantalla principal de descubrimiento. Debe mostrar solo lo que el backend devuelve (ya filtra por visibilidad) y permitir filtrar por categoría, ciudad, fecha e interés.

**Tareas**

- [ ] Crear `/meetups` con listado paginado.
- [ ] Añadir filtros: categoría, ciudad, fecha desde, interés.
- [ ] Sincronizar filtros con la URL (`searchParams`) para poder compartir enlaces.
- [ ] Usar `MeetupCard` con título, fecha, ciudad, categoría, aforo y estado.
- [ ] Añadir estados de carga, vacío y error.
- [ ] Añadir botón “Crear quedada” si hay sesión.
- [ ] Mostrar un mensaje claro si no hay resultados.

**Criterios de aceptación**

- [ ] Los filtros llaman a las búsquedas correctas del backend.
- [ ] La URL conserva los filtros al recargar.
- [ ] Las quedadas privadas no aparecen a usuarios sin permiso.
- [ ] La lista es responsive y paginada.

**Ficheros previstos**

- `src/app/meetups/page.tsx`
- `src/components/meetups/MeetupCard.tsx`
- `src/components/meetups/MeetupFilters.tsx`
- `src/api/meetupApi.ts`

**Endpoints**

- `GET /meetups`
- `GET /meetups/search/findByCategoryAndVisibility?category=...`
- `GET /meetups/search/findByCityAndVisibility?city=...`
- `GET /meetups/search/findByStartDateAfterAndVisibility?startDate=...`

---

### [3.3] Detalle de quedada

**Requisitos:** RF-3.1, RF-3.4 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

La página `/meetups/[id]` debe mostrar toda la información y servir de punto de entrada para unirse, invitar, comentar, valorar o chatear.

**Tareas**

- [ ] Crear `src/app/meetups/[id]/page.tsx`.
- [ ] Mostrar título, descripción, organizador, grupo, categoría, estado, visibilidad, fecha, aforo, ubicación y precio.
- [ ] Mostrar plazas ocupadas/libres y si está llena.
- [ ] Mostrar etiquetas/intereses.
- [ ] Renderizar acciones según permisos: unirse, abandonar, editar, cancelar, invitar, comentar.
- [ ] Añadir secciones placeholder para comentarios, valoraciones y chat.
- [ ] Manejar 403/404 con páginas amigables.

**Criterios de aceptación**

- [ ] El detalle carga con datos reales.
- [ ] Una quedada privada solo se ve si el usuario tiene acceso.
- [ ] Las acciones no permitidas no se muestran.
- [ ] La página funciona en servidor y cliente sin errores de hidratación.

**Ficheros previstos**

- `src/app/meetups/[id]/page.tsx`
- `src/components/meetups/MeetupDetail.tsx`
- `src/components/meetups/MeetupActions.tsx`

**Endpoints**

- `GET /meetups/{id}`
- `GET /users/{id}`
- `GET /groups/{id}`

---

### [3.4] Crear quedada

**Requisitos:** RF-3.1, RF-3.3 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

Formulario para crear una quedada. El backend valida `startDate` futura, `endDate > startDate` y `capacity >= 1`, y asigna el organizador autenticado.

**Tareas**

- [ ] Crear `/meetups/new` protegido.
- [ ] Formulario con título, descripción, categoría, fechas, aforo, visibilidad, estado, ubicación, etiquetas, edad/género, precio y recurrencia.
- [ ] Validar en cliente: fechas obligatorias, `endDate > startDate`, `startDate` futura, `capacity >= 1`.
- [ ] Cargar categorías desde `/categories` e intereses desde `/interests`.
- [ ] Enviar `POST /meetups` con `organizer: "/users/{id}"`.
- [ ] Redirigir al detalle de la quedada creada.
- [ ] Mostrar errores de validación del backend por campo.

**Criterios de aceptación**

- [ ] Se crea una quedada con datos mínimos.
- [ ] No se puede crear con fecha pasada.
- [ ] La quedada aparece en “Mis quedadas”.
- [ ] El formulario conserva los datos si hay error.

**Ficheros previstos**

- `src/app/meetups/new/page.tsx`
- `src/components/meetups/MeetupForm.tsx`
- `src/lib/validation.ts`

**Endpoints**

- `POST /meetups`
- `GET /categories`
- `GET /interests`

---

### [3.5] Editar, cancelar y eliminar quedada

**Requisitos:** RF-3.2, RF-3.3 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

Solo el organizador, el admin del grupo o un ADMIN pueden editar/eliminar. Cancelar una quedada cambia su estado a `CANCELLED` y el backend actualiza las participaciones.

**Tareas**

- [ ] Crear `/meetups/[id]/edit` protegido y solo visible para quien puede editar.
- [ ] Reutilizar `MeetupForm` en modo edición.
- [ ] Enviar `PATCH /meetups/{id}`.
- [ ] Añadir confirmación antes de cancelar o eliminar.
- [ ] Cambiar estado a `CANCELLED` en vez de borrar cuando el usuario elija “Cancelar”.
- [ ] Redirigir al detalle con un mensaje de éxito.
- [ ] Mostrar errores 403.

**Criterios de aceptación**

- [ ] El organizador puede editar su quedada.
- [ ] Un tercero no ve el botón de editar.
- [ ] Cancelar cambia el estado y no rompe participaciones.
- [ ] Eliminar pide confirmación.

**Ficheros previstos**

- `src/app/meetups/[id]/edit/page.tsx`
- `src/components/meetups/MeetupForm.tsx`
- `src/components/common/ConfirmDialog.tsx`

**Endpoints**

- `PATCH /meetups/{id}`
- `DELETE /meetups/{id}`

---

### [3.6] Mis quedadas

**Requisitos:** RF-3.2, RF-3.5 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

El usuario necesita una vista de las quedadas que organiza y en las que participa.

**Tareas**

- [ ] Crear `/me/meetups` protegido.
- [ ] Pestañas “Organizo” y “Participo”.
- [ ] Cargar organizadas con `findByOrganizerAndVisibility?organizerId={id}`.
- [ ] Cargar participadas con `findMyParticipations`.
- [ ] Mostrar estado de cada participación (`CONFIRMED`, `WAITING`, `CANCELLED`).
- [ ] Enlazar al detalle y a editar.
- [ ] Añadir estados vacíos diferenciados.

**Criterios de aceptación**

- [ ] Solo aparecen las quedadas del usuario.
- [ ] Se distingue una quedada organizada de una participación.
- [ ] La lista se actualiza al cancelar o abandonar.

**Ficheros previstos**

- `src/app/me/meetups/page.tsx`
- `src/components/meetups/MeetupCard.tsx`
- `src/api/meetupApi.ts`
- `src/api/participationApi.ts`

**Endpoints**

- `GET /meetups/search/findByOrganizerAndVisibility?organizerId=...`
- `GET /participations/search/findMyParticipations`

---

### [3.7] Restricciones de edad y género (Could)

**Requisitos:** RF-3.6 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: could`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

Una quedada puede tener `minAge`, `maxAge` y `targetGender`. El backend valida al unirse; el frontend debe permitir configurarlo y mostrar la restricción.

**Tareas**

- [ ] Añadir campos `minAge`, `maxAge` y `targetGender` al formulario.
- [ ] Validar `minAge <= maxAge`.
- [ ] Mostrar la restricción en el detalle.
- [ ] Indicar al usuario si no cumple los requisitos antes de intentar unirse.
- [ ] Mostrar el error del backend si intenta unirse sin cumplirlos.

**Criterios de aceptación**

- [ ] Se puede crear una quedada con restricciones.
- [ ] El detalle explica las restricciones.
- [ ] Un usuario que no cumple ve el motivo y no puede unirse.

**Ficheros previstos**

- `src/components/meetups/MeetupForm.tsx`
- `src/components/meetups/MeetupDetail.tsx`

**Endpoints**

- `POST /meetups`
- `PATCH /meetups/{id}`

---

### [3.8] Precio por persona (Could)

**Requisitos:** RF-3.7 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: could`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

`Meetup.price` es un `BigDecimal` opcional; `null` significa gratis.

**Tareas**

- [ ] Añadir campo de precio al formulario.
- [ ] Validar que sea `>= 0`.
- [ ] Mostrar “Gratis” cuando sea `null`.
- [ ] Formatear el precio en euros.

**Criterios de aceptación**

- [ ] Una quedada sin precio muestra “Gratis”.
- [ ] Un precio negativo se rechaza en cliente.
- [ ] El precio se muestra correctamente en listado y detalle.

**Ficheros previstos**

- `src/components/meetups/MeetupForm.tsx`
- `src/components/meetups/MeetupCard.tsx`
- `src/lib/format.ts`

**Endpoints**

- `POST /meetups`
- `PATCH /meetups/{id}`

---

### [3.9] Recurrencia de quedadas (Could)

**Requisitos:** RF-3.8 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: could`, `area: meetups`
**Milestone:** `It.11 – Recurrencia`

**Contexto**

El backend soporta `recurrence` (`NONE`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`) y `recurrenceEnd`. Al finalizar una ocurrencia, el backend genera la siguiente. El frontend solo debe configurarla y mostrar la relación entre ocurrencias.

**Tareas**

- [ ] Añadir `recurrence` y `recurrenceEnd` al formulario.
- [ ] Validar que `recurrenceEnd` no sea anterior a `startDate`.
- [ ] Mostrar un badge de recurrencia en el detalle.
- [ ] Mostrar un enlace a `previousOccurrence` si existe.
- [ ] Explicar que las siguientes ocurrencias se generan automáticamente.

**Criterios de aceptación**

- [ ] Se puede crear una quedada recurrente.
- [ ] El detalle muestra la recurrencia.
- [ ] La ocurrencia anterior se enlaza correctamente.

**Ficheros previstos**

- `src/components/meetups/MeetupForm.tsx`
- `src/components/meetups/MeetupDetail.tsx`
- `src/types/meetup.ts`

**Endpoints**

- `POST /meetups`
- `PATCH /meetups/{id}`

---

# EPIC [4] Participación e invitaciones

**Título:** `[4] Participación e invitaciones`

**Labels:** `epic`, `frontend`, `priority: must`, `area: participation`

**Milestone:** `It.3 – Participación y lista de espera` / `It.4 – Invitaciones`

**Requisitos:** RF-4 (docs/PLAN.md)

**Descripción**

Permitir unirse a quedadas, gestionar la lista de espera, abandonar, invitar y aceptar/rechazar invitaciones. El backend ya controla aforo, restricciones y estados.

**Sub-issues**

- [ ] [4.1] Unirse a una quedada
- [ ] [4.2] Lista de espera
- [ ] [4.3] Abandonar una quedada
- [ ] [4.4] Mis participaciones
- [ ] [4.5] Invitaciones recibidas y enviadas
- [ ] [4.6] Aceptar o rechazar invitaciones

**Criterios de aceptación del epic**

- [ ] Un usuario puede unirse a una quedada visible.
- [ ] Si está llena, entra en lista de espera.
- [ ] Puede abandonar y su estado se actualiza.
- [ ] Puede invitar y responder invitaciones.

---

### [4.1] Unirse a una quedada

**Requisitos:** RF-4.1 (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.3 – Participación y lista de espera`

**Contexto**

Unirse crea una `Participation` con estado `CONFIRMED` o `WAITING` según el aforo. El backend valida visibilidad, capacidad y restricciones.

**Tareas**

- [ ] Crear `src/types/participation.ts` y `src/api/participationApi.ts`.
- [ ] Añadir botón “Unirme” en el detalle si hay sesión y no participa.
- [ ] Enviar `POST /participations` con `participant` y `meetup`.
- [ ] Mostrar el estado resultante (`CONFIRMED` o `WAITING`).
- [ ] Deshabilitar el botón mientras se envía.
- [ ] Mostrar errores de aforo, edad, género o visibilidad.
- [ ] Ocultar el botón si no hay sesión y mostrar “Inicia sesión para unirte”.

**Criterios de aceptación**

- [ ] Un usuario puede unirse y ve su estado.
- [ ] Al recargar, el estado persiste.
- [ ] Si la quedada está llena, el estado es `WAITING`.
- [ ] No se puede unir dos veces.

**Ficheros previstos**

- `src/types/participation.ts`
- `src/api/participationApi.ts`
- `src/components/meetups/MeetupActions.tsx`

**Endpoints**

- `POST /participations`
- `GET /participations/search/findByParticipantIdAndMeetupId?participantId=...&meetupId=...`

---

### [4.2] Lista de espera

**Requisitos:** RF-4.2 (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: should`, `area: participation`
**Milestone:** `It.3 – Participación y lista de espera`

**Contexto**

Cuando una quedada está llena, el backend crea una participación `WAITING` y promociona al primero cuando se libera una plaza. El frontend debe explicar la situación y mostrar la posición si el backend la expone.

**Tareas**

- [ ] Mostrar un aviso “Estás en lista de espera” en el detalle y en “Mis quedadas”.
- [ ] Explicar que se avisará cuando haya plaza.
- [ ] Mostrar el estado actualizado al recargar.
- [ ] Si el backend devuelve orden de llegada, mostrar la posición.
- [ ] Añadir un `Badge` de estado `WAITING`.

**Criterios de aceptación**

- [ ] Un usuario en espera entiende su situación.
- [ ] Al liberarse una plaza, el estado cambia a `CONFIRMED` tras recargar.
- [ ] La UI no promete una plaza que el backend no ha confirmado.

**Ficheros previstos**

- `src/components/meetups/MeetupActions.tsx`
- `src/app/me/meetups/page.tsx`
- `src/components/participation/ParticipationBadge.tsx`

**Endpoints**

- `GET /participations/search/findMyParticipations`

---

### [4.3] Abandonar una quedada

**Requisitos:** RF-4.4 (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.3 – Participación y lista de espera`

**Contexto**

El usuario debe poder abandonar una quedada. El backend cambia la participación a `CANCELLED` y puede promocionar a alguien de la lista de espera.

**Tareas**

- [ ] Añadir botón “Abandonar” si el usuario participa.
- [ ] Pedir confirmación.
- [ ] Enviar `PATCH /participations/{id}` con `status: "CANCELLED"` o `DELETE` según el comportamiento del backend.
- [ ] Actualizar el estado en la UI sin recargar.
- [ ] Mostrar un mensaje de éxito.
- [ ] Gestionar el error si ya no puede abandonar.

**Criterios de aceptación**

- [ ] El usuario puede abandonar y se refleja al instante.
- [ ] La plaza se libera en el backend.
- [ ] El botón desaparece tras abandonar.

**Ficheros previstos**

- `src/components/meetups/MeetupActions.tsx`
- `src/api/participationApi.ts`

**Endpoints**

- `PATCH /participations/{id}`
- `DELETE /participations/{id}`

---

### [4.4] Mis participaciones

**Requisitos:** RF-4.1, RF-4.2 (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.3 – Participación y lista de espera`

**Contexto**

El backend expone `findMyParticipations`. Es la vista natural para que el usuario siga sus quedadas.

**Tareas**

- [ ] Añadir la pestaña “Participo” en `/me/meetups`.
- [ ] Consumir `GET /participations/search/findMyParticipations`.
- [ ] Mostrar quedada, fecha, estado y acciones disponibles.
- [ ] Enlazar al detalle.
- [ ] Mostrar estados vacíos.

**Criterios de aceptación**

- [ ] Se listan todas las participaciones del usuario.
- [ ] Se distingue `CONFIRMED`, `WAITING` y `CANCELLED`.
- [ ] Se puede abandonar desde la lista.

**Ficheros previstos**

- `src/app/me/meetups/page.tsx`
- `src/components/participation/ParticipationCard.tsx`

**Endpoints**

- `GET /participations/search/findMyParticipations`

---

### [4.5] Invitaciones recibidas y enviadas

**Requisitos:** RF-4.3 (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.4 – Invitaciones`

**Contexto**

El backend tiene `Invitation` con `invitee`, `invitedBy`, `meetup` y estado `PENDING`/`ACCEPTED`/`DECLINED`. El organizador puede invitar y el invitado debe ver sus invitaciones.

**Tareas**

- [ ] Crear `src/types/invitation.ts` y `src/api/invitationApi.ts`.
- [ ] Añadir un formulario de invitación en el detalle de la quedada (solo organizador/grupo/admin).
- [ ] Buscar usuarios por username para invitar.
- [ ] Enviar `POST /invitations` con `invitee`, `invitedBy` y `meetup`.
- [ ] Crear `/me/invitations` con recibidas y enviadas.
- [ ] Mostrar estado y fecha.
- [ ] Gestionar duplicados y errores del backend.

**Criterios de aceptación**

- [ ] El organizador puede invitar a un usuario.
- [ ] El invitado ve la invitación pendiente.
- [ ] No se puede invitar dos veces a la misma persona.
- [ ] Un usuario sin permiso no ve el formulario.

**Ficheros previstos**

- `src/types/invitation.ts`
- `src/api/invitationApi.ts`
- `src/components/meetups/InviteDialog.tsx`
- `src/app/me/invitations/page.tsx`

**Endpoints**

- `POST /invitations`
- `GET /invitations`
- `GET /users/search/findByIdContaining?text=...`

---

### [4.6] Aceptar o rechazar invitaciones

**Requisitos:** RF-4.3 (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.4 – Invitaciones`

**Contexto**

Aceptar una invitación crea una `Participation`; rechazarla la marca como `DECLINED`. El backend gestiona las transiciones.

**Tareas**

- [ ] Añadir botones “Aceptar” y “Rechazar” en cada invitación pendiente.
- [ ] Enviar `PATCH /invitations/{id}` con `status: "ACCEPTED"` o `"DECLINED"`.
- [ ] Actualizar la UI tras la respuesta.
- [ ] Mostrar el estado resultante.
- [ ] Enlazar a la quedada si se acepta.
- [ ] Manejar errores de aforo o invitación caducada.

**Criterios de aceptación**

- [ ] Aceptar crea la participación y se refleja en “Mis quedadas”.
- [ ] Rechazar cambia el estado a `DECLINED`.
- [ ] Una invitación ya respondida no muestra botones.

**Ficheros previstos**

- `src/app/me/invitations/page.tsx`
- `src/components/invitations/InvitationCard.tsx`
- `src/api/invitationApi.ts`

**Endpoints**

- `PATCH /invitations/{id}`

---

# EPIC [5] Grupos y membresías

**Título:** `[5] Grupos y membresías`

**Labels:** `epic`, `frontend`, `priority: should`, `area: groups`

**Milestone:** `It.5 – Grupos y membresías`

**Requisitos:** RF-5 (docs/PLAN.md)

**Descripción**

Los grupos permiten organizar quedadas con visibilidad `GROUP` y gestionar miembros con roles `OWNER`, `ADMIN` y `MEMBER`. Es un requisito Should: se implementa después del núcleo de quedadas.

**Sub-issues**

- [ ] [5.1] Tipos y servicio de grupos y membresías
- [ ] [5.2] Listado y detalle de grupo
- [ ] [5.3] Crear y editar grupo
- [ ] [5.4] Miembros y roles
- [ ] [5.5] Solicitudes e invitaciones de grupo
- [ ] [5.6] Quedadas de grupo

**Criterios de aceptación del epic**

- [ ] Se pueden crear y consultar grupos.
- [ ] Se pueden gestionar miembros y roles.
- [ ] Un grupo puede tener quedadas con visibilidad `GROUP`.

---

### [5.1] Tipos y servicio de grupos y membresías

**Requisitos:** RF-5.1, RF-5.2 (docs/PLAN.md)
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Contexto**

Modelar `Group` y `Membership` en TypeScript y encapsular las llamadas HAL.

**Tareas**

- [ ] Crear `src/types/group.ts` con `name`, `description`, `visibility`, `avatarUrl`, `ownedBy`, `created`, `modified`.
- [ ] Crear `src/types/membership.ts` con `group`, `member`, `role`, `status`, `joinedAt`.
- [ ] Crear `src/api/groupApi.ts` y `src/api/membershipApi.ts`.
- [ ] Tipar `GroupRole` (`OWNER`, `ADMIN`, `MEMBER`) y `MembershipStatus` (`PENDING`, `ACTIVE`).
- [ ] Implementar búsquedas `findByOwnedBy` y `findByName`.

**Criterios de aceptación**

- [ ] Los tipos reflejan el backend.
- [ ] Los servicios permiten listar, crear, actualizar y borrar.
- [ ] Las búsquedas están cubiertas.

**Ficheros previstos**

- `src/types/group.ts`
- `src/types/membership.ts`
- `src/api/groupApi.ts`
- `src/api/membershipApi.ts`

**Endpoints**

- `GET /groups`
- `POST /groups`
- `GET /groups/{id}`
- `PATCH /groups/{id}`
- `DELETE /groups/{id}`
- `GET /groups/search/findByOwnedBy?user=...`
- `GET /groups/search/findByName?name=...`

---

### [5.2] Listado y detalle de grupo

**Requisitos:** RF-5.1 (docs/PLAN.md)
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Contexto**

Los grupos públicos deben poder descubrirse; los privados solo los ven sus miembros y admins.

**Tareas**

- [ ] Crear `/groups` con listado paginado.
- [ ] Crear `/groups/[id]` con nombre, descripción, visibilidad, avatar y miembros.
- [ ] Mostrar un badge de visibilidad.
- [ ] Añadir buscador por nombre.
- [ ] Mostrar acciones según rol.
- [ ] Añadir estados de carga, vacío y error.

**Criterios de aceptación**

- [ ] Un anónimo ve grupos públicos.
- [ ] Un miembro ve su grupo privado.
- [ ] El detalle muestra los miembros activos.

**Ficheros previstos**

- `src/app/groups/page.tsx`
- `src/app/groups/[id]/page.tsx`
- `src/components/groups/GroupCard.tsx`

**Endpoints**

- `GET /groups`
- `GET /groups/{id}`
- `GET /memberships/search/findByGroupId?groupId=...`

---

### [5.3] Crear y editar grupo

**Requisitos:** RF-5.1 (docs/PLAN.md)
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Contexto**

Cualquier usuario autenticado puede crear un grupo y se convierte en `OWNER`. Solo el propietario o un admin del grupo puede editarlo.

**Tareas**

- [ ] Crear `/groups/new` protegido.
- [ ] Formulario con nombre, descripción, visibilidad y avatar.
- [ ] Validar nombre obligatorio.
- [ ] Enviar `POST /groups` con `ownedBy: "/users/{id}"`.
- [ ] Crear la membership `OWNER`/`ACTIVE` si el backend no lo hace automáticamente.
- [ ] Crear `/groups/[id]/edit` para propietario/admin.
- [ ] Redirigir al detalle tras guardar.

**Criterios de aceptación**

- [ ] Se crea el grupo y el creador queda como `OWNER`.
- [ ] Solo los gestores ven “Editar”.
- [ ] Los errores de validación se muestran.

**Ficheros previstos**

- `src/app/groups/new/page.tsx`
- `src/app/groups/[id]/edit/page.tsx`
- `src/components/groups/GroupForm.tsx`

**Endpoints**

- `POST /groups`
- `PATCH /groups/{id}`
- `POST /memberships`

---

### [5.4] Miembros y roles

**Requisitos:** RF-5.2 (docs/PLAN.md)
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Contexto**

La membership tiene rol (`OWNER`, `ADMIN`, `MEMBER`) y estado (`PENDING`, `ACTIVE`). El `OWNER` puede nombrar admins y gestionar miembros.

**Tareas**

- [ ] Listar miembros en el detalle del grupo.
- [ ] Mostrar rol y estado con badges.
- [ ] Permitir al `OWNER` cambiar rol de un miembro.
- [ ] Permitir expulsar miembros (si el backend lo soporta).
- [ ] Impedir que el `OWNER` se quite a sí mismo el rol sin transferir la propiedad.
- [ ] Mostrar acciones solo a `OWNER`/`ADMIN`.

**Criterios de aceptación**

- [ ] Se ven todos los miembros y sus roles.
- [ ] Un `OWNER` puede nombrar `ADMIN`.
- [ ] Un `MEMBER` no ve acciones de gestión.
- [ ] Los cambios persisten.

**Ficheros previstos**

- `src/components/groups/MemberList.tsx`
- `src/components/groups/MemberActions.tsx`
- `src/api/membershipApi.ts`

**Endpoints**

- `GET /memberships/search/findByGroupId?groupId=...`
- `PATCH /memberships/{id}`
- `DELETE /memberships/{id}`

---

### [5.5] Solicitudes e invitaciones de grupo

**Requisitos:** RF-5.3 (docs/PLAN.md)
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Contexto**

Un usuario puede solicitar unirse a un grupo o ser invitado. La membership queda `PENDING` hasta que un gestor la activa.

**Tareas**

- [ ] Añadir botón “Solicitar unirme” en grupos públicos.
- [ ] Crear `POST /memberships` con `status: "PENDING"`.
- [ ] Mostrar el estado “Pendiente” al usuario.
- [ ] Añadir una bandeja de solicitudes para gestores.
- [ ] Permitir aceptar (`ACTIVE`) o rechazar (borrar membership).
- [ ] Añadir invitaciones de grupo si el backend las expone.
- [ ] Gestionar duplicados.

**Criterios de aceptación**

- [ ] Un usuario puede solicitar unirse.
- [ ] El gestor ve y resuelve la solicitud.
- [ ] El estado del usuario se actualiza.
- [ ] No se puede solicitar dos veces.

**Ficheros previstos**

- `src/app/groups/[id]/page.tsx`
- `src/app/groups/[id]/requests/page.tsx`
- `src/components/groups/JoinGroupButton.tsx`
- `src/api/membershipApi.ts`

**Endpoints**

- `POST /memberships`
- `GET /memberships/search/findByGroupId?groupId=...`
- `PATCH /memberships/{id}`
- `DELETE /memberships/{id}`

---

### [5.6] Quedadas de grupo

**Requisitos:** RF-5.4 (docs/PLAN.md)
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Contexto**

Una quedada con visibilidad `GROUP` pertenece a un grupo y solo la ven sus miembros. El formulario de creación debe permitir elegir grupo.

**Tareas**

- [ ] Añadir selector de grupo en `MeetupForm` cuando la visibilidad sea `GROUP`.
- [ ] Cargar los grupos donde el usuario es `OWNER`/`ADMIN`.
- [ ] Enviar `group: "/groups/{id}"`.
- [ ] Mostrar el grupo en el detalle de la quedada.
- [ ] Listar las quedadas del grupo en su detalle.
- [ ] Validar que un usuario no cree una quedada GROUP en un grupo que no gestiona.

**Criterios de aceptación**

- [ ] Se crea una quedada `GROUP` asociada a un grupo.
- [ ] Solo los miembros del grupo la ven.
- [ ] El detalle del grupo lista sus quedadas.

**Ficheros previstos**

- `src/components/meetups/MeetupForm.tsx`
- `src/app/groups/[id]/page.tsx`
- `src/api/groupApi.ts`

**Endpoints**

- `POST /meetups`
- `GET /meetups/search/findByGroupAndVisibility?group=...` (si está disponible)

---

# EPIC [6] Ubicación

**Título:** `[6] Ubicación`

**Labels:** `epic`, `frontend`, `priority: must`, `area: location`

**Milestone:** `It.2 – Quedadas`

**Requisitos:** RF-6 (docs/PLAN.md)

**Descripción**

`Location` es un `@Embeddable` con `name`, `address`, `city`, `latitude` y `longitude`. El frontend debe capturarla en el formulario de quedada y mostrarla de forma clara.

**Sub-issues**

- [ ] [6.1] Componente de ubicación y visualización
- [ ] [6.2] Mapa y geolocalización (Could)

**Criterios de aceptación del epic**

- [ ] El formulario permite introducir una ubicación completa.
- [ ] El detalle muestra nombre, dirección y ciudad.
- [ ] Si hay coordenadas, se ofrece un enlace o mapa.

---

### [6.1] Componente de ubicación y visualización

**Requisitos:** RF-6 (docs/PLAN.md)
**Epic:** [6] Ubicación
**Labels:** `frontend`, `priority: must`, `area: location`
**Milestone:** `It.2 – Quedadas`

**Contexto**

La ubicación se envía como objeto embebido dentro de `Meetup`.

**Tareas**

- [ ] Crear `src/types/location.ts`.
- [ ] Crear `LocationFields` para el formulario: nombre, dirección, ciudad, latitud, longitud.
- [ ] Validar campos obligatorios según el backend.
- [ ] Crear `LocationDisplay` para el detalle.
- [ ] Añadir un enlace a Google Maps/OpenStreetMap si hay coordenadas.
- [ ] Formatear la ciudad para filtros.

**Criterios de aceptación**

- [ ] La ubicación se guarda y se recupera.
- [ ] El detalle muestra la dirección completa.
- [ ] Si no hay coordenadas, no se muestra un mapa roto.

**Ficheros previstos**

- `src/types/location.ts`
- `src/components/locations/LocationFields.tsx`
- `src/components/locations/LocationDisplay.tsx`

**Endpoints**

- `POST /meetups`
- `PATCH /meetups/{id}`

---

### [6.2] Mapa y geolocalización (Could)

**Requisitos:** RF-6 (docs/PLAN.md)
**Epic:** [6] Ubicación
**Labels:** `frontend`, `priority: could`, `area: location`
**Milestone:** `It.2 – Quedadas`

**Contexto**

`latitude` y `longitude` permiten mostrar un mapa. No es imprescindible para el MVP.

**Tareas**

- [ ] Elegir una librería de mapas compatible con React 19 y Next.js 16 (Leaflet o similar).
- [ ] Mostrar un mapa en el detalle si hay coordenadas.
- [ ] Añadir un botón “Usar mi ubicación” en el formulario.
- [ ] Rellenar latitud/longitud con la geolocalización del navegador.
- [ ] Manejar permisos denegados.

**Criterios de aceptación**

- [ ] El mapa solo se carga cuando hay coordenadas.
- [ ] La geolocalización es opcional.
- [ ] No se rompe el renderizado en servidor.

**Ficheros previstos**

- `src/components/locations/LocationMap.tsx`
- `src/components/locations/LocationFields.tsx`

---

# EPIC [7] Comentarios

**Título:** `[7] Comentarios`

**Labels:** `epic`, `frontend`, `priority: should`, `area: comments`

**Milestone:** `It.6 – Comentarios`

**Requisitos:** RF-7 (docs/PLAN.md)

**Descripción**

Los usuarios que pueden ver una quedada pueden comentar. El autor o un ADMIN puede borrar. El backend filtra por visibilidad de la quedada.

**Sub-issues**

- [ ] [7.1] Listado y creación de comentarios
- [ ] [7.2] Borrado y control de acceso

**Criterios de aceptación del epic**

- [ ] Se pueden ver y crear comentarios en una quedada visible.
- [ ] El autor y el ADMIN pueden borrar.
- [ ] Un usuario sin acceso no ve comentarios.

---

### [7.1] Listado y creación de comentarios

**Requisitos:** RF-7 (docs/PLAN.md)
**Epic:** [7] Comentarios
**Labels:** `frontend`, `priority: should`, `area: comments`
**Milestone:** `It.6 – Comentarios`

**Contexto**

`Comment` tiene `text`, `author`, `meetup` y `created`. La sección de comentarios vivirá en el detalle de la quedada.

**Tareas**

- [ ] Crear `src/types/comment.ts` y `src/api/commentApi.ts`.
- [ ] Crear `CommentSection` en `/meetups/[id]`.
- [ ] Listar comentarios con `findByMeetupId`.
- [ ] Añadir formulario de nuevo comentario.
- [ ] Enviar `POST /comments` con `text`, `author` y `meetup`.
- [ ] Mostrar autor, fecha y texto.
- [ ] Añadir estados de carga, vacío y error.

**Criterios de aceptación**

- [ ] Se listan los comentarios de la quedada.
- [ ] Un usuario autenticado puede comentar.
- [ ] El comentario aparece sin recargar.
- [ ] Un anónimo solo lee.

**Ficheros previstos**

- `src/types/comment.ts`
- `src/api/commentApi.ts`
- `src/components/comments/CommentSection.tsx`
- `src/components/comments/CommentForm.tsx`

**Endpoints**

- `GET /comments/search/findByMeetupId?meetupId=...`
- `POST /comments`

---

### [7.2] Borrado y control de acceso

**Requisitos:** RF-7 (docs/PLAN.md)
**Epic:** [7] Comentarios
**Labels:** `frontend`, `priority: should`, `area: comments`
**Milestone:** `It.6 – Comentarios`

**Contexto**

Solo el autor o un ADMIN pueden borrar un comentario. El backend lo valida.

**Tareas**

- [ ] Mostrar el botón “Borrar” solo al autor o ADMIN.
- [ ] Pedir confirmación.
- [ ] Enviar `DELETE /comments/{id}`.
- [ ] Quitar el comentario de la lista tras la respuesta.
- [ ] Mostrar un error si el backend lo deniega.
- [ ] Gestionar comentarios de quedadas canceladas/finalizadas según `allowsComments`.

**Criterios de aceptación**

- [ ] El autor puede borrar su comentario.
- [ ] Un tercero no ve el botón.
- [ ] Un ADMIN puede borrar cualquier comentario.
- [ ] El borrado persiste al recargar.

**Ficheros previstos**

- `src/components/comments/CommentCard.tsx`
- `src/api/commentApi.ts`

**Endpoints**

- `DELETE /comments/{id}`

---

# EPIC [8] Valoraciones

**Título:** `[8] Valoraciones`

**Labels:** `epic`, `frontend`, `priority: could`, `area: reviews`

**Milestone:** `It.7 – Valoraciones`

**Requisitos:** RF-8 (docs/PLAN.md)

**Descripción**

Solo participantes `CONFIRMED` de una quedada `FINISHED` pueden valorar (1–5 + texto), una vez por usuario y quedada. La media del organizador se muestra en su perfil.

**Sub-issues**

- [ ] [8.1] Tipos y servicio de valoraciones
- [ ] [8.2] Crear y editar valoración
- [ ] [8.3] Listado y media del organizador

**Criterios de aceptación del epic**

- [ ] Un participante confirmado puede valorar una quedada finalizada.
- [ ] No se puede valorar dos veces.
- [ ] La media del organizador se muestra en su perfil.

---

### [8.1] Tipos y servicio de valoraciones

**Requisitos:** RF-8 (docs/PLAN.md)
**Epic:** [8] Valoraciones
**Labels:** `frontend`, `priority: could`, `area: reviews`
**Milestone:** `It.7 – Valoraciones`

**Contexto**

`Review` tiene `rating`, `text`, `reviewer`, `meetup` y `created`. El backend expone búsquedas por quedada, por reviewer y media del organizador.

**Tareas**

- [ ] Crear `src/types/review.ts`.
- [ ] Crear `src/api/reviewApi.ts` con `getReviewsByMeetup`, `getMyReview`, `createReview`, `updateReview`, `deleteReview`, `getAverageByOrganizer`.
- [ ] Tipar `AverageRating` según la respuesta del backend.
- [ ] Documentar que solo se puede crear si la quedada está `FINISHED` y la participación `CONFIRMED`.

**Criterios de aceptación**

- [ ] El servicio cubre las búsquedas del `README.md`.
- [ ] Los tipos incluyen `rating` y `text`.
- [ ] La media se puede consultar por organizador.

**Ficheros previstos**

- `src/types/review.ts`
- `src/api/reviewApi.ts`

**Endpoints**

- `GET /reviews/search/findByMeetupId?meetupId=...`
- `GET /reviews/search/findByReviewerIdAndMeetupId?reviewerId=...&meetupId=...`
- `GET /reviews/search/findAverageRatingByOrganizer?organizerId=...`
- `POST /reviews`
- `PATCH /reviews/{id}`
- `DELETE /reviews/{id}`

---

### [8.2] Crear y editar valoración

**Requisitos:** RF-8 (docs/PLAN.md)
**Epic:** [8] Valoraciones
**Labels:** `frontend`, `priority: could`, `area: reviews`
**Milestone:** `It.7 – Valoraciones`

**Contexto**

La valoración solo aparece cuando la quedada ha finalizado y el usuario participó. Hay que evitar mostrar el formulario en casos no permitidos.

**Tareas**

- [ ] Crear `ReviewForm` con estrellas (1–5) y texto.
- [ ] Mostrarlo solo si la quedada está `FINISHED` y la participación es `CONFIRMED`.
- [ ] Cargar la valoración existente si ya existe.
- [ ] Enviar `POST /reviews` o `PATCH /reviews/{id}`.
- [ ] Mostrar la valoración propia en el detalle.
- [ ] Gestionar el error “ya valorada”.

**Criterios de aceptación**

- [ ] Se puede crear una valoración válida.
- [ ] Se puede editar la propia.
- [ ] Un usuario no participante no ve el formulario.
- [ ] Una quedada no finalizada no permite valorar.

**Ficheros previstos**

- `src/components/reviews/ReviewForm.tsx`
- `src/components/reviews/StarRating.tsx`
- `src/app/meetups/[id]/page.tsx`

**Endpoints**

- `POST /reviews`
- `PATCH /reviews/{id}`

---

### [8.3] Listado y media del organizador

**Requisitos:** RF-8 (docs/PLAN.md)
**Epic:** [8] Valoraciones
**Labels:** `frontend`, `priority: could`, `area: reviews`
**Milestone:** `It.7 – Valoraciones`

**Contexto**

La media de valoraciones del organizador es visible en su perfil. Las valoraciones también se listan en el detalle de la quedada.

**Tareas**

- [ ] Listar valoraciones en `/meetups/[id]`.
- [ ] Mostrar media y número de valoraciones en `/users/[id]`.
- [ ] Añadir `StarRating` en modo lectura.
- [ ] Mostrar un estado vacío si no hay valoraciones.
- [ ] Enlazar cada valoración a su autor y quedada.

**Criterios de aceptación**

- [ ] El perfil muestra la media del organizador.
- [ ] El detalle lista las valoraciones.
- [ ] La media se actualiza al crear una valoración.

**Ficheros previstos**

- `src/components/reviews/ReviewList.tsx`
- `src/components/reviews/RatingSummary.tsx`
- `src/app/users/[id]/page.tsx`

**Endpoints**

- `GET /reviews/search/findByMeetupId?meetupId=...`
- `GET /reviews/search/findAverageRatingByOrganizer?organizerId=...`

---

# EPIC [9] Recomendaciones

**Título:** `[9] Recomendaciones`

**Labels:** `epic`, `frontend`, `priority: could`, `area: recommendations`

**Milestone:** `It.9 – Recomendaciones`

**Requisitos:** RF-9 (docs/PLAN.md)

**Descripción**

El backend expone `/meetups/search/recommended`: quedadas públicas y abiertas cuya categoría o intereses coinciden con los del usuario, en su ciudad.

**Sub-issues**

- [ ] [9.1] Servicio y tipos de recomendaciones
- [ ] [9.2] Sección “Recomendadas para ti”

**Criterios de aceptación del epic**

- [ ] Un usuario autenticado ve recomendaciones personalizadas.
- [ ] Si no hay recomendaciones, se muestra un estado vacío útil.
- [ ] La sección no aparece para anónimos o sin intereses.

---

### [9.1] Servicio y tipos de recomendaciones

**Requisitos:** RF-9 (docs/PLAN.md)
**Epic:** [9] Recomendaciones
**Labels:** `frontend`, `priority: could`, `area: recommendations`
**Milestone:** `It.9 – Recomendaciones`

**Contexto**

La búsqueda `recommended` ya existe en el backend y devuelve quedadas filtradas por visibilidad.

**Tareas**

- [ ] Añadir `getRecommendedMeetups()` a `meetupApi.ts`.
- [ ] Tipar la respuesta como `Meetup[]`.
- [ ] Manejar el caso de usuario sin intereses o sin ciudad.
- [ ] Añadir un test manual con dos usuarios de distinta ciudad.

**Criterios de aceptación**

- [ ] El servicio devuelve las recomendaciones del backend.
- [ ] No se llama si no hay sesión.
- [ ] Los errores se manejan sin romper la home.

**Ficheros previstos**

- `src/api/meetupApi.ts`
- `src/types/meetup.ts`

**Endpoints**

- `GET /meetups/search/recommended`

---

### [9.2] Sección “Recomendadas para ti”

**Requisitos:** RF-9 (docs/PLAN.md)
**Epic:** [9] Recomendaciones
**Labels:** `frontend`, `priority: could`, `area: recommendations`
**Milestone:** `It.9 – Recomendaciones`

**Contexto**

Las recomendaciones deben tener un espacio visible en la home o en el perfil.

**Tareas**

- [ ] Añadir un bloque “Recomendadas para ti” en la home autenticada.
- [ ] Mostrar hasta 6 quedadas con `MeetupCard`.
- [ ] Añadir un CTA “Ver todas”.
- [ ] Mostrar un estado vacío con enlace a “Completa tus intereses”.
- [ ] No mostrar el bloque a anónimos.

**Criterios de aceptación**

- [ ] El bloque aparece solo con sesión.
- [ ] Las tarjetas enlazan al detalle.
- [ ] El estado vacío invita a completar el perfil.
- [ ] La home sigue funcionando si la llamada falla.

**Ficheros previstos**

- `src/app/page.tsx`
- `src/components/meetups/RecommendedMeetups.tsx`

**Endpoints**

- `GET /meetups/search/recommended`

---

# EPIC [10] Notificaciones

**Título:** `[10] Notificaciones`

**Labels:** `epic`, `frontend`, `priority: could`, `area: notifications`

**Milestone:** `It.8 – Notificaciones`

**Requisitos:** RF-10 (docs/PLAN.md)

**Descripción**

El backend crea notificaciones desde los handlers (invitación, quedada cancelada/modificada, plaza liberada, solicitud de grupo). Cada usuario solo ve las suyas y puede marcarlas como leídas.

**Sub-issues**

- [ ] [10.1] Tipos y servicio de notificaciones
- [ ] [10.2] Campana y contador de no leídas
- [ ] [10.3] Bandeja y marcado como leídas

**Criterios de aceptación del epic**

- [ ] El usuario ve sus notificaciones.
- [ ] El contador de no leídas es correcto.
- [ ] Puede marcar una o todas como leídas.
- [ ] El enlace lleva a la entidad correspondiente.

---

### [10.1] Tipos y servicio de notificaciones

**Requisitos:** RF-10 (docs/PLAN.md)
**Epic:** [10] Notificaciones
**Labels:** `frontend`, `priority: could`, `area: notifications`
**Milestone:** `It.8 – Notificaciones`

**Contexto**

`Notification` tiene `type`, `message`, `targetUri`, `read` y `created`.

**Tareas**

- [ ] Crear `src/types/notification.ts`.
- [ ] Crear `src/api/notificationApi.ts` con `getNotifications`, `getUnread`, `markAsRead`, `markAllAsRead`.
- [ ] Tipar `NotificationType` (`INVITATION`, `MEETUP_CANCELLED`, `MEETUP_UPDATED`, `SPOT_FREED`, `GROUP_REQUEST`).
- [ ] Documentar que `targetUri` es una URL HAL y debe usarse con `followLink`.

**Criterios de aceptación**

- [ ] El servicio lista y marca notificaciones.
- [ ] Los tipos reflejan el backend.
- [ ] `targetUri` se resuelve correctamente.

**Ficheros previstos**

- `src/types/notification.ts`
- `src/api/notificationApi.ts`

**Endpoints**

- `GET /notifications`
- `GET /notifications/search/findUnread`
- `PATCH /notifications/{id}`

---

### [10.2] Campana y contador de no leídas

**Requisitos:** RF-10 (docs/PLAN.md)
**Epic:** [10] Notificaciones
**Labels:** `frontend`, `priority: could`, `area: notifications`
**Milestone:** `It.8 – Notificaciones`

**Contexto**

La navbar debe mostrar una campana con el número de notificaciones no leídas.

**Tareas**

- [ ] Añadir una campana en `Loginbar` para usuarios autenticados.
- [ ] Consultar `findUnread` al cargar y al recuperar el foco.
- [ ] Mostrar un badge con el número.
- [ ] Abrir un `Popover`/`Sheet` con las últimas notificaciones.
- [ ] Enlazar “Ver todas” a `/me/notifications`.
- [ ] Ocultar la campana si no hay sesión.

**Criterios de aceptación**

- [ ] El contador coincide con las no leídas.
- [ ] Al marcar como leída, el contador baja.
- [ ] La campana es accesible por teclado.
- [ ] No hay errores si el backend devuelve 0.

**Ficheros previstos**

- `src/app/components/loginbar.tsx`
- `src/components/notifications/NotificationBell.tsx`

**Endpoints**

- `GET /notifications/search/findUnread`

---

### [10.3] Bandeja y marcado como leídas

**Requisitos:** RF-10 (docs/PLAN.md)
**Epic:** [10] Notificaciones
**Labels:** `frontend`, `priority: could`, `area: notifications`
**Milestone:** `It.8 – Notificaciones`

**Contexto**

La bandeja completa permite gestionar las notificaciones.

**Tareas**

- [ ] Crear `/me/notifications` protegido.
- [ ] Listar notificaciones paginadas.
- [ ] Distinguir leídas/no leídas visualmente.
- [ ] Permitir marcar una como leída.
- [ ] Permitir marcar todas como leídas.
- [ ] Enlazar `targetUri` a la entidad correspondiente.
- [ ] Añadir estado vacío.

**Criterios de aceptación**

- [ ] Se listan todas las notificaciones del usuario.
- [ ] Marcar como leída persiste.
- [ ] El enlace navega al recurso correcto.
- [ ] Un usuario no ve notificaciones de otro.

**Ficheros previstos**

- `src/app/me/notifications/page.tsx`
- `src/components/notifications/NotificationList.tsx`

**Endpoints**

- `GET /notifications`
- `PATCH /notifications/{id}`

---

# EPIC [11] Moderación

**Título:** `[11] Moderación`

**Labels:** `epic`, `frontend`, `priority: could`, `area: moderation`

**Milestone:** `It.10 – Moderación`

**Requisitos:** RF-11 (docs/PLAN.md)

**Descripción**

Bloqueos entre usuarios y reportes de usuarios/quedadas/comentarios. El ADMIN gestiona los reportes con estados `OPEN`, `RESOLVED`, `DISMISSED`.

**Sub-issues**

- [ ] [11.1] Bloqueos entre usuarios
- [ ] [11.2] Crear reportes
- [ ] [11.3] Panel de moderación para ADMIN

**Criterios de aceptación del epic**

- [ ] Un usuario puede bloquear a otro.
- [ ] Un usuario puede reportar contenido.
- [ ] Un ADMIN ve y resuelve reportes.
- [ ] Las acciones respetan los permisos del backend.

---

### [11.1] Bloqueos entre usuarios

**Requisitos:** RF-11 (docs/PLAN.md)
**Epic:** [11] Moderación
**Labels:** `frontend`, `priority: could`, `area: moderation`
**Milestone:** `It.10 – Moderación`

**Contexto**

`Block` relaciona `blocker` y `blocked`. Un usuario bloqueado no puede invitar ni aparecer en quedadas del blocker.

**Tareas**

- [ ] Crear `src/types/block.ts` y `src/api/blockApi.ts`.
- [ ] Añadir “Bloquear” en el perfil de otro usuario.
- [ ] Pedir confirmación y explicar el efecto.
- [ ] Enviar `POST /blocks` con `blocker` y `blocked`.
- [ ] Crear `/me/blocks` para ver y desbloquear.
- [ ] Enviar `DELETE /blocks/{id}` al desbloquear.
- [ ] Ocultar el botón si ya está bloqueado.

**Criterios de aceptación**

- [ ] Se puede bloquear y desbloquear.
- [ ] El bloqueo persiste.
- [ ] No se puede bloquear a uno mismo.
- [ ] La UI explica las consecuencias.

**Ficheros previstos**

- `src/types/block.ts`
- `src/api/blockApi.ts`
- `src/app/me/blocks/page.tsx`
- `src/components/users/BlockButton.tsx`

**Endpoints**

- `GET /blocks`
- `POST /blocks`
- `DELETE /blocks/{id}`

---

### [11.2] Crear reportes

**Requisitos:** RF-11 (docs/PLAN.md)
**Epic:** [11] Moderación
**Labels:** `frontend`, `priority: could`, `area: moderation`
**Milestone:** `It.10 – Moderación`

**Contexto**

`Report` tiene `reporter`, `targetUri`, `reason` y `status`. El `targetUri` puede apuntar a un usuario, quedada o comentario.

**Tareas**

- [ ] Crear `src/types/report.ts` y `src/api/reportApi.ts`.
- [ ] Añadir “Reportar” en perfiles, quedadas y comentarios.
- [ ] Crear un diálogo con motivo obligatorio y máximo de caracteres.
- [ ] Enviar `POST /reports` con `targetUri` y `reason`.
- [ ] Confirmar al usuario que el reporte se ha enviado.
- [ ] No mostrar el botón en contenido propio.

**Criterios de aceptación**

- [ ] Se puede reportar cada tipo de contenido.
- [ ] El motivo es obligatorio.
- [ ] El reporte se crea con estado `OPEN`.
- [ ] No se puede reportar lo propio.

**Ficheros previstos**

- `src/types/report.ts`
- `src/api/reportApi.ts`
- `src/components/moderation/ReportDialog.tsx`

**Endpoints**

- `POST /reports`

---

### [11.3] Panel de moderación para ADMIN

**Requisitos:** RF-11 (docs/PLAN.md)
**Epic:** [11] Moderación
**Labels:** `frontend`, `priority: could`, `area: moderation`
**Milestone:** `It.10 – Moderación`

**Contexto**

Solo `ROLE_ADMIN` puede ver todos los reportes y cambiar su estado.

**Tareas**

- [ ] Crear `/admin/reports` protegido por rol.
- [ ] Listar reportes con `findByStatus?status=OPEN`.
- [ ] Mostrar reporter, target, motivo y fecha.
- [ ] Permitir cambiar estado a `RESOLVED` o `DISMISSED`.
- [ ] Añadir filtros por estado.
- [ ] Enlazar al recurso reportado.
- [ ] Añadir estado vacío.

**Criterios de aceptación**

- [ ] Solo ADMIN accede al panel.
- [ ] Se ven los reportes abiertos.
- [ ] Resolver/descartar persiste.
- [ ] Un usuario normal recibe 403.

**Ficheros previstos**

- `src/app/admin/reports/page.tsx`
- `src/components/moderation/ReportTable.tsx`

**Endpoints**

- `GET /reports/search/findByStatus?status=OPEN`
- `PATCH /reports/{id}`

---

# EPIC [12] Chat de quedada

**Título:** `[12] Chat de quedada`

**Labels:** `epic`, `frontend`, `priority: won't`, `area: chat`

**Milestone:** `It.12 – Chat`

**Requisitos:** RF-12 (docs/PLAN.md)

**Descripción**

Chat solo para participantes de una quedada. v1 con polling REST; v2 con WebSocket/STOMP. El backend ya expone ambos.

**Sub-issues**

- [ ] [12.1] Tipos y servicio REST de mensajes
- [ ] [12.2] UI de chat con polling
- [ ] [12.3] WebSocket/STOMP en tiempo real (Could)

**Criterios de aceptación del epic**

- [ ] Solo los participantes pueden ver y enviar mensajes.
- [ ] Los mensajes se ordenan por fecha.
- [ ] La UI se actualiza sin recargar la página.

---

### [12.1] Tipos y servicio REST de mensajes

**Requisitos:** RF-12 (docs/PLAN.md)
**Epic:** [12] Chat de quedada
**Labels:** `frontend`, `priority: won't`, `area: chat`
**Milestone:** `It.12 – Chat`

**Contexto**

`ChatMessage` tiene `text`, `sender`, `meetup` y `sentAt`. El backend filtra por participación.

**Tareas**

- [ ] Crear `src/types/chatMessage.ts`.
- [ ] Crear `src/api/chatApi.ts` con `getMessages(meetupId)` y `sendMessage(meetupId, text)`.
- [ ] Tipar la paginación.
- [ ] Documentar el orden `sentAt ASC, id ASC`.

**Criterios de aceptación**

- [ ] Se pueden leer y enviar mensajes por REST.
- [ ] Un no participante recibe error.
- [ ] Los tipos reflejan el backend.

**Ficheros previstos**

- `src/types/chatMessage.ts`
- `src/api/chatApi.ts`

**Endpoints**

- `GET /chatMessages/search/findByMeetupId?meetupId=...`
- `POST /chatMessages`

---

### [12.2] UI de chat con polling

**Requisitos:** RF-12 (docs/PLAN.md)
**Epic:** [12] Chat de quedada
**Labels:** `frontend`, `priority: won't`, `area: chat`
**Milestone:** `It.12 – Chat`

**Contexto**

v1 del chat sin WebSocket: se refresca cada pocos segundos.

**Tareas**

- [ ] Añadir una pestaña “Chat” en el detalle de la quedada, solo para participantes.
- [ ] Listar mensajes con autor y hora.
- [ ] Añadir un formulario de envío.
- [ ] Hacer polling cada 5–10 segundos mientras la pestaña está visible.
- [ ] Hacer scroll al último mensaje.
- [ ] Mostrar estados de carga, vacío y error.
- [ ] Limpiar el intervalo al desmontar.

**Criterios de aceptación**

- [ ] Los mensajes aparecen y se actualizan.
- [ ] El polling se detiene al salir de la página.
- [ ] No se duplican mensajes.
- [ ] Un no participante no ve el chat.

**Ficheros previstos**

- `src/components/chat/ChatPanel.tsx`
- `src/components/chat/MessageList.tsx`
- `src/components/chat/MessageForm.tsx`

**Endpoints**

- `GET /chatMessages/search/findByMeetupId?meetupId=...`
- `POST /chatMessages`

---

### [12.3] WebSocket/STOMP en tiempo real (Could)

**Requisitos:** RF-12 (docs/PLAN.md)
**Epic:** [12] Chat de quedada
**Labels:** `frontend`, `priority: could`, `area: chat`
**Milestone:** `It.12 – Chat`

**Contexto**

El backend expone STOMP en `/ws`, envío a `/app/meetups/{id}/chat` y suscripción a `/topic/meetups/{id}/chat`.

**Tareas**

- [ ] Elegir cliente STOMP compatible con React 19 (`@stomp/stompjs` + `sockjs-client`).
- [ ] Configurar la conexión con la cookie de autenticación.
- [ ] Suscribirse al topic de la quedada.
- [ ] Enviar mensajes por STOMP y actualizar la lista.
- [ ] Reconectar con backoff.
- [ ] Mantener el polling como fallback.

**Criterios de aceptación**

- [ ] Los mensajes llegan en tiempo real.
- [ ] La conexión se cierra al salir.
- [ ] Si falla el WebSocket, el chat sigue funcionando.

**Ficheros previstos**

- `src/lib/stompClient.ts`
- `src/components/chat/ChatPanel.tsx`

**Endpoints**

- `WS /ws`
- `/app/meetups/{id}/chat`
- `/topic/meetups/{id}/chat`

---

# EPIC [13] Calidad, accesibilidad y entrega

**Título:** `[13] Calidad, accesibilidad y entrega`

**Labels:** `epic`, `frontend`, `priority: must`, `area: quality`

**Milestone:** `It.13 – Calidad y entrega`

**Requisitos:** RNF-6 (docs/PLAN.md) y `skills/sdd-bdd-verifier`

**Descripción**

Cerrar el frontend con pruebas E2E de los flujos Must, accesibilidad, estados de error y un pipeline que no permita romper `main`.

**Sub-issues**

- [ ] [13.1] Cobertura E2E de los flujos Must
- [ ] [13.2] Accesibilidad y responsive
- [ ] [13.3] Errores, carga y estados vacíos
- [ ] [13.4] CI: build, lint y typecheck

**Criterios de aceptación del epic**

- [ ] Los flujos Must tienen `.feature` y pasan con `npm run test:e2e:ci`.
- [ ] La aplicación es navegable con teclado.
- [ ] No hay pantallas sin estado de error o vacío.
- [ ] El CI valida build, lint y typecheck.

---

### [13.1] Cobertura E2E de los flujos Must

**Requisitos:** RNF-6 (docs/PLAN.md)
**Epic:** [13] Calidad, accesibilidad y entrega
**Labels:** `frontend`, `priority: must`, `area: quality`
**Milestone:** `It.13 – Calidad y entrega`

**Contexto**

El template solo tiene `login.feature`. PlanBe necesita features que cubran registro, perfil, quedadas y participación.

**Tareas**

- [ ] Crear `register.feature` y sus steps.
- [ ] Crear `manage-profile.feature` (campos, privacidad, intereses).
- [ ] Crear `manage-meetup.feature` (crear, editar, cancelar).
- [ ] Crear `join-meetup.feature` (unirse, lista de espera, abandonar).
- [ ] Crear `invite-to-meetup.feature` (invitar, aceptar, rechazar).
- [ ] Reutilizar el `World` de Playwright y helpers de login.
- [ ] Ejecutar `npm run test:e2e:ci` con backend y frontend levantados.

**Criterios de aceptación**

- [ ] Todos los features Must pasan en local.
- [ ] Los steps no dependen del orden de ejecución.
- [ ] Cada feature crea sus propios datos o limpia los existentes.

**Ficheros previstos**

- `tests/e2e/*.feature`
- `tests/e2e/steps/*.steps.ts`
- `tests/e2e/support/playwright_world.ts`

---

### [13.2] Accesibilidad y responsive

**Requisitos:** RNF-6 (docs/PLAN.md)
**Epic:** [13] Calidad, accesibilidad y entrega
**Labels:** `frontend`, `priority: must`, `area: quality`
**Milestone:** `It.13 – Calidad y entrega`

**Contexto**

Las pantallas deben ser usables con teclado y en móvil. shadcn/ui ayuda, pero hay que revisar foco, etiquetas y contraste.

**Tareas**

- [ ] Revisar foco visible en todos los componentes interactivos.
- [ ] Asegurar `Label`/`aria-label` en formularios e iconos.
- [ ] Revisar contraste en modo claro y oscuro.
- [ ] Revisar navegación por teclado en navbar, diálogos y menús.
- [ ] Revisar todas las páginas a 375px, 768px y 1280px.
- [ ] Añadir `skip to content` si se mantiene la navbar fija.
- [ ] Documentar atajos o limitaciones conocidas.

**Criterios de aceptación**

- [ ] Se puede completar el flujo de registro/login solo con teclado.
- [ ] Los diálogos atrapan el foco y se cierran con Escape.
- [ ] No hay scroll horizontal en móvil.
- [ ] Las imágenes tienen `alt`.

**Ficheros previstos**

- `src/app/layout.tsx`
- `src/components/ui/*`
- `src/app/globals.css`

---

### [13.3] Errores, carga y estados vacíos

**Requisitos:** RNF-3 (docs/PLAN.md)
**Epic:** [13] Calidad, accesibilidad y entrega
**Labels:** `frontend`, `priority: must`, `area: quality`
**Milestone:** `It.13 – Calidad y entrega`

**Contexto**

Cada pantalla que llama al backend necesita estados explícitos. El backend devuelve errores de validación que deben mostrarse.

**Tareas**

- [ ] Revisar que cada página tiene `loading`, `error` y `empty`.
- [ ] Crear `app/error.tsx` y `app/not-found.tsx` con la identidad de PlanBe.
- [ ] Unificar toasts para operaciones correctas.
- [ ] Mostrar errores de validación junto al campo correspondiente.
- [ ] Evitar pantallas en blanco si falla una llamada.
- [ ] Añadir `Skeleton` en listados y detalles.

**Criterios de aceptación**

- [ ] Ninguna página se queda en blanco ante un error.
- [ ] Los errores 400 muestran el mensaje del backend.
- [ ] Los estados vacíos explican el siguiente paso.
- [ ] Los toasts no se duplican.

**Ficheros previstos**

- `src/app/error.tsx`
- `src/app/not-found.tsx`
- `src/components/common/*`
- `src/lib/errors.ts`

---

### [13.4] CI: build, lint y typecheck

**Requisitos:** RNF-6 (docs/PLAN.md)
**Epic:** [13] Calidad, accesibilidad y entrega
**Labels:** `frontend`, `priority: must`, `area: quality`
**Milestone:** `It.13 – Calidad y entrega`

**Contexto**

El repositorio frontend debe validar los cambios automáticamente antes de mezclar.

**Tareas**

- [ ] Añadir script `typecheck` (`tsc --noEmit`).
- [ ] Añadir script `ci` que ejecute `lint`, `typecheck` y `build`.
- [ ] Crear workflow de GitHub Actions para PR y `main`.
- [ ] Cachear dependencias de npm.
- [ ] Documentar en `README.md` cómo ejecutar el pipeline en local.
- [ ] Opcional: ejecutar E2E contra un backend levantado con Docker.

**Criterios de aceptación**

- [ ] Un PR con errores de TypeScript falla.
- [ ] Un PR con errores de lint falla.
- [ ] `npm run build` pasa en CI.
- [ ] El workflow tarda menos de 10 minutos.

**Ficheros previstos**

- `package.json`
- `.github/workflows/ci.yml`
- `README.md`

---

## 5. Orden recomendado de implementación

### 5.1 Camino mínimo para tener una demo (MVP)

1. [0.1] Rebranding y layout
2. [0.3] Cliente HAL completo
3. [0.6] Limpiar `Record`
4. [1.1] Tipos y servicio de autenticación
5. [1.2] Registro
6. [1.3] Login/logout
7. [2.1] Campos básicos del perfil
8. [2.5] Asignar intereses al usuario
9. [3.1] Tipos y servicio de quedadas
10. [3.2] Listado y búsqueda
11. [3.3] Detalle
12. [3.4] Crear quedada
13. [4.1] Unirse a una quedada
14. [13.1] E2E de los flujos Must

Con esto ya se puede enseñar: registro, login, perfil con intereses, listado de quedadas, creación y unirse.

### 5.2 Después del MVP

1. [2.2], [2.3], [2.4] para completar el perfil y la privacidad.
2. [3.5], [3.6] para gestión de quedadas.
3. [4.2]–[4.6] para lista de espera e invitaciones.
4. [6.1] para ubicación completa.
5. [5.x] para grupos.
6. [7.x], [8.x] para comentarios y valoraciones.
7. [10.x], [9.x] para notificaciones y recomendaciones.
8. [11.x] para moderación.
9. [12.x] para chat.
10. [13.x] para cerrar calidad.

### 5.3 Dependencias críticas

- [3] no puede empezar sin [0.3] y [1.1].
- [4] no puede empezar sin [3.3] y [3.4].
- [5.6] no puede empezar sin [5.3] y [3.4].
- [7] y [8] no pueden empezar sin [3.3].
- [10] no puede empezar sin [4.5] y [4.6].
- [11] no puede empezar sin [7] (para reportar comentarios).
- [12] no puede empezar sin [4.1] (participantes).

---

## 6. Checklist para publicar en GitHub

### 6.1 Antes de crear issues

- [ ] Crear los labels de la sección 2.2.
- [ ] Crear los milestones de la sección 2.3.
- [ ] Crear el proyecto `PlanBe Frontend` (GitHub Projects) con campos `Priority`, `Area` y `Iteration`.
- [ ] Decidir si se usa el repositorio `PlanBeFrontend` (recomendado) o el `PlanBeBackend` con label `frontend`.

### 6.2 Crear epics

Para cada sección `# EPIC [N]`:

- [ ] Crear la issue con el título `[N] Nombre`.
- [ ] Pegar el cuerpo desde `**Requisitos:**` hasta `**Criterios de aceptación del epic**`.
- [ ] Añadir labels `epic`, `frontend`, `priority: ...`, `area: ...`.
- [ ] Asignar milestone.
- [ ] Añadir al proyecto y rellenar los campos.
- [ ] Guardar el número de issue para enlazar las sub-issues.

### 6.3 Crear sub-issues

Para cada sección `### [N.M]`:

- [ ] Crear la issue con el título `[N.M] Nombre`.
- [ ] Pegar el cuerpo completo de la sub-issue.
- [ ] Añadir labels y milestone.
- [ ] Usar “Create sub-issue” desde el epic (o enlazarla manualmente).
- [ ] Sustituir `#TBD` por el número real en el checklist del epic.
- [ ] Añadir al proyecto.

### 6.4 Enlazar con el backend

En cada epic, añadir en el campo **Development** o en el cuerpo:

```md
**Backend:** UdL-EPS-SoftArch/PlanBeBackend#<número> (<nombre del requisito>)
```

Si no existe la issue de backend, crear una issue de referencia o enlazar `docs/PLAN.md`.

### 6.5 Plantilla rápida para una issue nueva

```md
**Requisitos:** RF-X.Y (docs/PLAN.md)
**Epic:** [N] Nombre del epic
**Labels:** frontend, priority: must, area: ...
**Milestone:** It.X – Nombre

**Contexto**

...

**Tareas**

- [ ] ...

**Criterios de aceptación**

- [ ] ...

**Ficheros previstos**

- `src/...`

**Endpoints**

- `GET /...`
```

---

## 7. Notas para el equipo

- El backend ya está hecho: no se deben crear issues de backend salvo bugs detectados al integrar.
- El frontend debe tratar el backend como una API HAL: si un enlace existe en `_links`, se usa; no se construyen URLs a mano salvo en los servicios.
- Los formularios Must deben tener validación de cliente y mostrar la validación de servidor.
- No se debe implementar lógica de negocio en el frontend que el backend ya garantiza (aforo, visibilidad, permisos). El frontend solo mejora la experiencia y evita acciones imposibles.
- Si una issue crece demasiado, dividirla antes de empezar. El tamaño ideal es 1–2 días de trabajo.
- Para diseñar pantallas nuevas, usar primero shadcn/ui y después una revisión con Impeccable.
- Para generar componentes o páginas, usar las skills de `PlanBeFrontend/skills/` (`nextjs-hal-api`, `nextjs-ui-pages`, `sdd-feature-designer`, `sdd-cucumber-steps`, `sdd-bdd-verifier`).
