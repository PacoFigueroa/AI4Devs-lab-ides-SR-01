# LTI - Sistema de Seguimiento de Talento (ATS)

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## 🎯 Nueva Característica: Gestión de Candidatos

El sistema ahora incluye un **flujo completo de adición de candidatos** con las siguientes características:

✨ **Características Principales:**

- Formulario completo de captura de datos del candidato
- Validación en tiempo real (cliente y servidor)
- Historial de educación y experiencia laboral
- Carga de documentos (CV/Resume en PDF o DOCX)
- Autocompletado inteligente para instituciones y empresas
- Diseño responsive y accesible (WCAG compliant)
- Manejo robusto de errores

📚 **Documentación Completa:**

- [**SETUP.md**](SETUP.md) - Guía de instalación y configuración
- [**CANDIDATE_WORKFLOW.md**](CANDIDATE_WORKFLOW.md) - Documentación detallada de características
- [**PROJECT_SUMMARY.md**](PROJECT_SUMMARY.md) - Resumen del proyecto y arquitectura
- [**TESTING.md**](TESTING.md) - Documentación completa de testing (TDD/BDD)
- [**TEST_IMPLEMENTATION_SUMMARY.md**](TEST_IMPLEMENTATION_SUMMARY.md) - Resumen de implementación de tests

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript.

- El directorio `src` contiene el código fuente
- El directorio `prisma` contiene el esquema de Prisma.

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js v16 o superior
- PostgreSQL v13 o superior
- npm v8 o superior

### Instalación

1. **Clona el repositorio:**

```bash
git clone <repository-url>
cd AI4Devs-lab-ides-SR-01
```

2. **Configura la base de datos:**

```bash
# Inicia PostgreSQL con Docker
docker-compose up -d

# O crea la base de datos manualmente
psql -U postgres
CREATE DATABASE ats_db;
\q
```

3. **Configura el Backend:**

```bash
cd backend
npm install

# Crea y configura el archivo .env (ver .env.example)
# DATABASE_URL="postgresql://user:password@localhost:5432/ats_db?schema=public"

# Genera el cliente de Prisma y sincroniza la base de datos
npm run prisma:generate
npx prisma db push
```

4. **Configura el Frontend:**

```bash
cd ../frontend
npm install

# Crea archivo .env
echo "REACT_APP_API_URL=http://localhost:3010" > .env
```

### Ejecutar la Aplicación

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

El servidor backend estará corriendo en http://localhost:3010

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

El frontend estará disponible en http://localhost:3000

### 🎯 Probar el Sistema

1. Abre tu navegador en `http://localhost:3000`
2. Completa el formulario de candidato con:
   - Información personal (nombre, email, teléfono)
   - Educación (puedes agregar múltiples entradas)
   - Experiencia laboral (puedes agregar múltiples entradas)
   - Documentos (CV/Resume en PDF o DOCX)
3. Observa la validación en tiempo real
4. Envía el formulario y ve el mensaje de éxito

Para más detalles, consulta [SETUP.md](SETUP.md).

## 🧪 Testing

El proyecto incluye una suite completa de tests siguiendo TDD (Test-Driven Development) y BDD (Behavior-Driven Development).

### Ejecutar Tests

**Todos los tests:**

```bash
./run-tests.sh
```

**Con cobertura:**

```bash
./run-tests.sh --coverage
```

**Solo backend:**

```bash
cd backend
npm test
```

**Solo frontend:**

```bash
cd frontend
npm test
```

### Cobertura de Tests

- ✅ **120+ casos de prueba** (unit + integration + BDD)
- ✅ **20+ escenarios BDD** en formato Gherkin
- ✅ **>80% cobertura de código** objetivo
- ✅ Validaciones completas
- ✅ Tests de API endpoints
- ✅ Tests de utilidades
- ✅ Manejo de errores

**Tipos de Tests:**

- **Unit Tests**: Validación, utilidades, funciones puras
- **Integration Tests**: API endpoints con base de datos
- **BDD Scenarios**: Comportamiento en lenguaje natural

**Documentación:**

- Ver [TESTING.md](TESTING.md) para documentación completa
- Ver [TEST_IMPLEMENTATION_SUMMARY.md](TEST_IMPLEMENTATION_SUMMARY.md) para detalles de implementación

**Ejemplo de test:**

```typescript
describe("validateEmail", () => {
  it("should accept valid email addresses", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });
});
```

**Ejemplo BDD:**

```gherkin
Scenario: Successfully add a new candidate
  Given I have candidate information
  When I submit the candidate form
  Then the candidate should be created successfully
```

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:

```
docker-compose up -d
```

Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:

- Host: localhost
- Port: 5432
- User: postgres
- Password: password
- Database: mydatabase

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo .env.

Para detener el contenedor Docker, ejecuta el siguiente comando:

```
docker-compose down
```
