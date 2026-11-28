# Propuesta de redacción para las issues actuales (#1–#17)

> Generado a partir de `issues.md` (backlog/guía del frontend PlanBe). Este documento propone el **nuevo título y cuerpo** para cada una de las 17 issues abiertas actualmente en `UdL-EPS-SoftArch/PlanBeFrontend`, para alinearlas con lo indicado en `issues.md`.
>
> **Nota:** `issues.md` define epics `[0]–[13]` y sub-issues `[N.M]`. Las issues actuales del repositorio son 17 y algunas agrupan varios sub-temas; el mapeo propuesto mantiene el número de issue existente y adapta el contenido según las secciones correspondientes de `issues.md`. Donde no hay correspondencia 1:1, se indica en la sección **Mapeo**.

## Mapeo propuesto

| Issue actual | Título actual (resumen) | Sección(es) de `issues.md` |
|---:|---|---|
| #1 | Adaptar halClient | `[0.3]` Ampliar el cliente HAL |
| #2 | Alinear E2E con PlanBeBackend | Infra transversal (alineación con backend real); estilo/DoD según `issues.md` + notas de #17 actual |
| #3 | Autenticación | `[1]` Autenticación y cuenta (incluye 1.1–1.4) |
| #4 | Perfil de usuario | `[2]` Perfil de usuario (incluye 2.1–2.5) |
| #5 | Catálogo intereses y moderación | `[2.4]` Catálogo de intereses + `[11]` Moderación (combinada, como issue actual) |
| #6 | Gestión de quedadas | `[3]` Quedadas núcleo + `[6.1]` Ubicación en formulario/detalle (incluye 3.1,3.3–3.8 según alcance; 3.9 separado en #15) |
| #7 | Búsqueda y filtros | `[3.2]` Listado y búsqueda de quedadas |
| #8 | Participación | `[4]` Participación núcleo (incluye 4.1–4.4) |
| #9 | Invitaciones | `[4.5]` + `[4.6]` Invitaciones |
| #10 | Grupos y membresías | `[5]` Grupos y membresías (incluye 5.1–5.6) |
| #11 | Comentarios | `[7]` Comentarios (incluye 7.1–7.2) |
| #12 | Valoraciones | `[8]` Valoraciones (incluye 8.1–8.3) |
| #13 | Notificaciones | `[10]` Notificaciones (incluye 10.1–10.3) |
| #14 | Recomendaciones | `[9]` Recomendaciones (incluye 9.1–9.2) |
| #15 | Quedadas recurrentes | `[3.9]` Recurrencia de quedadas |
| #16 | Chat REST polling | `[12]` Chat de quedada (v1 polling REST; 12.3 como evolución) |
| #17 | Trazabilidad META | `[META]` Trazabilidad basada en `issues.md` (resumen, orden, dependencias, notas) |

---

## Issue #1

**Título propuesto:** `[0.3] Ampliar el cliente HAL (PUT/PATCH/DELETE, text/uri-list, errores y paginación)`

**Body propuesto:**

```md
**Requisitos:** RNF-1, RNF-4 (docs/PLAN.md)
**Epic:** [0] Base de la aplicación y sistema de diseño
**Labels:** `frontend`, `priority: must`, `area: base`
**Milestone:** `It.0 – Base del frontend`

**Contexto**

`src/api/halClient.ts` solo tiene `getHal` y `postHal`. PlanBe necesita actualizar recursos, borrar, gestionar asociaciones (`PUT /users/{id}/interests` con `Content-Type: text/uri-list`) y leer páginas HAL (`_embedded`, `page`). Es un requisito transversal: quedadas, participación, invitaciones, grupos, notificaciones y moderación dependen de él.

**Tareas**

- [ ] Añadir `putHal`, `patchHal` y `deleteHal`.
- [ ] Añadir `putUriList`/`patchUriList` para asociaciones (`Content-Type: text/uri-list`).
- [ ] Unificar el tratamiento de errores: leer `message`/`errors` del backend y lanzar un `ApiError`/`HalError` con `status` y mensaje.
- [ ] Añadir helpers de paginación: `getPage`, `getEmbedded`, `getNextPage` y normalizar query params (`URLSearchParams`).
- [ ] Añadir `followLink(resource, rel)` para navegar por enlaces HAL.
- [ ] Documentar en `CONVENTIONS.md`/`README.md` que los tipos pueden incluir `created?`/`modified?` (RNF-5) y que no debe haber `fetch` directo fuera de `halClient.ts`.
- [ ] Añadir tests unitarios o de integración del cliente si se decide incluir Vitest.

**Criterios de aceptación**

- [ ] Un 400 del backend muestra el mensaje de validación al usuario (p. ej. en `<p className="text-sm text-red-600 mt-1">`).
- [ ] Se pueden hacer las operaciones CRUD/PATCH/DELETE de todas las entidades sin `fetch` manual.
- [ ] Las listas paginadas pueden cargar/enlazar la página siguiente mediante enlaces HAL (`next`, `prev`) en lugar de construir `?page=` a mano en cada página.
- [ ] `npm run build` pasa.

**Ficheros previstos**

- `src/api/halClient.ts`
- `src/types/hal.ts`
- `src/lib/errors.ts`
- `CONVENTIONS.md` / `README.md`

**Endpoints de referencia**

- Cualquier recurso HAL del backend.

**Definition of Done (común)**

- [ ] La pantalla o componente funciona contra el backend real en `http://127.0.0.1:8080`.
- [ ] Usa los tipos y el servicio HAL correspondientes; no hay `fetch` sueltos en componentes.
- [ ] Tiene estados de carga, error y vacío cuando aplique.
- [ ] Es usable con teclado y tiene etiquetas accesibles.
- [ ] Se ve correctamente en móvil y escritorio.
- [ ] Pasa `npm run lint` y `npm run build`.
- [ ] Si el flujo es Must, tiene un `.feature` E2E que pasa con `npm run test:e2e:ci`.
- [ ] No quedan referencias al dominio `Record` del template en el código tocado.
```

---

## Issue #2

**Título propuesto:** `[Infra] Alinear E2E con PlanBeBackend (credenciales, fixtures, base URL y reinicio de BD)`

**Body propuesto:**

```md
**Requisitos:** RNF-6 (docs/PLAN.md), RF-1.1/RF-1.2
**Epic relacionado:** [13] Calidad, accesibilidad y entrega / base transversal
**Labels:** `frontend`, `priority: must`, `area: quality`
**Milestone:** `It.0 – Base del frontend` / `It.13 – Calidad y entrega`

