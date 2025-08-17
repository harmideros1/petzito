# 🚀 Petzito Flow Builder

Sistema completo de gestión de flujos de formularios dinámicos con interfaz web interactiva y API REST robusta.

## ✨ **Características Principales**

### 🎯 **Flow Builder (Constructor de Flujos)**
- **Interfaz drag & drop** para crear flujos de formularios
- **Componentes arrastrables** (secciones, formularios, campos)
- **Editor visual intuitivo** con paleta de componentes
- **Preview en tiempo real** del formulario
- **Exportación/Importación** de flujos en formato JSON

### 📋 **Gestor de Flujos (Flow Manager)**
- **CRUD completo** de flujos (Crear, Leer, Actualizar, Eliminar)
- **Sistema de filtros avanzado:**
  - 🔍 Filtro por nombre (búsqueda en tiempo real)
  - 🌍 Filtro por país
  - 🏙️ Filtro por ciudad (filtrado inteligente por país)
  - 🧹 Botón para limpiar filtros
- **Paginación configurable:**
  - Items por página: 10, 20, 50, 100
  - Navegación entre páginas
  - Información de resultados
- **Ordenamiento inteligente:**
  - Por defecto: Más reciente primero
  - Toggle entre más reciente/antiguo
- **Interfaz moderna con iconos:**
  - ✏️ Icono de edición (azul)
  - 🗑️ Icono de eliminación (rojo)
  - Tooltips informativos
  - Hover effects

### 🔧 **Tipos de Campos Soportados**
- **Text** - Campos de texto simple
- **Textarea** - Campos de texto largo
- **Number** - Campos numéricos
- **Date** - Selectores de fecha
- **Checkbox** - Casillas de verificación
- **Select** - Menús desplegables
- **Email** - Campos de correo electrónico
- **Tel** - Campos de teléfono
- **File** - Subida de archivos
- **Camera** - Captura de fotos

### 🌍 **Sistema de Ubicaciones**
- **Países y ciudades** pre-cargados
- **Relaciones geográficas** automáticas
- **Filtrado inteligente** por ubicación
- **Validación** de ubicaciones

### 📱 **Preview Móvil**
- **Vista previa responsive** del formulario
- **Simulación de dispositivo móvil**
- **Validación visual** de campos

## 🏗️ **Arquitectura Técnica**

### **Backend (Rails 7.1 + PostgreSQL)**
- **API REST** con autenticación JWT
- **Base de datos** PostgreSQL con relaciones
- **Validaciones** robustas de JSON Schema
- **Serializers** para respuestas consistentes
- **CORS** configurado para desarrollo

### **Frontend (React 18 + TypeScript)**
- **Componentes funcionales** con hooks
- **TypeScript** para type safety
- **TailwindCSS** para estilos modernos
- **React DnD** para drag & drop
- **Estado local** con React hooks

### **Base de Datos**
- **Modelos:** Flow, Country, City, User
- **Relaciones:** Flows → Cities → Countries
- **Validaciones:** JSON Schema, ubicaciones
- **UUIDs** para identificadores únicos

## 🚀 **Scripts de Inicio Rápido**

### Para macOS/Linux:
```bash
# Iniciar stack completo (backend + frontend)
./start-stack.sh

# Solo backend Rails
./start-backend.sh

# Solo frontend React
./start-frontend.sh

# Detener todos los servicios
./stop-stack.sh
```

### Para Windows (PowerShell):
```powershell
# Iniciar stack completo
.\start-stack.ps1
```

### URLs Disponibles:
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000
- **API Docs**: http://localhost:3000/api-docs
- **Gestor de Flujos**: http://localhost:3001/flows

### Características de los Scripts:
- ✅ **Instalación automática** de dependencias
- ✅ **Configuración automática** de base de datos
- ✅ **Seeds automáticos** de países y ciudades
- ✅ **Monitoreo de servicios** en tiempo real
- ✅ **Logs centralizados** para debugging
- ✅ **Limpieza automática** al salir

