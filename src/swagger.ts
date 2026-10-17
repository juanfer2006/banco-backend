import type { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Banco MVP API - Documentación OpenAPI',
    version: '1.0.0',
    description:
      'API Backend para la plataforma Banco MVP. Incluye autenticación, gestión de cuentas, transferencias, cajitas de ahorro, tarjetas, créditos y notificaciones.',
    contact: {
      name: 'Equipo de Desarrollo Banco MVP',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa el token JWT obtenido en /auth/login o /auth/register',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Descripción del error',
          },
        },
      },
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          full_name: { type: 'string', example: 'Carlos Rodríguez' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/Usuario' },
        },
      },
      Cuenta: {
        type: 'object',
        properties: {
          account_id: { type: 'string', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          account_number: { type: 'string', example: '1234567890' },
          type: { type: 'string', enum: ['SAVINGS', 'CHECKING'], example: 'SAVINGS' },
          balance: { type: 'string', example: '1500000.00' },
          available: { type: 'string', example: '1500000.00' },
          label: { type: 'string', example: 'Cuenta de ahorros principal' },
        },
      },
      TransferenciaRequest: {
        type: 'object',
        required: ['origen', 'destino', 'monto'],
        properties: {
          origen: { type: 'string', description: 'ID de la cuenta origen', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          destino: { type: 'string', description: 'ID de la cuenta destino', example: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' },
          monto: { type: 'number', description: 'Monto en pesos', example: 50000 },
          descripcion: { type: 'string', example: 'Pago de servicios' },
          claveIdempotencia: { type: 'string', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
        },
      },
      RecargaRetiroRequest: {
        type: 'object',
        required: ['monto'],
        properties: {
          destino: { type: 'string', description: 'ID de la cuenta (para recargas)', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          origen: { type: 'string', description: 'ID de la cuenta (para retiros)', example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' },
          monto: { type: 'number', example: 100000 },
          claveIdempotencia: { type: 'string', example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d' },
        },
      },
      SimulacionCreditoRequest: {
        type: 'object',
        required: ['monto', 'plazoMeses', 'tasaAnual'],
        properties: {
          monto: { type: 'number', example: 5000000 },
          plazoMeses: { type: 'integer', example: 12 },
          tasaAnual: { type: 'number', example: 0.25 },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        summary: 'Punto de entrada de la API',
        tags: ['General'],
        responses: {
          200: {
            description: 'Bienvenida e información de rutas disponibles',
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Verificar estado del servicio',
        tags: ['General'],
        responses: {
          200: {
            description: 'Servicio en funcionamiento',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    servicio: { type: 'string', example: 'banco-api' },
                    fecha: { type: 'string', example: '2026-10-17T16:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Registrar un nuevo usuario',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'full_name'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                  password: { type: 'string', example: 'Secreto123!' },
                  full_name: { type: 'string', example: 'Carlos Rodríguez' },
                  account_type: { type: 'string', enum: ['SAVINGS', 'CHECKING'], example: 'SAVINGS' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuario registrado con éxito',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: {
            description: 'Datos faltantes o correo ya registrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Iniciar sesión y obtener token JWT',
        tags: ['Autenticación'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'usuario@ejemplo.com' },
                  password: { type: 'string', example: 'Secreto123!' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Inicio de sesión exitoso',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: {
            description: 'Credenciales inválidas',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Obtener información del usuario autenticado',
        tags: ['Autenticación'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Datos del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/Usuario' },
                  },
                },
              },
            },
          },
          401: { description: 'Token faltante o inválido' },
        },
      },
    },
    '/cuentas/me': {
      get: {
        summary: 'Listar las cuentas y saldos del usuario autenticado',
        tags: ['Cuentas'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de cuentas del usuario',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Cuenta' },
                },
              },
            },
          },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/cuentas/{id}/movimientos': {
      get: {
        summary: 'Obtener los últimos movimientos de una cuenta',
        tags: ['Cuentas'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID de la cuenta',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Historial de movimientos',
          },
          401: { description: 'No autenticado' },
        },
      },
    },
    '/cuentas/buscar/{numero}': {
      get: {
        summary: 'Buscar cuenta destinataria por número de cuenta',
        tags: ['Cuentas'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'numero',
            in: 'path',
            required: true,
            description: 'Número de cuenta de 10 dígitos',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Cuenta encontrada' },
          404: { description: 'Cuenta no encontrada' },
        },
      },
    },
    '/transferencias': {
      post: {
        summary: 'Realizar una transferencia entre cuentas',
        tags: ['Transferencias'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransferenciaRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Transferencia realizada con éxito',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    transaccionId: { type: 'string' },
                  },
                },
              },
            },
          },
          400: { description: 'Fondos insuficientes o datos inválidos' },
        },
      },
    },
    '/transferencias/recarga': {
      post: {
        summary: 'Recargar saldo en una cuenta desde la caja del sistema',
        tags: ['Transferencias'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecargaRetiroRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Recarga completada con éxito' },
          400: { description: 'Monto inválido' },
        },
      },
    },
    '/transferencias/retiro': {
      post: {
        summary: 'Retirar dinero de una cuenta',
        tags: ['Transferencias'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecargaRetiroRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Retiro completado con éxito' },
          400: { description: 'Saldo insuficiente o datos inválidos' },
        },
      },
    },
    '/tarjetas': {
      get: {
        summary: 'Obtener todas las tarjetas del usuario',
        tags: ['Tarjetas'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lista de tarjetas (débito y crédito)' },
        },
      },
    },
    '/tarjetas/debito': {
      post: {
        summary: 'Solicitar una nueva tarjeta de débito',
        tags: ['Tarjetas'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Tarjeta de débito emitida con éxito' },
        },
      },
    },
    '/tarjetas/credito': {
      post: {
        summary: 'Solicitar una nueva tarjeta de crédito',
        tags: ['Tarjetas'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Tarjeta de crédito aprobada y emitida' },
        },
      },
    },
    '/cajitas': {
      get: {
        summary: 'Listar las cajitas de ahorro (bolsillos) del usuario',
        tags: ['Cajitas de Ahorro'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lista de cajitas de ahorro' },
        },
      },
      post: {
        summary: 'Crear una nueva cajita de ahorro',
        tags: ['Cajitas de Ahorro'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['nombre', 'meta'],
                properties: {
                  nombre: { type: 'string', example: 'Ahorro Vacaciones' },
                  meta: { type: 'number', example: 1200000 },
                  target_date: { type: 'string', format: 'date', example: '2026-12-31' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Cajita creada exitosamente' },
        },
      },
    },
    '/cajitas/mover': {
      post: {
        summary: 'Mover dinero entre la cuenta principal y una cajita de ahorro',
        tags: ['Cajitas de Ahorro'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['cajitaId', 'monto', 'direccion'],
                properties: {
                  cajitaId: { type: 'string', example: 'cajita-uuid-a1b2c3' },
                  monto: { type: 'number', example: 50000 },
                  direccion: { type: 'string', enum: ['DEPOSITAR', 'RETIRAR'], example: 'DEPOSITAR' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Fondos transferidos a/desde la cajita' },
        },
      },
    },
    '/creditos/simular': {
      post: {
        summary: 'Simular cuotas de un crédito mediante sistema de amortización francés',
        tags: ['Créditos y Préstamos'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SimulacionCreditoRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Simulación calculada con tabla de amortización',
          },
        },
      },
    },
    '/creditos/solicitar': {
      post: {
        summary: 'Solicitar un crédito bancario con evaluación de riesgo / scoring',
        tags: ['Créditos y Préstamos'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['monto', 'plazoMeses', 'ingresosMensuales'],
                properties: {
                  monto: { type: 'number', example: 3000000 },
                  plazoMeses: { type: 'integer', example: 12 },
                  ingresosMensuales: { type: 'number', example: 2500000 },
                  estrato: { type: 'integer', example: 3 },
                  antiguedadMeses: { type: 'integer', example: 18 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Resultado de la evaluación y desembolso si es aprobado' },
        },
      },
    },
    '/creditos': {
      get: {
        summary: 'Listar préstamos activos del usuario',
        tags: ['Créditos y Préstamos'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lista de préstamos' },
        },
      },
    },
    '/creditos/{id}/cuotas': {
      get: {
        summary: 'Obtener plan de cuotas de un crédito específico',
        tags: ['Créditos y Préstamos'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID del préstamo',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: { description: 'Lista de cuotas del préstamo' },
        },
      },
    },
    '/creditos/{prestamoId}/cuotas/{cuotaId}/pagar': {
      post: {
        summary: 'Pagar una cuota vencida o pendiente del crédito',
        tags: ['Créditos y Préstamos'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'prestamoId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'cuotaId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Cuota pagada con éxito' },
        },
      },
    },
    '/notificaciones': {
      get: {
        summary: 'Listar las notificaciones del usuario autenticado',
        tags: ['Notificaciones'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Lista de notificaciones' },
        },
      },
    },
    '/notificaciones/{id}/leida': {
      patch: {
        summary: 'Marcar una notificación como leída',
        tags: ['Notificaciones'],
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Notificación marcada como leída' },
        },
      },
    },
    '/notificaciones/todas/leidas': {
      patch: {
        summary: 'Marcar todas las notificaciones como leídas',
        tags: ['Notificaciones'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Todas las notificaciones marcadas como leídas' },
        },
      },
    },
  },
};

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