**Contexto**

Los escenarios E2E deben ejecutarse contra el backend real de PlanBe. El backend siembra `demo` / `Azqw4321` en `DBInitialization.java` (no `demo` / `password`), y en perfil `test` puede sembrar `test` / `${default-password}`. Los escenarios del backend usan `DatabaseCleanupHooks`, pero el frontend E2E apunta a un backend en ejecución, por lo que hay que documentar y facilitar el reinicio/estado de la BD.

**Tareas**

- [ ] Alinear `tests/e2e/login.feature` y `tests/e2e/steps/login.steps.ts` con las credenciales reales de PlanBeBackend, haciéndolas configurables por variables de entorno (`E2E_USERNAME`, `E2E_PASSWORD`) con valores por defecto `demo` / `Azqw4321`.
- [ ] Crear `tests/e2e/support/fixtures.ts` con helpers reutilizables para preparar escenarios multiusuario (`organizer`, `guest`, `another`, `user`, `waiter`, `admin`, etc.). Los usuarios con `ROLE_ADMIN` deben ser sembrados por el backend; el cliente no puede autoasignarse ese rol.
- [ ] Confirmar que `NEXT_PUBLIC_API_BASE_URL` en `.env.local` apunta a `http://127.0.0.1:8080` y que el `World` de Playwright sigue siendo la única fuente de `this.page` (no re-declarar `Before`/`After` en step files).
- [ ] Documentar en `README.md` cómo arrancar backend + frontend y reiniciar la BD antes de `npm run test:e2e:ci`.
- [ ] Evitar pasos duplicados respecto a `login.steps.ts`.

**Criterios de aceptación**

- [ ] `npm run test:e2e:ci` pasa contra PlanBeBackend sin cambiar el backend.
- [ ] El login de ejemplo funciona con `demo` / `Azqw4321` (o con las variables de entorno).
- [ ] Existe un helper para crear usuarios de prueba con password ≥ 8 y se usa al menos en una feature.
- [ ] `README.md` explica el reinicio de BD y las variables de entorno.
- [ ] No hay pasos duplicados respecto a `login.steps.ts`.

**Esquema Gherkin sugerido (`tests/e2e/fixtures.feature`, < 50 líneas)**

```gherkin
Feature: E2E fixtures
  Scenario: Login with the seeded PlanBe user
    Given I open the login page
    When I enter "demo" and "Azqw4321"
    Then I should see the user page for "demo"
```

**Ficheros previstos**

- `tests/e2e/login.feature`
- `tests/e2e/steps/login.steps.ts`
- `tests/e2e/fixtures.feature` (si aplica)
- `tests/e2e/steps/fixtures.steps.ts` (si aplica)
- `tests/e2e/support/fixtures.ts`
- `tests/e2e/support/playwright_world.ts`
- `README.md`
- `.env.local` (documentación/ejemplo)
```

---

## Issue #3

**Título propuesto:** `[1] Autenticación y cuenta (registro, login, /identity, logout y cambio de contraseña)`

**Body propuesto:**

```md
**Requisitos:** RF-1 (docs/PLAN.md)

Consolidar el registro, login, logout, sesión persistente y cambio de contraseña usando `GET /identity` y la cookie `MYAPP_AUTH`. El template ya tiene una base, pero hay que adaptarla a PlanBe y eliminar el flujo de Records.

**Sub-issues / alcance (según `issues.md`)**

- [ ] [1.1] Tipos y servicio de autenticación
- [ ] [1.2] Registro de usuario
- [ ] [1.3] Login, logout y sesión persistente
- [ ] [1.4] Cambio de contraseña (Should)

**Contexto y tareas clave**

- [ ] Ampliar `src/types/user.ts` y `src/api/userApi.ts` con los campos reales de PlanBe y `getCurrentUser()` basado en `/identity`.
- [ ] Corregir/validar registro: username obligatorio, email válido, contraseña mínima 8, mostrar errores del backend (email duplicado, etc.) y redirigir a `/login` con mensaje de éxito.
- [ ] Revisar cookie `MYAPP_AUTH` para local/producción, implementar logout, soportar `?next=`, evitar parpadeos de sesión y limpiar cookie en login incorrecto.
- [ ] Añadir sección “Seguridad” para cambio de contraseña (`PATCH /users/{id}`), validando mínimo 8 y confirmación, sin mostrar la contraseña en claro.
- [ ] Reutilizar `serverAuthProvider` en Server Components y `clientAuthProvider()`/`useAuth()` en Client Components.

**Criterios de aceptación**

- [ ] Un usuario puede registrarse, entrar, recargar la página y seguir autenticado.
- [ ] Login correcto redirige al perfil o a `next`; login incorrecto muestra error y no deja cookie inválida.
- [ ] El logout borra la cookie, limpia el estado y redirige a la home.
- [ ] Los errores de credenciales/validación se muestran sin romper la aplicación.
- [ ] El cambio de contraseña funciona contra el backend (RF-1.3, Should).
- [ ] `/identity` devuelve el usuario actual y la UI refleja el estado/rol.

**Ficheros previstos**

- `src/types/user.ts`
- `src/api/userApi.ts`
- `src/app/users/register/page.tsx`
- `src/app/login/page.tsx`
- `src/app/components/loginbar.tsx`
- `src/app/components/authentication.tsx`
- `src/lib/authProvider.ts`
- `src/app/users/[id]/page.tsx` (sección seguridad, si aplica)

**Endpoints**

- `GET /identity`
- `GET /users/{id}`
- `POST /users`
- `PATCH /users/{id}`

**Definition of Done (común)**

- [ ] Funciona contra el backend real en `http://127.0.0.1:8080`.
- [ ] Usa tipos y servicios HAL; no hay `fetch` sueltos en componentes.
- [ ] Tiene estados de carga, error y vacío cuando aplique.
- [ ] Usable con teclado y etiquetas accesibles; responsive.
- [ ] Pasa `npm run lint` y `npm run build`.
- [ ] Si el flujo es Must, tiene `.feature` E2E que pasa con `npm run test:e2e:ci`.
- [ ] No quedan referencias al dominio `Record` del template en el código tocado.
```

---

## Issue #4

**Título propuesto:** `[2] Perfil de usuario (campos, intereses, privacidad y edad mínima)`

**Body propuesto:**

```md
**Requisitos:** RF-2 (docs/PLAN.md)

