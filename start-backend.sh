#!/bin/bash

# Petzito Backend Startup Script
# Este script inicia solo el backend Rails

echo "🔧 Iniciando Petzito Backend..."
echo "================================"

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

# Función para manejar la limpieza al salir
cleanup() {
    print_status "Deteniendo backend Rails..."
    kill_port 3000
    print_success "Backend Rails detenido"
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Verificar que estamos en el directorio correcto
if [ ! -f "start-backend.sh" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existe el directorio backend
if [ ! -d "backend" ]; then
    print_error "Directorio 'backend' no encontrado"
    exit 1
fi

print_success "Estructura del proyecto verificada"

# Matar procesos existentes en el puerto 3000
print_status "Limpiando puerto 3000..."
kill_port 3000

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

# Iniciar servidor Rails
print_status "Iniciando servidor Rails en puerto 3000..."
print_status "Presiona Ctrl+C para detener el servidor"
echo ""

# Iniciar Rails en primer plano para ver logs en tiempo real
rails server -p 3000
