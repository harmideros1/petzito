#!/bin/bash

# Petzito Full Stack Startup Script
# Este script inicia tanto el backend Rails como el frontend React

echo "🚀 Iniciando Petzito Full Stack..."
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Función para matar procesos en un puerto
kill_port() {
    if check_port $1; then
        print_warning "Puerto $1 está en uso. Matando proceso..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Función para esperar a que un servicio esté listo
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    print_status "Esperando a que $service_name esté listo en puerto $port..."

    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            print_success "$service_name está listo en puerto $port!"
            return 0
        fi

        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    print_error "$service_name no se pudo iniciar en puerto $port después de $max_attempts intentos"
    return 1
}

# Verificar que estamos en el directorio correcto
if [ ! -f "start-stack.sh" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existen los directorios necesarios
if [ ! -d "backend" ]; then
    print_error "Directorio 'backend' no encontrado"
    exit 1
fi

if [ ! -d "src" ]; then
    print_error "Directorio 'src' no encontrado (frontend)"
    exit 1
fi

print_success "Estructura del proyecto verificada"

# Matar procesos existentes en los puertos que vamos a usar
print_status "Limpiando puertos..."
kill_port 3000  # Backend Rails
kill_port 3001  # Frontend React

# Función para manejar la limpieza al salir
cleanup() {
    print_status "Deteniendo servicios..."
    kill_port 3000
    kill_port 3001
    print_success "Servicios detenidos"
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Iniciar Backend Rails
print_status "Iniciando Backend Rails..."
cd backend

# Verificar que las dependencias estén instaladas
if [ ! -d "vendor/bundle" ]; then
    print_warning "Dependencias de Ruby no encontradas. Instalando..."
    bundle install
    if [ $? -ne 0 ]; then
        print_error "Error instalando dependencias de Ruby"
        exit 1
    fi
fi

# Verificar que la base de datos esté configurada
if [ ! -f "db/schema.rb" ]; then
    print_warning "Base de datos no configurada. Configurando..."
    rails db:create db:migrate db:seed
    if [ $? -ne 0 ]; then
        print_error "Error configurando la base de datos"
        exit 1
    fi
else
    print_status "Verificando migraciones de base de datos..."
    rails db:migrate
    if [ $? -ne 0 ]; then
        print_error "Error ejecutando migraciones"
        exit 1
    fi
fi

# Iniciar servidor Rails en background
print_status "Iniciando servidor Rails en puerto 3000..."
rails server -p 3000 > ../rails.log 2>&1 &
RAILS_PID=$!

# Volver al directorio raíz
cd ..

# Esperar a que Rails esté listo
if wait_for_service 3000 "Backend Rails"; then
    print_success "Backend Rails iniciado exitosamente"
else
    print_error "No se pudo iniciar el backend Rails"
    kill $RAILS_PID 2>/dev/null
    exit 1
fi

# Iniciar Frontend React
print_status "Iniciando Frontend React..."
cd src

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    print_warning "Dependencias de Node.js no encontradas. Instalando..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Error instalando dependencias de Node.js"
        exit 1
    fi
fi

# Iniciar servidor de desarrollo en background
print_status "Iniciando servidor de desarrollo React en puerto 3001..."
PORT=3001 npm start > ../react.log 2>&1 &
REACT_PID=$!

# Volver al directorio raíz
cd ..

# Esperar a que React esté listo
if wait_for_service 3001 "Frontend React"; then
    print_success "Frontend React iniciado exitosamente"
else
    print_error "No se pudo iniciar el frontend React"
    kill $REACT_PID 2>/dev/null
    exit 1
fi

# Mostrar información final
echo ""
echo "🎉 ¡Petzito Full Stack iniciado exitosamente!"
echo "=============================================="
echo ""
echo "📱 Frontend React:  http://localhost:3001"
echo "🔧 Backend Rails:   http://localhost:3000"
echo "📚 API Docs:        http://localhost:3000/api-docs"
echo ""
echo "📋 Gestor de Flujos: http://localhost:3001/flows"
echo "🏗️  Flow Builder:     http://localhost:3001/"
echo "📱 Mobile Preview:   http://localhost:3001/preview"
echo ""
echo "📝 Logs disponibles:"
echo "   Backend:  rails.log"
echo "   Frontend: react.log"
echo ""
echo "🛑 Para detener: Presiona Ctrl+C"
echo ""

# Función para mostrar logs en tiempo real
show_logs() {
    echo "📊 Mostrando logs en tiempo real..."
    echo "=================================="
    echo ""

    # Mostrar logs de ambos servicios
    tail -f rails.log react.log &
    TAIL_PID=$!

    # Esperar hasta que se presione Ctrl+C
    wait $TAIL_PID
}

# Preguntar si quiere ver logs
read -p "¿Quieres ver los logs en tiempo real? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    show_logs
else
    # Mantener el script corriendo para que los servicios sigan activos
    print_status "Servicios ejecutándose. Presiona Ctrl+C para detener."
    while true; do
        sleep 10

        # Verificar que ambos servicios sigan corriendo
        if ! check_port 3000; then
            print_error "Backend Rails se detuvo inesperadamente"
            break
        fi

        if ! check_port 3001; then
            print_error "Frontend React se detuvo inesperadamente"
            break
        fi

        print_status "Servicios funcionando correctamente..."
    done
fi
