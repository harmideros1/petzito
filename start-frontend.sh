#!/bin/bash

# Petzito Frontend Startup Script
# Este script inicia solo el frontend React

echo "📱 Iniciando Petzito Frontend..."
echo "================================="

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
    print_status "Deteniendo frontend React..."
    kill_port 3001
    print_success "Frontend React detenido"
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Verificar que estamos en el directorio correcto
if [ ! -f "start-frontend.sh" ]; then
    print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Verificar que existe el directorio src (frontend)
if [ ! -d "src" ]; then
    print_error "Directorio 'src' no encontrado (frontend)"
    exit 1
fi

print_success "Estructura del proyecto verificada"

# Matar procesos existentes en el puerto 3001
print_status "Limpiando puerto 3001..."
kill_port 3001

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

# Iniciar servidor de desarrollo
print_status "Iniciando servidor de desarrollo React en puerto 3001..."
print_status "Presiona Ctrl+C para detener el servidor"
echo ""

# Iniciar React en primer plano para ver logs en tiempo real
PORT=3001 npm start
