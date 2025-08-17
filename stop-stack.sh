#!/bin/bash

# Petzito Full Stack Stop Script
# Este script detiene tanto el backend Rails como el frontend React

echo "🛑 Deteniendo Petzito Full Stack..."
echo "==================================="

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
        print_status "Deteniendo servicio en puerto $1..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null
        sleep 2

        if check_port $1; then
            print_warning "No se pudo detener el servicio en puerto $1"
            return 1
        else
            print_success "Servicio en puerto $1 detenido"
            return 0
        fi
    else
        print_status "Puerto $1 ya está libre"
        return 0
    fi
}

# Función para detener procesos por nombre
kill_processes() {
    local process_name=$1
    local display_name=$2

    print_status "Deteniendo procesos de $display_name..."

    # Buscar y matar procesos por nombre
    pkill -f "$process_name" 2>/dev/null

    # Esperar un poco para que se detengan
    sleep 2

    # Verificar si quedan procesos
    if pgrep -f "$process_name" >/dev/null; then
        print_warning "Algunos procesos de $display_name siguen ejecutándose"
        # Forzar detención
        pkill -9 -f "$process_name" 2>/dev/null
        sleep 1
    fi

    if ! pgrep -f "$process_name" >/dev/null; then
        print_success "$display_name detenido completamente"
    else
        print_error "No se pudieron detener todos los procesos de $display_name"
    fi
}

# Detener servicios por puerto
print_status "Deteniendo servicios por puerto..."

# Backend Rails (puerto 3000)
if check_port 3000; then
    kill_port 3000
else
    print_status "Backend Rails ya está detenido"
fi

# Frontend React (puerto 3001)
if check_port 3001; then
    kill_port 3001
else
    print_status "Frontend React ya está detenido"
fi

# Detener procesos por nombre (más agresivo)
print_status "Deteniendo procesos por nombre..."

# Detener procesos de Rails
kill_processes "rails server" "Rails Server"

# Detener procesos de React/Node
kill_processes "npm start" "React Development Server"
kill_processes "react-scripts" "React Scripts"

# Detener procesos de Ruby/Rails
kill_processes "puma" "Puma Server"
kill_processes "rackup" "Rack Server"

# Limpiar archivos de log temporales
print_status "Limpiando archivos de log..."
if [ -f "rails.log" ]; then
    rm rails.log
    print_success "Log de Rails eliminado"
fi

if [ -f "react.log" ]; then
    rm react.log
    print_success "Log de React eliminado"
fi

# Verificar que no queden procesos
print_status "Verificando que no queden procesos activos..."

if check_port 3000 && check_port 3001; then
    print_success "Todos los servicios han sido detenidos exitosamente"
else
    print_warning "Algunos servicios podrían seguir ejecutándose"

    if check_port 3000; then
        print_warning "Puerto 3000 (Backend) aún está en uso"
    fi

    if check_port 3001; then
        print_warning "Puerto 3001 (Frontend) aún está en uso"
    fi
fi

echo ""
echo "✅ Script de parada completado"
echo "=============================="
echo ""
echo "💡 Para verificar procesos activos:"
echo "   lsof -i :3000  # Verificar puerto del backend"
echo "   lsof -i :3001  # Verificar puerto del frontend"
echo ""
echo "💡 Para forzar detención de procesos:"
echo "   pkill -9 -f 'rails server'"
echo "   pkill -9 -f 'npm start'"
echo ""
