# 🚀 Scripts de Inicio - Petzito Full Stack

Este directorio contiene scripts para gestionar fácilmente el stack completo de Petzito.

## 📁 Scripts Disponibles

### 1. `start-stack.sh` - Stack Completo
**Inicia tanto el backend Rails como el frontend React**

```bash
./start-stack.sh
```

**Características:**
- ✅ Inicia backend Rails en puerto 3000
- ✅ Inicia frontend React en puerto 3001
- ✅ Verifica dependencias e instala si es necesario
- ✅ Configura base de datos automáticamente
- ✅ Ejecuta seeds de países y ciudades
- ✅ Monitorea servicios en tiempo real
- ✅ Opción de ver logs en tiempo real
- ✅ Limpieza automática al salir (Ctrl+C)

**URLs disponibles:**
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api-docs

### 2. `start-backend.sh` - Solo Backend
**Inicia únicamente el servidor Rails**

```bash
./start-backend.sh
```

**Características:**
- ✅ Inicia solo backend Rails en puerto 3000
- ✅ Logs en tiempo real en la consola
- ✅ Verifica dependencias y base de datos
- ✅ Ideal para desarrollo backend

### 3. `start-frontend.sh` - Solo Frontend
**Inicia únicamente la aplicación React**

```bash
./start-frontend.sh
```

**Características:**
- ✅ Inicia solo frontend React en puerto 3001
- ✅ Logs en tiempo real en la consola
- ✅ Verifica dependencias de Node.js
- ✅ Ideal para desarrollo frontend

### 4. `stop-stack.sh` - Detener Todo
**Detiene todos los servicios en ejecución**

```bash
./stop-stack.sh
```

**Características:**
- ✅ Detiene backend y frontend
- ✅ Limpia procesos por puerto y nombre
- ✅ Elimina archivos de log temporales
- ✅ Verificación de limpieza completa

## 🛠️ Requisitos Previos

### Para Backend (Rails):
- Ruby 3.3.6 o superior
- Rails 7.1.5 o superior
- PostgreSQL o SQLite3
- Bundler instalado

### Para Frontend (React):
- Node.js 18 o superior
- npm o yarn

### Para todos los scripts:
- macOS/Linux (los scripts usan comandos Unix)
- `lsof` instalado (viene por defecto en macOS)

## 🚦 Flujo de Uso Recomendado

### Desarrollo Inicial:
```bash
# 1. Iniciar stack completo
./start-stack.sh

# 2. En otra terminal, ver logs si es necesario
tail -f rails.log react.log
```

### Desarrollo Backend:
```bash
# 1. Iniciar solo backend
./start-backend.sh

# 2. En otra terminal, probar endpoints
curl http://localhost:3000/api-docs
```

### Desarrollo Frontend:
```bash
# 1. Iniciar solo frontend
./start-frontend.sh

# 2. Abrir http://localhost:3001 en el navegador
```

### Detener Todo:
```bash
# En cualquier momento
./stop-stack.sh
```

## 🔧 Configuración de Puertos

- **Backend Rails:** Puerto 3000
- **Frontend React:** Puerto 3001
- **API Documentation:** Puerto 3000 (Swagger UI)

## 📝 Logs y Debugging

### Archivos de Log:
- `rails.log` - Logs del backend Rails
- `react.log` - Logs del frontend React

### Ver Logs en Tiempo Real:
```bash
# Ver logs de ambos servicios
tail -f rails.log react.log

# Ver solo backend
tail -f rails.log

# Ver solo frontend
tail -f react.log
```

### Verificar Procesos Activos:
```bash
# Ver qué está usando el puerto 3000
lsof -i :3000

# Ver qué está usando el puerto 3001
lsof -i :3001

# Ver todos los procesos de Rails
ps aux | grep rails

# Ver todos los procesos de React
ps aux | grep "npm start"
```

## 🚨 Solución de Problemas

### Puerto en Uso:
```bash
# Detener proceso en puerto específico
lsof -ti:3000 | xargs kill -9

# O usar el script de parada
./stop-stack.sh
```

### Dependencias Faltantes:
```bash
# Backend
cd backend && bundle install

# Frontend
cd src && npm install
```

### Base de Datos:
```bash
cd backend
rails db:create db:migrate db:seed
```

### Permisos de Scripts:
```bash
chmod +x *.sh
```

## 🎯 Casos de Uso

### 1. **Desarrollo Completo:**
```bash
./start-stack.sh
# Desarrolla tanto frontend como backend
```

### 2. **Solo Backend (API):**
```bash
./start-backend.sh
# Desarrolla endpoints, modelos, controladores
```

### 3. **Solo Frontend (UI):**
```bash
./start-frontend.sh
# Desarrolla componentes, páginas, estilos
```

### 4. **Testing y Debugging:**
```bash
./start-stack.sh
# En otra terminal: tail -f rails.log react.log
```

## 🔄 Flujo de Trabajo Típico

```bash
# 1. Iniciar desarrollo
./start-stack.sh

# 2. Desarrollar en http://localhost:3001

# 3. Probar API en http://localhost:3000/api-docs

# 4. Al terminar
./stop-stack.sh
```

## 💡 Tips y Trucos

- **Mantén una terminal para logs:** `tail -f rails.log react.log`
- **Usa Ctrl+C** para detener servicios de forma limpia
- **Verifica puertos** antes de iniciar: `lsof -i :3000`
- **Reinicia servicios** si hay cambios de configuración
- **Mantén los scripts actualizados** con tu configuración

## 🆘 Comandos de Emergencia

```bash
# Forzar detención de todos los procesos
pkill -9 -f "rails server"
pkill -9 -f "npm start"
pkill -9 -f "react-scripts"

# Limpiar puertos
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

---

**¡Con estos scripts, gestionar tu stack de desarrollo será pan comido! 🎉**
