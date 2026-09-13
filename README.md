# Sistema de Reserva de Canchas Deportivas

Aplicación web full stack desarrollada con **Next.js, TypeScript, PostgreSQL y Prisma** para la gestión y reserva de canchas deportivas.

El sistema permite a los clientes registrarse, consultar canchas disponibles, seleccionar horarios, realizar reservas y pagar mediante **Mercado Pago**. Además, incluye un backoffice protegido para la administración de canchas y reservas.

## Funcionalidades

### Cliente

- Registro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante JWT.
- Access Token y Refresh Token mediante cookies HttpOnly.
- Visualización de canchas disponibles.
- Visualización del detalle de cada cancha.
- Consulta de horarios disponibles por fecha.
- Reserva de bloques de 1 hora.
- Prevención de reservas duplicadas.
- Visualización de reservas realizadas.
- Pago de reservas mediante Mercado Pago.
- Confirmación automática de reservas al aprobarse el pago.
- Expiración automática de reservas pendientes de pago.
- Liberación del horario cuando una reserva vence.

### Administrador

- Acceso a backoffice mediante rol `ADMIN`.
- Protección de rutas administrativas.
- Visualización de todas las reservas.
- Visualización del estado de reserva y pago.
- Cancelación de reservas pendientes.
- Gestión de canchas.
- Creación de nuevas canchas.
- Edición de canchas.
- Activación e inactivación de canchas.

## Flujo de reserva

```text
Usuario inicia sesión
        ↓
Selecciona cancha
        ↓
Selecciona fecha
        ↓
Consulta disponibilidad
        ↓
Selecciona horario
        ↓
Reserva creada como PENDING
        ↓
15 minutos para realizar el pago
        ↓
┌───────────────────────┬────────────────────────┐
│                       │                        │
Pago aprobado       No realiza pago        Pago rechazado
│                       │                        │
↓                       ↓                        ↓
CONFIRMED             CANCELED                 PENDING
Payment APPROVED      Horario liberado
```

## Pago con Mercado Pago

El sistema utiliza **Mercado Pago Checkout Pro / Orders API**.

El precio de la reserva no es enviado desde el frontend. El backend obtiene el precio directamente desde la cancha registrada en la base de datos.

```text
Booking PENDING
      ↓
Crear Order en Mercado Pago
      ↓
Usuario realiza pago
      ↓
Mercado Pago
      ↓
Verificación de Order
      ↓
processed + accredited
      ↓
Payment APPROVED
      ↓
Booking CONFIRMED
```

También se implementó un Webhook de Mercado Pago para recibir actualizaciones de las órdenes.

Durante desarrollo puede utilizarse **VS Code Port Forwarding / Dev Tunnels** para exponer públicamente el endpoint:

```text
/api/webhooks/mercadopago
```

## Reglas principales del sistema

- Cada reserva representa un bloque de **1 hora**.
- Horario disponible: **10:00 a 22:00**.
- Las horas disponibles para reservar son de `10` a `21`.
- Una cancha no puede tener dos reservas activas para la misma fecha y hora.
- Las reservas nuevas se crean como `PENDING`.
- Una reserva pendiente tiene **15 minutos para ser pagada**.
- Si vence el tiempo de pago, pasa a `CANCELED`.
- Una reserva pagada pasa a `CONFIRMED`.
- Una cancha inactiva no aparece en el catálogo público.
- El usuario no puede enviar directamente:
  - `userId`
  - `totalPrice`
  - `status`
- Estos valores son determinados por el backend.

## Seguridad

El proyecto implementa:

- Contraseñas almacenadas mediante hash con `bcryptjs`.
- JWT para autenticación.
- Access Token de corta duración.
- Refresh Token de mayor duración.
- Cookies `HttpOnly`.
- Protección de rutas según rol.
- Validación de permisos también en los endpoints.
- Validaciones del lado servidor.
- Prevención de manipulación del precio.
- Restricción de reservas duplicadas.
- Transacciones de base de datos para operaciones críticas.
- Validación de pagos directamente contra Mercado Pago.

## Tecnologías utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM 7
- Prisma PostgreSQL Adapter
- bcryptjs
- JOSE
- JWT
- Mercado Pago
- REST API
- ESLint

## Arquitectura

El proyecto utiliza una arquitectura organizada por módulos.