📖 **Ver documentación completa**: [SCRIPTS-README.md](./SCRIPTS-README.md)

## 🔌 **API Endpoints**

### **Flows (Flujos)**
- `GET /flows` - Listar todos los flujos
- `POST /flows` - Crear nuevo flujo
- `GET /flows/:id` - Obtener flujo específico
- `PUT /flows/:id` - Actualizar flujo
- `DELETE /flows/:id` - Eliminar flujo
- `GET /flows/by_name/:name` - Buscar por nombre
- `GET /flows/by_city/:city_id` - Filtrar por ciudad
- `GET /flows/by_country/:country_id` - Filtrar por país

### **Locations (Ubicaciones)**
- `GET /countries` - Listar países
- `GET /countries/:id` - Obtener país específico
- `GET /cities` - Listar ciudades
- `GET /cities/:id` - Obtener ciudad específica

### **Authentication (Autenticación)**
- `POST /users/sign_up` - Registro de usuario
- `POST /users/sign_in` - Inicio de sesión
- `DELETE /users/sign_out` - Cerrar sesión

## 🎨 **Interfaz de Usuario**

### **Paleta de Componentes**
- **Secciones** - Agrupadores lógicos
- **Formularios** - Contenedores de campos
- **Campos** - Elementos de entrada de datos

### **Editor Visual**
- **Drag & Drop** intuitivo
- **Configuración** de propiedades
- **Validaciones** en tiempo real
- **Preview** del formulario

### **Gestor de Flujos**
- **Lista paginada** de flujos
- **Filtros avanzados** por múltiples criterios
- **Acciones rápidas** con iconos
- **Información detallada** de cada flujo

## 🔧 **Instalación y Configuración**

### **Requisitos Previos**
- Ruby 3.3.6+
- Node.js 18+
- PostgreSQL 12+
- Redis (para Sidekiq)

### **Backend (Rails)**
```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3000
```

### **Frontend (React)**
```bash
cd src
npm install
npm start
```

## 📊 **Estructura de Datos**

### **Flow JSON Schema**
```json
{
  "flow": {
    "sections": [
      {
        "id": "section_1",
        "name": "Datos Personales",
        "forms": [
          {
            "id": "form_1",
            "name": "Formulario Principal",
            "fields": [
              {
                "id": "field_1",
                "type": "text",
                "label": "Nombre",
                "placeholder": "Ingresa tu nombre",
                "validations": {
                  "required": true
                },
                "metadata": {
                  "translatable": true
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 🚀 **Roadmap y Futuras Funcionalidades**

### **Próximas Versiones**
- [ ] **Templates** de flujos predefinidos
- [ ] **Colaboración** en tiempo real
- [ ] **Versionado** de flujos
- [ ] **Analytics** de uso de formularios
- [ ] **Integración** con servicios externos
- [ ] **Multiidioma** completo
- [ ] **Temas visuales** personalizables

### **Mejoras Técnicas**
- [ ] **Caché** Redis para mejor performance
- [ ] **Background jobs** para procesamiento pesado
- [ ] **WebSockets** para actualizaciones en tiempo real
- [ ] **Tests** automatizados completos
- [ ] **CI/CD** pipeline

## 🤝 **Contribución**

### **Cómo Contribuir**
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Estándares de Código**
- **Backend**: Ruby on Rails conventions
- **Frontend**: React + TypeScript best practices
- **Base de datos**: PostgreSQL con migraciones
- **Tests**: RSpec para backend, Jest para frontend

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 **Contacto**

- **Equipo de Desarrollo**: dev@petzito.com
- **Sitio Web**: [petzito.com](https://petzito.com)
- **Documentación**: [docs.petzito.com](https://docs.petzito.com)

---

**Petzito Flow Builder** - Construye flujos de formularios dinámicos de manera intuitiva y profesional! 🎯✨