Ampliar `User` con datos de perfil, intereses y privacidad. El backend ya implementa los campos; el frontend debe permitir verlos y editarlos, respetando que `birthDate` y `gender` solo se muestran si `showPersonalData` es `true` o si es el propio usuario/ADMIN.

**Sub-issues / alcance (según `issues.md`)**

- [ ] [2.1] Campos básicos del perfil (`displayName`, `bio`, `avatarUrl`, `city`)
- [ ] [2.2] Fecha de nacimiento, género y edad mínima (>= 18)
- [ ] [2.3] Privacidad de datos personales (`showPersonalData`)
- [ ] [2.4] Catálogo de intereses (lectura/selección para usuario; gestión ADMIN cubierta en #5)
- [ ] [2.5] Asignar intereses al usuario (`/users/{id}/interests`)

**Contexto y tareas clave**

- [ ] Rehacer `src/app/users/[id]/page.tsx` como perfil de PlanBe (quitar formulario/listado de Records del template).
- [ ] Formulario de edición con `react-hook-form` + shadcn/ui; editar solo propio usuario o ADMIN (UI) manteniendo backend como autoridad.
- [ ] Validar longitudes (`displayName` 50, `bio` 500, `city` 100), `avatarUrl` con fallback, edad >= 18 en cliente y mostrar errores 400 del backend.
- [ ] Selector de género (`MALE`, `FEMALE`, `NON_BINARY`, `UNDISCLOSED`) y switch de privacidad con explicación RGPD.
- [ ] Cargar catálogo desde `GET /interests`, intereses actuales desde `GET /users/{id}/interests`, guardar con `PUT /users/{id}/interests` (`Content-Type: text/uri-list`) y/o `DELETE` individual según diseño; evitar duplicados y manejar lista vacía.
- [ ] Mostrar `birthDate`/`gender`/`age` solo cuando el backend los expone/son visibles; no cachear datos personales de terceros.

**Criterios de aceptación**

- [ ] El usuario puede ver y editar su perfil (campos permitidos) y los cambios persisten.
- [ ] Un tercero ve el perfil en modo lectura y no ve controles de edición.
- [ ] Los datos personales se ocultan a terceros por defecto y se muestran según `showPersonalData`/permisos.
- [ ] La edad mínima se valida en cliente y backend.
- [ ] El usuario puede seleccionar/quitar intereses del catálogo y verlos como badges.
- [ ] Pasa `npm run lint` y `npm run build`; flujo Must cubierto por E2E cuando aplique.

**Ficheros previstos**

- `src/types/user.ts`
- `src/types/interest.ts`
- `src/api/userApi.ts`
- `src/api/interestApi.ts`
- `src/app/users/[id]/page.tsx`
- `src/components/profile/*` (ProfileForm, ProfileCard, InterestPicker, PrivacySettings, etc.)

**Endpoints**

- `GET /users/{id}`
- `PATCH /users/{id}`
- `GET /interests`
- `GET /interests/search/findByNameContainingIgnoreCase?text=...` (si aplica)
- `GET /users/{id}/interests`
- `PUT /users/{id}/interests`
- `DELETE /users/{id}/interests/{interestId}` (si aplica)
```

---

## Issue #5

**Título propuesto:** `[2.4/RF-11] Administración: catálogo de intereses y moderación (bloqueos y reportes)`

**Body propuesto:**

```md
**Requisitos:** RF-2.2 (catálogo, ADMIN), RF-11 (Could) — docs/PLAN.md

Issue combinada para la parte administrativa del catálogo de intereses y las herramientas de moderación (`Block`, `Report`). En `issues.md` se detalla como `[2.4] Catálogo de intereses` y epic `[11] Moderación`; se mantiene en una sola issue para alinearse con el tracker actual.

**Alcance A — Catálogo de intereses (ADMIN)**

- [ ] Tipos/servicio: `src/types/interest.ts`, `src/api/interestApi.ts` (`getInterests`, `searchInterests`, `create/update/delete`).
- [ ] Página `/admin/interests` solo para `ROLE_ADMIN` con tabla/búsqueda y CRUD de intereses (`name`, `category` si aplica).
- [ ] Enlace en navbar/sección admin solo visible para ADMIN.

**Alcance B — Moderación (usuarios y contenido)**

- [ ] Tipos/servicios: `src/types/{block,report}.ts`, `src/api/{block,report}Api.ts`.
- [ ] Bloqueos: acción “Bloquear/Desbloquear” en perfil ajeno con confirmación y explicación; `POST /blocks`, listado `/me/blocks` (o equivalente) y `DELETE /blocks/{id}`.
- [ ] Reportes: diálogo “Reportar” en perfiles, quedadas y comentarios (motivo obligatorio), `POST /reports`; no permitir reportar contenido propio.
- [ ] Panel ADMIN `/admin/reports`: listar por estado (`OPEN`/`RESOLVED`/`DISMISSED`), filtrar, enlazar recurso y cambiar estado con `PATCH /reports/{id}`.
- [ ] Respetar y mostrar mensajes 403/errores del backend (p. ej. organizador ha bloqueado al usuario) sin ocultar la causa.

**Criterios de aceptación**

- [ ] Cualquier usuario puede leer intereses; solo ADMIN gestiona el catálogo.
- [ ] Un usuario puede bloquear/desbloquear a otro (no a sí mismo) y la UI refleja las consecuencias.
- [ ] Se puede reportar contenido permitido y el reporte se crea como `OPEN`.
- [ ] Solo ADMIN accede al panel de reportes y puede resolver/descartar.
- [ ] Todas las operaciones usan HAL/services; no hay `fetch` directo en componentes.
- [ ] Pasa `npm run lint` y `npm run build`; E2E de flujos cubiertos cuando aplique.

**Ficheros previstos**

- `src/types/interest.ts`, `src/types/block.ts`, `src/types/report.ts`
- `src/api/interestApi.ts`, `src/api/blockApi.ts`, `src/api/reportApi.ts`
- `src/app/admin/interests/page.tsx`
- `src/app/admin/reports/page.tsx`
- `src/app/me/blocks/page.tsx` (si aplica)
- `src/components/interests/*`, `src/components/moderation/*`, `src/components/users/BlockButton.tsx`
- `src/app/components/navbar.tsx`

**Endpoints**

- `/interests`, `/interests/search/findByNameContainingIgnoreCase?text=...`
- `/blocks`, `/reports`, `/reports/search/findByStatus?status=OPEN`
- `POST/PATCH/DELETE` según recurso
```

---

## Issue #6

**Título propuesto:** `[3/6] Gestión de quedadas (crear, listar, detalle, editar/cancelar/eliminar) y ubicación`

**Body propuesto:**

```md
**Requisitos:** RF-3.1–RF-3.4, RF-3.6, RF-3.7, RF-6 (Must/Could según campo), It.2 (docs/PLAN.md)

Construir el núcleo de PlanBe para quedadas: tipos/servicio HAL, listado básico, detalle, creación y gestión (editar/cancelar/eliminar), incluyendo ubicación embebida. La búsqueda/filtrado avanzado se detalla en #7 y la recurrencia en #15.

**Sub-issues / alcance (según `issues.md`)**

- [ ] [3.1] Tipos y servicio HAL de `Meetup`, `Location` y `Category`
- [ ] [3.3] Detalle de quedada
- [ ] [3.4] Crear quedada
- [ ] [3.5] Editar, cancelar y eliminar quedada
- [ ] [3.6] Mis quedadas (organizo/participo) — coordinación con #8
- [ ] [3.7] Restricciones de edad y género (Could)
- [ ] [3.8] Precio por persona (Could)
- [ ] [6.1] Componente de ubicación y visualización

**Contexto y tareas clave**

- [ ] Modelar `Location`, `Meetup`, `Category` y enums/catálogos (`visibility`, `status`, `recurrence`, `targetGender`, etc.) según backend; `category`/`status` como string cuando corresponda.
- [ ] `meetupApi.ts`: `getMeetups`, `getMeetupById`, `createMeetup`, `updateMeetup`, `deleteMeetup`, búsquedas necesarias y acceso a relaciones (`organizer`, `group`, `tags`).
- [ ] Páginas: `/meetups` (listado paginado base), `/meetups/new`, `/meetups/[id]`, `/meetups/[id]/edit`, `/me/meetups` (pestañas Organizo/Participo) con guards de sesión.
- [ ] Formulario con `react-hook-form` + shadcn/ui: título, descripción, categoría, fechas, aforo, visibilidad, estado, ubicación (`LocationFields`), etiquetas, edad/género, precio, (recurrencia preparada/ver #15). Validaciones cliente: `startDate` futura, `endDate > startDate`, `capacity >= 1`, rangos de edad, precio >= 0.
- [ ] Detalle: toda la info, plazas, estado, ubicación (`LocationDisplay` + enlace mapa si hay coords), acciones según permisos (unirse/abandonar/invitar/comentar/editar/cancelar) con placeholders para secciones dependientes (#8,#9,#11,#12,#16).
- [ ] Cancelar = `status: CANCELLED` (preferible a borrar cuando proceda); confirmaciones para acciones destructivas; manejar 403/404 amigablemente.
- [ ] No simular reglas de negocio del backend (visibilidad, aforo, permisos): la UI guía pero el backend decide.

**Criterios de aceptación**

- [ ] Se pueden listar y ver quedadas devueltas por el backend (respetando visibilidad).
- [ ] Se puede crear una quedada válida y verla en listado/detalle.
- [ ] El organizador/gestor autorizado puede editarla y cancelarla; terceros no ven acciones no permitidas.
- [ ] La ubicación se guarda, se muestra y no rompe si faltan coordenadas.
- [ ] “Mis quedadas” distingue organizadas y participaciones (con estados) cuando los datos están disponibles.
- [ ] Pasa `npm run lint` y `npm run build`; flujos Must cubiertos por E2E.

**Ficheros previstos**

- `src/types/meetup.ts`, `src/types/location.ts`, `src/types/category.ts`
- `src/api/meetupApi.ts`, `src/api/categoryApi.ts`
- `src/app/meetups/page.tsx`, `src/app/meetups/new/page.tsx`, `src/app/meetups/[id]/page.tsx`, `src/app/meetups/[id]/edit/page.tsx`
- `src/app/me/meetups/page.tsx`
- `src/components/meetups/*`, `src/components/locations/*`, `src/components/common/ConfirmDialog.tsx`

**Endpoints**

- `GET/POST/PATCH/DELETE /meetups`, `GET /meetups/{id}`
- `GET /categories`, `GET /interests`
- Búsquedas: `findByOrganizerAndVisibility`, etc. (ver #7)
- Relaciones/recursos HAL según enlaces
```

---

## Issue #7

**Título propuesto:** `[3.2] Listado y búsqueda de quedadas con filtros y paginación`

**Body propuesto:**

```md
**Requisitos:** RF-3.4, RF-3.5, RNF-4 (docs/PLAN.md)
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: must`, `area: meetups`
**Milestone:** `It.2 – Quedadas`

**Contexto**

Pantalla principal de descubrimiento. Debe mostrar solo lo que el backend devuelve (ya filtra por visibilidad) y permitir filtrar por categoría, ciudad, fecha e interés/organizador según endpoints reales, con paginación HAL.

**Tareas**

- [ ] Crear/ajustar `/meetups` (y/o `/meetups/search` si se decide separar) con listado paginado.
- [ ] Añadir filtros: categoría, ciudad, fecha desde, (interés/organizador si aplica) y sincronizarlos con `searchParams` para compartir enlaces.
- [ ] Usar endpoints reales del backend:
  - `GET /meetups/search/findByCategoryAndVisibility?category=...`
  - `GET /meetups/search/findByCityAndVisibility?city=...`
  - `GET /meetups/search/findByStartDateAfterAndVisibility?startDate=...` (ISO-8601)
  - `GET /meetups/search/findByOrganizerAndVisibility?organizerId=...` (si aplica)
- [ ] Consumir paginación mediante enlaces HAL (`next`/`prev`) y/o helpers de `halClient` (no construir `?page=` a mano en cada página).
- [ ] Usar `MeetupCard` (título, fecha, ciudad, categoría, aforo, estado) y añadir estados de carga, vacío (“No hay quedadas con estos filtros”) y error.
- [ ] No sustituir la visibilidad del servidor ni filtrar en cliente para simular permisos.

**Criterios de aceptación**

- [ ] Los filtros llaman a las búsquedas correctas del backend con parámetros correctos.
- [ ] La URL conserva los filtros al recargar.
- [ ] Las quedadas privadas no aparecen a usuarios sin permiso.
- [ ] La lista es responsive y paginada.
- [ ] Pasa `npm run lint` y `npm run build`; E2E del flujo cuando aplique.

**Ficheros previstos**

- `src/app/meetups/page.tsx` (y/o `src/app/meetups/search/page.tsx`)
- `src/components/meetups/MeetupCard.tsx`
- `src/components/meetups/MeetupFilters.tsx`
- `src/api/meetupApi.ts`

**Endpoints**

- `GET /meetups`
- `GET /meetups/search/findByCategoryAndVisibility?category=...`
- `GET /meetups/search/findByCityAndVisibility?city=...`
- `GET /meetups/search/findByStartDateAfterAndVisibility?startDate=...`
- `GET /meetups/search/findByOrganizerAndVisibility?organizerId=...`
```

---

## Issue #8

**Título propuesto:** `[4] Participación en quedadas (unirse, lista de espera, abandonar y mis participaciones)`

**Body propuesto:**

```md
**Requisitos:** RF-4.1, RF-4.2, RF-4.4 (Must/Should), RF-3.6 restricciones al unirse (docs/PLAN.md)
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.3 – Participación y lista de espera`

Incluye el núcleo de participación (invitaciones en #9).

**Sub-issues / alcance (según `issues.md`)**

- [ ] [4.1] Unirse a una quedada
- [ ] [4.2] Lista de espera
- [ ] [4.3] Abandonar una quedada
- [ ] [4.4] Mis participaciones

**Contexto y tareas clave**

- [ ] Crear `src/types/participation.ts` y `src/api/participationApi.ts` (join, consultar mi participación, listar mis participaciones, abandonar/cancelar participación según backend: `PATCH status=CANCELLED` y/o `DELETE`).
- [ ] En detalle de quedada: botón “Unirme” si hay sesión y no participa; deshabilitar durante envío; mostrar estado resultante `CONFIRMED`/`WAITING`; ocultar o guiar a login si no hay sesión.
- [ ] Respetar restricciones (aforo, edad, género, visibilidad) mostrando mensajes/errores del backend (`HalError.message`) y, cuando sea posible, feedback previo en UI sin sustituir la validación del servidor.
- [ ] Lista de espera: badge/aviso claro, estado actualizado al recargar; si el backend expone posición, mostrarla (sin prometerla si no existe).
- [ ] Abandonar con confirmación; actualizar UI; reflejar liberación/promoción gestionada por backend al recargar.
- [ ] Vista `/me/meetups` pestaña “Participo” usando `GET /participations/search/findMyParticipations`, con estados y acciones disponibles.

**Criterios de aceptación**

- [ ] Un usuario puede unirse a una quedada visible y ve su estado persistente.
- [ ] Si está llena, entra en lista de espera (`WAITING`) y la UI lo explica.
- [ ] Puede abandonar y el estado se actualiza (y el botón/acciones cambian acorde).
- [ ] Se listan todas las participaciones del usuario con `CONFIRMED`/`WAITING`/`CANCELLED`.
- [ ] No se puede unir dos veces; errores 400/403 se muestran claramente.
- [ ] Pasa `npm run lint` y `npm run build`; E2E de flujos Must.

**Ficheros previstos**

- `src/types/participation.ts`
- `src/api/participationApi.ts`
- `src/components/meetups/MeetupActions.tsx`
- `src/components/participation/ParticipationBadge.tsx`, `ParticipationCard.tsx` (si aplica)
- `src/app/me/meetups/page.tsx`
- `src/app/meetups/[id]/page.tsx`

**Endpoints**

- `POST /participations`
- `GET /participations/search/findByParticipantIdAndMeetupId?participantId=...&meetupId=...`
- `GET /participations/search/findMyParticipations`
- `PATCH /participations/{id}` y/o `DELETE /participations/{id}`
```

---

## Issue #9

**Título propuesto:** `[4.5/4.6] Invitaciones a quedadas (enviar, listar, aceptar y rechazar)`

**Body propuesto:**

```md
**Requisitos:** RF-4.3 (Must) — docs/PLAN.md
**Epic:** [4] Participación e invitaciones
**Labels:** `frontend`, `priority: must`, `area: participation`
**Milestone:** `It.4 – Invitaciones`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [4.5] Invitaciones recibidas y enviadas
- [ ] [4.6] Aceptar o rechazar invitaciones

**Contexto y tareas clave**

- [ ] Crear `src/types/invitation.ts` y `src/api/invitationApi.ts` (`invite`, listar recibidas/enviadas o según API disponible, aceptar/rechazar con `PATCH status=ACCEPTED|DECLINED`).
- [ ] En detalle de quedada: formulario/diálogo para invitar (solo organizador/gestor autorizado) con búsqueda de usuarios; enviar `POST /invitations` con URIs correctas (`invitee`, `invitedBy`, `meetup`).
- [ ] Página `/me/invitations` (o `/invitations`) con invitaciones recibidas/enviadas, estado (`PENDING`/`ACCEPTED`/`DECLINED`) y fecha.
- [ ] Botones Aceptar/Rechazar en pendientes; al aceptar, reflejar la participación creada por el backend y enlazar a la quedada; gestionar errores (aforo, caducidad, bloqueos 403).
- [ ] Evitar duplicados en UI y mostrar errores del backend.

**Criterios de aceptación**

- [ ] El organizador puede invitar a un usuario permitido.
- [ ] El invitado ve sus invitaciones pendientes.
- [ ] Aceptar crea/reflecta la participación correspondiente y se ve en “Mis quedadas”.
- [ ] Rechazar marca `DECLINED`; invitaciones respondidas no muestran acciones.
- [ ] No se puede invitar dos veces a la misma persona; usuarios sin permiso no ven el formulario.
- [ ] Pasa `npm run lint` y `npm run build`; E2E de flujos Must.

**Ficheros previstos**

- `src/types/invitation.ts`
- `src/api/invitationApi.ts`
- `src/components/meetups/InviteDialog.tsx`
- `src/components/invitations/InvitationCard.tsx` (si aplica)
- `src/app/me/invitations/page.tsx`
- `src/app/meetups/[id]/page.tsx`

**Endpoints**

- `GET/POST /invitations`
- `PATCH /invitations/{id}`
- `GET /users/search/findByIdContaining?text=...` (u otro endpoint de búsqueda disponible)
```

---

## Issue #10

**Título propuesto:** `[5] Grupos y membresías (incl. quedadas con visibilidad GROUP)`

**Body propuesto:**

```md
**Requisitos:** RF-5 (Should) — docs/PLAN.md
**Epic:** [5] Grupos y membresías
**Labels:** `frontend`, `priority: should`, `area: groups`
**Milestone:** `It.5 – Grupos y membresías`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [5.1] Tipos y servicio de grupos y membresías
- [ ] [5.2] Listado y detalle de grupo
- [ ] [5.3] Crear y editar grupo
- [ ] [5.4] Miembros y roles
- [ ] [5.5] Solicitudes e invitaciones de grupo
- [ ] [5.6] Quedadas de grupo

**Contexto y tareas clave**

- [ ] Tipos: `Group`, `Membership` con visibilidad, roles (`OWNER`, `ADMIN`, `MEMBER`) y estados (`PENDING`, `ACTIVE`).
- [ ] Servicios HAL: `groupApi.ts`, `membershipApi.ts` (CRUD, búsquedas como `findByOwnedBy`, `findByName`, miembros por grupo).
- [ ] Páginas: `/groups`, `/groups/new`, `/groups/[id]`, `/groups/[id]/edit`, bandeja/gestión de solicitudes según diseño.
- [ ] Gestión de miembros/roles (solo gestores), solicitudes de unión/invitaciones con estados pendientes y resolución.
- [ ] Integración con quedadas: al elegir visibilidad `GROUP` en el formulario de meetup, seleccionar grupo gestionado y enviar relación `group`; listar quedadas del grupo en su detalle respetando visibilidad del backend.

**Criterios de aceptación**

- [ ] Se pueden crear, consultar y editar grupos según permisos.
- [ ] Se pueden gestionar miembros, roles y solicitudes/estados de membresía.
- [ ] Un grupo puede tener quedadas con visibilidad `GROUP` visibles solo para miembros autorizados.
- [ ] Acciones no permitidas no se muestran en UI; backend es la autoridad.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando aplique.

**Ficheros previstos**

- `src/types/group.ts`, `src/types/membership.ts`
- `src/api/groupApi.ts`, `src/api/membershipApi.ts`
- `src/app/groups/**`
- `src/components/groups/*`
- `src/components/meetups/MeetupForm.tsx` (selector de grupo)

**Endpoints**

- `/groups`, `/groups/search/findByOwnedBy?user=...`, `/groups/search/findByName?name=...`
- `/memberships`, `/memberships/search/findByGroupId?groupId=...`
- `/meetups` con `group` y visibilidad `GROUP`
```

---

## Issue #11

**Título propuesto:** `[7] Comentarios en quedadas`

**Body propuesto:**

```md
**Requisitos:** RF-7 (Should) — docs/PLAN.md
**Epic:** [7] Comentarios
**Labels:** `frontend`, `priority: should`, `area: comments`
**Milestone:** `It.6 – Comentarios`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [7.1] Listado y creación de comentarios
- [ ] [7.2] Borrado y control de acceso

**Contexto y tareas clave**

- [ ] Crear `src/types/comment.ts` y `src/api/commentApi.ts` (`getByMeetupId`, `create`, `delete`).
- [ ] Sección `CommentSection` en `/meetups/[id]`: listar (autor, fecha, texto) y formulario para usuarios autenticados con acceso.
- [ ] Enviar `POST /comments` con `text`, `author` y `meetup`; actualizar lista sin recargar cuando sea posible.
- [ ] Borrado solo para autor o `ROLE_ADMIN` con confirmación; respetar reglas/errores del backend (incl. quedadas donde no se permiten comentarios si aplica).
- [ ] Estados de carga, vacío y error; anónimos solo lectura cuando la quedada es visible.

**Criterios de aceptación**

- [ ] Se pueden ver y crear comentarios en una quedada visible para el usuario.
- [ ] El autor y el ADMIN pueden borrar; terceros no ven el botón.
- [ ] Un usuario sin acceso no ve comentarios de quedadas no permitidas.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando aplique.

**Ficheros previstos**

- `src/types/comment.ts`
- `src/api/commentApi.ts`
- `src/components/comments/CommentSection.tsx`
- `src/components/comments/CommentForm.tsx`
- `src/components/comments/CommentCard.tsx`
- `src/app/meetups/[id]/page.tsx`

**Endpoints**

- `GET /comments/search/findByMeetupId?meetupId=...`
- `POST /comments`
- `DELETE /comments/{id}`
```

---

## Issue #12

**Título propuesto:** `[8] Valoraciones de quedadas y media del organizador`

**Body propuesto:**

```md
**Requisitos:** RF-8 (Could) — docs/PLAN.md
**Epic:** [8] Valoraciones
**Labels:** `frontend`, `priority: could`, `area: reviews`
**Milestone:** `It.7 – Valoraciones`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [8.1] Tipos y servicio de valoraciones
- [ ] [8.2] Crear y editar valoración
- [ ] [8.3] Listado y media del organizador

**Contexto y tareas clave**

- [ ] Crear `src/types/review.ts` y `src/api/reviewApi.ts` (listar por quedada, obtener mi valoración, crear/editar/borrar, media por organizador).
- [ ] Mostrar formulario de valoración (1–5 + texto) solo si la quedada está `FINISHED` y el usuario es participante `CONFIRMED` y aún no ha valorado (o permitir editar la propia según reglas).
- [ ] Validar `rating` 1–5 y mostrar errores 400/403/duplicado del backend.
- [ ] Listar valoraciones en `/meetups/[id]` y mostrar media/nº valoraciones en `/users/[id]` (organizador).

**Criterios de aceptación**

- [ ] Un participante confirmado puede valorar una quedada finalizada (una vez por usuario/quedada).
- [ ] No participante o quedada no finalizada no puede valorar.
- [ ] La media del organizador se muestra en su perfil y las valoraciones en el detalle.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando aplique.

**Ficheros previstos**

- `src/types/review.ts`
- `src/api/reviewApi.ts`
- `src/components/reviews/ReviewForm.tsx`
- `src/components/reviews/StarRating.tsx`
- `src/components/reviews/ReviewList.tsx`
- `src/components/reviews/RatingSummary.tsx`
- `src/app/meetups/[id]/page.tsx`
- `src/app/users/[id]/page.tsx`

**Endpoints**

- `GET /reviews/search/findByMeetupId?meetupId=...`
- `GET /reviews/search/findByReviewerIdAndMeetupId?reviewerId=...&meetupId=...`
- `GET /reviews/search/findAverageRatingByOrganizer?organizerId=...`
- `POST/PATCH/DELETE /reviews` (según aplique)
```

---

## Issue #13

**Título propuesto:** `[10] Notificaciones del usuario (campana, bandeja y lectura)`

**Body propuesto:**

```md
**Requisitos:** RF-10 (Could) — docs/PLAN.md
**Epic:** [10] Notificaciones
**Labels:** `frontend`, `priority: could`, `area: notifications`
**Milestone:** `It.8 – Notificaciones`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [10.1] Tipos y servicio de notificaciones
- [ ] [10.2] Campana y contador de no leídas
- [ ] [10.3] Bandeja y marcado como leídas

**Contexto y tareas clave**

- [ ] Crear `src/types/notification.ts` y `src/api/notificationApi.ts` (`getNotifications`, `getUnread/findUnread`, `markAsRead`, `markAllAsRead` si existe).
- [ ] Tipar `NotificationType` (`INVITATION`, `MEETUP_CANCELLED`, `MEETUP_UPDATED`, `SPOT_FREED`, `GROUP_REQUEST`).
- [ ] Campana en navbar/loginbar para usuarios autenticados con contador de no leídas y acceso rápido (popover/sheet) + enlace a `/me/notifications`.
- [ ] Bandeja `/me/notifications` paginada, distinguir leídas/no leídas, marcar una/todas como leídas y navegar a `targetUri` (resolviendo enlaces HAL cuando corresponda).
- [ ] Actualizar contador/UI tras marcar como leída; no mostrar notificaciones de otros usuarios.

**Criterios de aceptación**

- [ ] El usuario ve sus notificaciones y el contador de no leídas es correcto.
- [ ] Puede marcar una o todas como leídas y el cambio persiste.
- [ ] El enlace lleva a la entidad/recurso correspondiente.
- [ ] Accesible por teclado y sin errores si no hay notificaciones.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando aplique.

**Ficheros previstos**

- `src/types/notification.ts`
- `src/api/notificationApi.ts`
- `src/components/notifications/NotificationBell.tsx`
- `src/components/notifications/NotificationList.tsx`
- `src/app/me/notifications/page.tsx`
- `src/app/components/loginbar.tsx` / `navbar.tsx`

**Endpoints**

- `GET /notifications`
- `GET /notifications/search/findUnread`
- `PATCH /notifications/{id}`
```

---

## Issue #14

**Título propuesto:** `[9] Recomendaciones de quedadas`

**Body propuesto:**

```md
**Requisitos:** RF-9 (Could) — docs/PLAN.md
**Epic:** [9] Recomendaciones
**Labels:** `frontend`, `priority: could`, `area: recommendations`
**Milestone:** `It.9 – Recomendaciones`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [9.1] Servicio y tipos de recomendaciones
- [ ] [9.2] Sección “Recomendadas para ti”

**Contexto y tareas clave**

- [ ] Añadir `getRecommendedMeetups()` en `meetupApi.ts` consumiendo `GET /meetups/search/recommended` (backend usa identidad autenticada; no filtrar en cliente la lógica de recomendación).
- [ ] Mostrar bloque “Recomendadas para ti” en home autenticada (y/o página dedicada) con hasta 6 `MeetupCard` y CTA “Ver todas” si aplica.
- [ ] Estado vacío útil con enlace a completar perfil/intereses cuando no haya recomendaciones por falta de datos.
- [ ] No mostrar a anónimos (o mostrar CTA a login según diseño) y manejar errores sin romper la home.

**Criterios de aceptación**

- [ ] Un usuario autenticado ve recomendaciones personalizadas devueltas por el backend.
- [ ] Si no hay recomendaciones, se muestra un estado vacío útil (no una lista vacía inexplicable).
- [ ] La sección no aparece para anónimos o se comporta según lo definido sin errores.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando aplique.

**Ficheros previstos**

- `src/api/meetupApi.ts`
- `src/components/meetups/RecommendedMeetups.tsx`
- `src/app/page.tsx`
- `src/app/meetups/recommended/page.tsx` (opcional)

**Endpoints**

- `GET /meetups/search/recommended`
```

---

## Issue #15

**Título propuesto:** `[3.9] Recurrencia de quedadas`

**Body propuesto:**

```md
**Requisitos:** RF-3.8 (Could) — docs/PLAN.md
**Epic:** [3] Quedadas
**Labels:** `frontend`, `priority: could`, `area: meetups`
**Milestone:** `It.11 – Recurrencia`

**Contexto**

El backend soporta `recurrence` (`NONE`, `WEEKLY`, `BIWEEKLY`, `MONTHLY`) y `recurrenceEnd`. Al finalizar una ocurrencia, el backend genera la siguiente. El frontend solo debe configurarla y mostrar la relación entre ocurrencias (no generar ocurrencias en cliente).

**Tareas**

- [ ] Añadir `recurrence` y `recurrenceEnd` al formulario de quedada; deshabilitar/ajustar `recurrenceEnd` cuando `recurrence = NONE`.
- [ ] Validar que `recurrenceEnd` no sea anterior a `startDate` y mostrar errores 400 del backend.
- [ ] Mostrar badge/etiqueta de recurrencia en el detalle.
- [ ] Mostrar enlace a `previousOccurrence` (y siguiente si el backend lo expone/enlaza) cuando exista.
- [ ] Explicar que las siguientes ocurrencias se generan automáticamente.

**Criterios de aceptación**

- [ ] Se puede crear/editar una quedada recurrente válida.
- [ ] El detalle muestra la recurrencia y la relación con ocurrencias previas/siguientes cuando aplique.
- [ ] Errores de validación se muestran correctamente.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando aplique.

**Ficheros previstos**

- `src/types/meetup.ts`
- `src/components/meetups/MeetupForm.tsx`
- `src/components/meetups/MeetupDetail.tsx`
- `src/app/meetups/new/page.tsx`
- `src/app/meetups/[id]/edit/page.tsx`
- `src/app/meetups/[id]/page.tsx`

**Endpoints**

- `POST /meetups`
- `PATCH /meetups/{id}`
- `GET /meetups/{id}` (relaciones HAL como `previousOccurrence`)
```

---

## Issue #16

**Título propuesto:** `[12] Chat de quedada (v1 REST polling; v2 WebSocket/STOMP)`

**Body propuesto:**

```md
**Requisitos:** RF-12 (Won't v1 / Could evolución) — docs/PLAN.md
**Epic:** [12] Chat de quedada
**Labels:** `frontend`, `priority: won't`, `area: chat`
**Milestone:** `It.12 – Chat`

**Sub-issues / alcance (según `issues.md`)**

- [ ] [12.1] Tipos y servicio REST de mensajes
- [ ] [12.2] UI de chat con polling
- [ ] [12.3] WebSocket/STOMP en tiempo real (Could, evolución v2)

**Contexto y tareas clave**

- [ ] Crear `src/types/chatMessage.ts` y `src/api/chatApi.ts` (`getMessages/findByMeetupId`, `sendMessage`) con paginación y orden `sentAt ASC, id ASC`.
- [ ] UI en detalle de quedada (pestaña/sección “Chat”) visible solo para participantes confirmados cuando corresponda; listar mensajes con autor y hora, formulario de envío.
- [ ] v1: polling REST (5–10 s) mientras la vista está activa, scroll al final, evitar duplicados y limpiar intervalos al desmontar.
- [ ] Mostrar errores 403 cuando el backend rechaza acceso/envío por no ser participante confirmado.
- [ ] v2 (opcional/Could): STOMP `/ws`, envío `/app/meetups/{id}/chat`, suscripción `/topic/meetups/{id}/chat`, reconexión y fallback a polling.

**Criterios de aceptación**

- [ ] Solo los participantes autorizados pueden ver y enviar mensajes (backend es autoridad).
- [ ] Los mensajes se ordenan por fecha y la UI se actualiza sin recargar la página (polling en v1).
- [ ] No se duplican mensajes y el polling se detiene al salir.
- [ ] Si se implementa STOMP, la conexión se cierra al salir y hay fallback.
- [ ] Pasa `npm run lint` y `npm run build`; E2E cuando se active.

**Ficheros previstos**

- `src/types/chatMessage.ts`
- `src/api/chatApi.ts`
- `src/components/chat/ChatPanel.tsx`
- `src/components/chat/MessageList.tsx`
- `src/components/chat/MessageForm.tsx`
- `src/lib/stompClient.ts` (v2, si aplica)
- `src/app/meetups/[id]/page.tsx`

**Endpoints**

- `GET /chatMessages/search/findByMeetupId?meetupId=...`
- `POST /chatMessages`
- (v2) `WS /ws`, `/app/meetups/{id}/chat`, `/topic/meetups/{id}/chat`
```

---

## Issue #17

**Título propuesto:** `[META] Trazabilidad y backlog frontend PlanBe (según issues.md, RF-1..RF-12)`

**Body propuesto:**

```md
Este issue es el índice de trazabilidad del frontend **PlanBeFrontend** alineado con `issues.md` (y basado en `docs/PLAN.md` y `README.md` del backend). El backend de PlanBe está prácticamente completo; el frontend debe sustituir el dominio `Record` del template y consumir los recursos HAL reales.

## Situación de partida (resumen)

- Frontend actual: template Next.js con HAL básico, auth/cookie `MYAPP_AUTH`, páginas de login/registro/perfil template, `Record` residual y `login.feature`.
- Backend expone: `/identity`, `/users`, `/interests`, `/meetups`, `/participations`, `/invitations`, `/groups`, `/memberships`, `/comments`, `/reviews`, `/notifications`, `/blocks`, `/reports`, `/chatMessages` y catálogos.

## Cobertura RF → issues actuales (#1–#16)

| Requisito | Prioridad | Issue(s) |
|---|---|---|
| RNF-1/RNF-3/RNF-4/RNF-5 (HAL, errores, paginación, auditoría) | must | #1 |
| RNF-6 / alineación E2E con backend real | must | #2 |
| RF-1 Autenticación y cuenta | must | #3 |
| RF-2 Perfil (campos, intereses, privacidad, edad) | must | #4 |
| RF-2.2 Catálogo intereses (ADMIN) / RF-11 Moderación | must/could | #5 |
| RF-3 Quedadas + RF-6 Ubicación (núcleo) | must | #6, #7 |
| RF-3.8 Recurrencia | could | #15 |
| RF-4 Participación, aforo, lista de espera | must | #8 |
| RF-4.3 Invitaciones | must | #9 |
| RF-5 Grupos y membresías (incl. GROUP) | should | #10 |
| RF-7 Comentarios | should | #11 |
| RF-8 Valoraciones | could | #12 |
| RF-10 Notificaciones | could | #13 |
| RF-9 Recomendaciones | could | #14 |
| RF-12 Chat (REST polling v1) | won't v1 / could | #16 |

## Orden recomendado (según `issues.md`)

**MVP:** #1, #2 (alineación), #3, parte de #4/#6, #7, #8 y E2E Must.  
**Después:** completar #4, #6, #9, #5, #10, #11, #12, #13, #14, #15, #16 y cierre de calidad (#13 epic en `issues.md` si se materializa).

## Dependencias críticas (resumen)

- #6 depende de #1 y #3.
- #8/#9 dependen de #6 (detalle/creación) y de participación creada.
- #10 (quedadas de grupo) depende de formulario de meetups y gestión de grupo.
- #11/#12 dependen de #6/#8.
- #13 depende de eventos/invitaciones/participaciones relevantes.
- #16 depende de participantes confirmados (#8).

## Notas de consistencia

- Credenciales sembradas en backend: `demo` / `Azqw4321` (alinear E2E).
- Usar endpoints reales de búsqueda HAL (`findByCategoryAndVisibility`, `findByCityAndVisibility`, `findByStartDateAfterAndVisibility`, `findByOrganizerAndVisibility`) y `chatMessages/search/findByMeetupId?meetupId=...`.
- No usar `fetch` directo fuera de `src/api/halClient.ts`; no simular en UI reglas de negocio garantizadas por backend.

## Definition of Done global

- [ ] Flujos Must cubiertos por `.feature` y pasando con `npm run test:e2e:ci` contra backend `:8080` y frontend `:3000`.
- [ ] `npm run build` y `npm run lint` pasan.
- [ ] No hay `fetch` directo fuera de `src/api/halClient.ts`.
- [ ] No quedan referencias al dominio `Record` del template.
- [ ] UI accesible, responsive y con estados de carga/error/vacío.
```

---

## Siguiente paso

Si confirmas, puedo aplicar esta redacción en GitHub actualizando **título y cuerpo** de las issues #1–#17 con `gh issue edit` (requiere tu aprobación explícita para ejecutar los cambios remotos).