```text
app/
├── api/
│   ├── auth/
│   ├── bookings/
│   ├── courts/
│   ├── payments/
│   └── webhooks/
│
├── backoffice/
├── canchas/
├── login/
├── registro/
├── mis-reservas/
└── pago/

lib/
├── config/
├── db/
└── generated/

modules/
├── auth/
├── bookings/
├── courts/
└── payments/

prisma/
├── migrations/
├── schema.prisma
└── seed.sql
```

La lógica sigue principalmente este flujo:

```text
Route Handler
      ↓
Service
      ↓
Repository
      ↓
Prisma
      ↓
PostgreSQL
```

### Repository

Se encarga del acceso a datos mediante Prisma.

### Service

Contiene las reglas y lógica de negocio.

### Route Handler

Expone los endpoints HTTP y gestiona las respuestas de la API.

## Base de datos

El proyecto utiliza PostgreSQL.

Entidades principales:

```text
User
Court
Booking
Payment
```

Relaciones principales:

```text
User
 └── Booking

Court
 └── Booking

Booking
 └── Payment
```

Estados de reserva:

```text
PENDING
CONFIRMED
CANCELED
```

Estados de pago:

```text
PENDING
APPROVED
REJECTED
```

## Variables de entorno

Crear un archivo:

```text
.env.local
```

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reservas_canchas
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD

JWT_ACCESS_SECRET=TU_ACCESS_SECRET
JWT_REFRESH_SECRET=TU_REFRESH_SECRET

MERCADO_PAGO_ACCESS_TOKEN=TU_ACCESS_TOKEN
MERCADO_PAGO_WEBHOOK_SECRET=TU_WEBHOOK_SECRET

APP_URL=http://localhost:3000
```

> No subir credenciales reales al repositorio.

Si se prueba Mercado Pago mediante una URL pública de desarrollo, `APP_URL` puede configurarse temporalmente con la URL pública utilizada para la prueba.

## Instalación

Clonar el repositorio e instalar dependencias:

```bash
npm install
```

## Base de datos

Crear la base de datos PostgreSQL:

```sql
CREATE DATABASE reservas_canchas;
```

Ejecutar las migraciones:

```bash
npx prisma migrate dev
```

Generar Prisma Client:

```bash
npx prisma generate
```

Cargar datos iniciales de canchas:

```bash
npx prisma db execute --file prisma/seed.sql
```

Opcionalmente se puede visualizar la base de datos con:

```bash
npx prisma studio
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

## Compilar para producción

```bash
npm run build
```

Ejecutar la versión compilada:

```bash
npm start
```

## Validación de código

Ejecutar ESLint:

```bash
npm run lint
```

## Rutas principales

### Cliente

```text
/login
/registro
/canchas
/canchas/[id]
/mis-reservas
/pago/exito
/pago/pendiente
/pago/error
```

### Administración

```text
/backoffice
/backoffice/reservas
/backoffice/canchas
/backoffice/canchas/nueva
/backoffice/canchas/[id]/editar
```

## API

Principales endpoints:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me

GET  /api/courts
POST /api/courts
PATCH /api/courts/[id]

GET /api/courts/[id]/availability

GET  /api/bookings
POST /api/bookings
PATCH /api/bookings/[id]/status

POST /api/payments/checkout
POST /api/payments/sync

POST /api/webhooks/mercadopago
```

Los endpoints administrativos validan que el usuario autenticado tenga rol:

```text
ADMIN
```

## Roles

### USER

Puede:

- Consultar canchas.
- Revisar disponibilidad.
- Crear reservas.
- Pagar reservas.
- Consultar sus reservas.

### ADMIN

Puede:

- Acceder al backoffice.
- Consultar las reservas realizadas.
- Consultar información de pagos.
- Cancelar reservas permitidas.
- Crear canchas.
- Editar canchas.
- Activar o inactivar canchas.

## Estado del proyecto

Actualmente se encuentran implementados:

- Autenticación.
- Registro de usuarios.
- Roles.
- Refresh Token.
- CRUD de canchas.
- Disponibilidad de horarios.
- Reservas.
- Prevención de doble reserva.
- Expiración de reservas.
- Backoffice.
- Mercado Pago.
- Webhooks.
- Sincronización de pagos.
- Confirmación automática de reservas.
- Build de producción.
- Validación ESLint.

## Autor

Proyecto desarrollado como aplicación full stack utilizando Next.js, TypeScript, Prisma y PostgreSQL.