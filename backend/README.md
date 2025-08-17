# Petzito Backend

Backend en Ruby on Rails para la gestión de flujos de formularios dinámicos con autenticación de usuarios y persistencia de progreso.

## Características

- **Autenticación**: Sistema completo de registro y login usando Devise
- **Gestión de Flujos**: CRUD completo para flujos de formularios
- **Geolocalización**: Asignación de flujos a ciudades y países
- **Validación de JSON**: Validación estricta de la estructura de flujos
- **Persistencia de Progreso**: Sistema de soluciones para guardar el avance del usuario
- **UUIDs**: Identificadores únicos en lugar de IDs autoincrementales
- **API RESTful**: Endpoints bien estructurados para integración

## Tecnologías

- Ruby on Rails 7.1
- PostgreSQL
- Devise (autenticación)
- RSpec (pruebas)
- FactoryBot (factories para pruebas)
- ActiveModel Serializers

## Requisitos

- Ruby 3.3.6+
- PostgreSQL 12+
- Node.js (para asset pipeline)

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   bundle install
   ```

3. **Configurar base de datos**
   ```bash
   # Crear archivo .env con credenciales de PostgreSQL
   cp .env.example .env

   # Editar .env con tus credenciales
   POSTGRES_USER=tu_usuario
   POSTGRES_PASSWORD=tu_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

4. **Crear y configurar base de datos**
   ```bash
   rails db:create
   rails db:migrate
   ```

5. **Inicializar datos de prueba (opcional)**
   ```bash
   rails db:seed
   ```

6. **Iniciar servidor**
   ```bash
   rails server
   ```

El servidor estará disponible en `http://localhost:3000`

## Estructura de la Base de Datos

### Modelos Principales

- **User**: Usuarios autenticados (Devise)
- **Country**: Países
- **City**: Ciudades (pertenecen a países)
- **Flow**: Flujos de formularios (asignados a ciudades/países)

### Modelos de Soluciones (Persistencia de Progreso)

- **FlowSolution**: Solución de un usuario para un flujo
- **SectionSolution**: Progreso en una sección específica
- **FormSolution**: Progreso en un formulario específico
- **FieldSolution**: Valores de campos completados

## API Endpoints

### Autenticación

```
POST /users/sign_up          # Registro de usuario
POST /users/sign_in          # Login de usuario
DELETE /users/sign_out       # Logout de usuario
```

### Flujos

```
POST   /flows                # Crear flujo
GET    /flows/:id            # Obtener flujo por ID
PUT    /flows/:id            # Actualizar flujo
DELETE /flows/:id            # Eliminar flujo

# Endpoints de búsqueda
GET    /flows/by_name/:name          # Buscar por nombre
GET    /flows/by_city/:city_id       # Flujos de una ciudad
GET    /flows/by_country/:country_id # Flujos de un país
```

### Formato de Respuesta

Todas las respuestas incluyen:
- ID único del flujo
- Nombre del flujo
- JSON del esquema
- Información de ciudad y/o país asignados
- Timestamps de creación y actualización

## Validaciones

### Flujos

- **Nombre**: Único, solo letras y números, máximo 64 caracteres
- **JSON Schema**: Estructura válida con secciones, formularios y campos
- **Ubicación**: Al menos una ciudad o país asignado

### Estructura JSON Requerida

```json
{
  "sections": [
    {
      "id": "section1",
      "title": "Título de la Sección",
      "forms": [
        {
          "id": "form1",
          "fields": [
            {
              "id": "field1",
              "type": "text",
              "label": "Etiqueta del Campo"
            }
          ]
        }
      ]
    }
  ]
}
```

## Ejemplos de Uso

### Crear un Flujo

```bash
curl -X POST http://localhost:3000/flows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "flow": {
      "name": "EncuestaCliente",
      "city_id": 1,
      "json_schema": {
        "sections": [
          {
            "id": "datos_personales",
            "title": "Datos Personales",
            "forms": [
              {
                "id": "form_principal",
                "fields": [
                  {
                    "id": "nombre",
                    "type": "text",
                    "label": "Nombre completo"
                  },
                  {
                    "id": "email",
                    "type": "email",
                    "label": "Correo electrónico"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  }'
```

### Obtener Flujos por Ciudad

```bash
curl -X GET http://localhost:3000/flows/by_city/1 \
  -H "Authorization: Bearer <token>"
```

## Pruebas

### Ejecutar Pruebas

```bash
# Todas las pruebas
bundle exec rspec

# Pruebas específicas
bundle exec rspec spec/models/
bundle exec rspec spec/controllers/
bundle exec rspec spec/services/

# Con coverage
COVERAGE=true bundle exec rspec
```

### Estructura de Pruebas

- **Modelos**: Validaciones, relaciones y callbacks
- **Servicios**: Lógica de negocio (validación de JSON)
- **Controladores**: Endpoints y autenticación
- **Factories**: Datos de prueba con FactoryBot

## Desarrollo

### Generar Nuevos Recursos

```bash
# Generar modelo
rails generate model NombreModelo campo:tipo

# Generar controlador
rails generate controller NombreController

# Generar migración
rails generate migration NombreMigracion
```

### Base de Datos

```bash
# Crear migración
rails generate migration NombreMigracion

# Ejecutar migraciones
rails db:migrate

# Revertir migración
rails db:rollback

# Reset completo
rails db:reset
```

### Consola de Rails

```bash
rails console
```

## Despliegue

### Variables de Entorno

```bash
# Producción
RAILS_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/database
SECRET_KEY_BASE=<generated-secret>
```

### Comandos de Despliegue

```bash
# Precompilar assets
rails assets:precompile

# Verificar base de datos
rails db:migrate:status

# Ejecutar seeds si es necesario
rails db:seed
```

## Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## Soporte

Para soporte técnico o preguntas, contactar al equipo de desarrollo o crear un issue en el repositorio.
