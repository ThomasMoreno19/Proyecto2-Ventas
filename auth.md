# Sistema de Autenticación y Gestión de Usuarios

## Arquitectura General

Este backend utiliza **Better Auth** como sistema de autenticación principal, integrado con NestJS mediante `@thallesp/nestjs-better-auth`. La arquitectura sigue el patrón de repositorio para separar la lógica de negocio de la persistencia de datos.

## Componentes del Sistema

### 1. Configuración de Better Auth (`src/lib/auth.ts`)

**Características principales:**
- **Email y contraseña**: Autenticación tradicional habilitada
- **Plugin Email OTP**: Para verificación de email y recuperación de contraseña
- **Campos adicionales**: Rol de usuario con valor por defecto 'USER'
- **Base de datos**: MongoDB con Prisma ORM

### 2. Endpoints de Usuario (`src/users/users.controller.ts`)

Todos los endpoints son públicos por defecto (guard global deshabilitado):


### 3. Lógica de Negocio (`src/users/users.service.ts`)

El servicio actúa como intermediario entre el controlador y Better Auth:


### 4. Repositorio de Datos (`src/users/repository/users.repository.ts`)

El repositorio maneja operaciones de lectura y actualización de usuarios:

## Flujo de Autenticación

### 1. Registro de Usuario
1. Cliente envía `POST /users/register` con email, contraseña y nombre
2. Servicio llama a `authService.api.signUpEmail()`
3. Better Auth crea usuario en base de datos y maneja hash de contraseña
4. Retorna respuesta con datos del usuario (sin auto-login)

### 2. Verificación de Email
1. Cliente solicita `POST /users/email/otp` con email y tipo 'email-verification'
2. Better Auth genera OTP y lo registra en consola
3. Cliente envía `POST /users/email/verify` con email y OTP
4. Better Auth verifica OTP y actualiza `emailVerified: true`

### 3. Recuperación de Contraseña
1. Cliente solicita `POST /users/password/reset/request` con email
2. Better Auth genera OTP para recuperación y lo registra en consola
3. Cliente envía `POST /users/password/reset/confirm` con email, OTP y nueva contraseña
4. Better Auth verifica OTP y actualiza la contraseña

## DTOs y Validación

Todos los endpoints utilizan DTOs con validación automática:

- **RegisterDto**: `name` (min 2 chars), `email` (formato válido), `password` (min 8 chars)
- **CheckEmailDto**: `email` (formato válido)
- **SendEmailOtpDto**: `email` (formato válido), `type` ('email-verification' | 'forget-password')
- **VerifyEmailOtpDto**: `email` (formato válido), `otp` (4-8 chars)
- **ResetPasswordDto**: `email` (formato válido), `otp` (4-8 chars), `password` (min 8 chars)

## Seguridad

- **Validación global**: ValidationPipe habilitado con whitelist y transform
- **Headers de request**: Se pasan correctamente a Better Auth para manejo de cookies/sesiones
- **OTP logging**: En desarrollo, los códigos OTP se registran en consola
- **Sin auto-login**: Los usuarios deben verificar email antes de poder iniciar sesión

## Próximos Pasos

Para hacer endpoints privados, se puede usar:
- `@UseGuards(AuthGuard)` para proteger rutas específicas
- `@Roles(['admin'])` para control de acceso basado en roles
- `@AllowAnonymous()` para mantener rutas públicas cuando el guard global esté habilitado
