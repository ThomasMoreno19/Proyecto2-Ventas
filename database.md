# Base de Datos

El esquema incluye las tablas estándar de Better Auth:
- **User**: Información básica del usuario
- **Account**: Credenciales y proveedores de autenticación
- **Session**: Sesiones activas
- **Verification**: Códigos OTP temporales

## Configuración de Base de Datos

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Better Auth
BETTER_AUTH_SECRET=tu-secreto-super-seguro-aqui
BETTER_AUTH_URL=http://localhost:3000

# Base de datos MongoDB
DATABASE_URL="mongodb://localhost:27017/ventas-db"
```

**Nota**: Reemplazar los valores con tu configuración real:
- `BETTER_AUTH_SECRET`: Generar un string aleatorio seguro (mínimo 32 caracteres)
- `BETTER_AUTH_URL`: URL base de tu aplicación (para desarrollo: `http://localhost:3000`)
- `DATABASE_URL`: Cadena de conexión a tu instancia de MongoDB

### Comandos de Configuración

1. **Generar cliente de Prisma**:
   ```bash
   bunx prisma generate
   ```
   Este comando genera el cliente de Prisma basado en el esquema definido en `prisma/schema.prisma`.

2. **Sincronizar esquema con la base de datos**:
   ```bash
   bunx prisma db push
   ```
   Este comando aplica los cambios del esquema a la base de datos MongoDB sin crear migraciones.

3. **Verificar conexión** (opcional):
   ```bash
   bunx prisma studio
   ```
   Abre Prisma Studio para visualizar y gestionar los datos de la base de datos.

### Estructura de Tablas

Después de ejecutar `bunx prisma db push`, se crearán las siguientes colecciones en MongoDB:

- **user**: Información básica de usuarios
- **account**: Credenciales y proveedores de autenticación
- **session**: Sesiones activas de usuarios
- **verification**: Códigos OTP temporales para verificación