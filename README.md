# Banco MVP - Backend API (Servicio Central Bancario)

Servicio backend de **Banco MVP**, diseñado con arquitectura hexagonal / limpia, libro mayor contable (*Double-Entry Ledger*), motor de reglas declarativas de crédito y documentación interactiva bajo OpenAPI / Swagger.

---

## 1. Tecnologías y Versiones

| Tecnología / Herramienta | Versión | Rol / Propósito |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.x` (LTS) | Entorno de ejecución de JavaScript del lado del servidor |
| **TypeScript** | `5.7.2` | Tipado estático y chequeo en tiempo de compilación |
| **Express.js** | `4.21.2` | Framework HTTP para rutas y middleware REST |
| **PostgreSQL** | `16-alpine` | Motor de base de datos relacional para producción y Docker |
| **PGlite (@electric-sql/pglite)** | `0.5.8` | Motor PostgreSQL WASM embebido para desarrollo local sin dependencias |
| **pg** | `8.23.0` | Cliente oficial de conexión a PostgreSQL con Pool |
| **Swagger UI Express** | `5.0.1` | Interfaz interactiva de documentación OpenAPI |
| **Swagger JSDoc** | `6.3.0` | Especificación y esquemas OpenAPI 3.0.0 |
| **BcryptJS** | `3.0.3` | Hashing seguro unidireccional de contraseñas |
| **JSON Web Token (JWT)** | `9.0.3` | Autenticación basada en tokens Bearer stateless |
| **Node Test Runner & TSX** | `Node:test` / `4.19.2` | Suite de pruebas unitarias de lógica pura y ejecución TypeScript |
| **Docker & Docker Compose** | Multi-stage / Compose v2 | Contenerización y orquestación de servicios |

---

## 2. Imagen en DockerHub

Este proyecto cuenta con su imagen pública en DockerHub lista para ser descargada y desplegada:

* **Repositorio DockerHub:** `juanfer2006/banco-backend`
* **Tag:** `latest`
* **URL:** `https://hub.docker.com/r/juanfer2006/banco-backend`

### Descargar desde DockerHub
```bash
docker pull juanfer2006/banco-backend:latest
```

### Ejecutar contenedor individual desde DockerHub
```bash
docker run -d --name banco-backend -p 3000:3000 -e PORT=3000 juanfer2006/banco-backend:latest
```

### Construir y publicar imagen (para desarrolladores)
```bash
# Construir imagen localmente
docker build -t juanfer2006/banco-backend:latest .

# Iniciar sesión y publicar en DockerHub
docker login
docker push juanfer2006/banco-backend:latest
```

---

## 3. Cómo Descargar el Código (Clonación)

### Clonación independiente
```bash
git clone https://github.com/juanfer2006/banco-backend.git
cd banco-backend
```

### Clonación como parte del Monorepo con submódulos
```bash
git clone --recurse-submodules <URL_DEL_MONOREPO>
```

---

## 4. Requisitos e Instrucciones de Instalación y Ejecución

### Requisitos Previos
* **Node.js** v20 o superior
* **npm** v10 o superior
* **Docker y Docker Compose** (opcional, para ejecución contenerizada)

### Opción A: Ejecución Local en Desarrollo (Cero configuración con PGlite)
El backend incluye soporte nativo para **PGlite**, lo que permite arrancar el servidor sin necesidad de instalar o configurar PostgreSQL manualmente.

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar archivo de variables de entorno (opcional)
cp .env.example .env

# 3. Iniciar el servidor en modo desarrollo (recarga en caliente)
npm run dev
```

El servidor quedará disponible en: `http://localhost:3000`

### Opción B: Ejecución Contenerizada con Dockerfile
```bash
# Construir la imagen Docker
docker build -t banco-backend .

# Ejecutar el contenedor
docker run -d --name banco-api -p 3000:3000 banco-backend
```

### Opción C: Orquestación con Docker Compose (Junto a BD y Frontend)
Desde la raíz del monorepo:
```bash
docker compose up --build
```

---

## 5. Documentación de la API (Swagger / OpenAPI)

El backend expone la especificación OpenAPI 3.0.0 interactiva para probar todos los endpoints:

* **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* **Especificación JSON OpenAPI:** [http://localhost:3000/api-docs/json](http://localhost:3000/api-docs/json)
* **Health Check:** [http://localhost:3000/health](http://localhost:3000/health)

Endpoints documentados:
* `POST /auth/register` - Registro de nuevos usuarios y creación automática de cuenta corriente
* `POST /auth/login` - Autenticación con generación de token Bearer JWT
* `GET /cuentas` - Cuentas asociadas al usuario con saldos calculados
* `POST /transferencias` - Transferencia entre cuentas con libro mayor contable y balance estricto
* `GET /transferencias/movimientos/:accountId` - Historial de asientos contables
* `GET /tarjetas` y `POST /tarjetas` - Emisión y control de tarjetas (activar, congelar)
* `POST /cajitas` y `POST /cajitas/mover` - Metas de ahorro y traspaso de fondos
* `POST /creditos/simular` y `POST /creditos/solicitar` - Simulador y motor de reglas de crédito
* `GET /notificaciones` - Alertas financieras generadas por eventos

---

## 6. Historias de Usuario Asignadas

| Código | Historia de Usuario | Descripción Técnica | Responsable |
| :--- | :--- | :--- | :--- |
| **HU-01** | Autenticación y Registro Seguro | Registro de cliente, hashing Bcrypt, generación y validación de tokens JWT. Creación automática de cuenta corriente vinculada. | **Juan Fernando Ramírez (juanfer2006)** |
| **HU-02** | Contabilidad por Partida Doble (Double-Entry Ledger) | Modelo de libro mayor (`ledger_entries`) con garantía de cuadre a cero y cálculo funcional puro de saldos. | **Juan Fernando Ramírez (juanfer2006)** |
| **HU-03** | Transferencias Bancarias Inmediatas | Transferencias atómicas entre cuentas con control de saldo disponible, idempotencia y validaciones de cuenta activa. | **Tomás Buriticá (buri033)** |
| **HU-04** | Motor de Créditos y Amortización Francesa | Cálculo de cuota fija (método francés), tabla de amortización, conversión de tasas EA a mensual y motor declarativo de reglas de riesgo. | **Tomás Buriticá (buri033)** |
| **HU-05** | Documentación OpenAPI / Swagger y Healthcheck | Configuración del endpoint `/api-docs` y `/health` para validación de arquitectura e inspección de endpoints. | **Juan Fernando Ramírez (juanfer2006)** |
| **HU-06** | Contenerización Docker y Esquema BD | Dockerfile optimizado sobre Alpine Linux, scripts SQL iniciales y compatibilidad dual PGlite/Postgres. | **Tomás Buriticá (buri033)** |

---

## 7. Pruebas Unitarias

El backend incluye una suite exhaustiva de **33 pruebas unitarias** que validan el 100% de la lógica de dominio bancaria (Value Objects de Dinero, cálculo de saldos funcional vs imperativo, algoritmos de amortización de deuda, invariantes contables, motor de scoring y validación Luhn para tarjetas).

### Ejecutar pruebas
```bash
npm test
```

### Validar tipos (TypeScript)
```bash
npm run typecheck
```
