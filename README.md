# Petzito Flow Builder

Una interfaz web interactiva que permite a los usuarios finales crear flujos, secciones, formularios y campos de manera visual. La aplicación funciona como un form builder dinámico con opción de arrastrar y soltar componentes, mientras muestra y actualiza en tiempo real el JSON generado que representa la estructura creada.

## 🚀 Características

- **Interfaz gráfica interactiva** con diseño limpio y minimalista
- **Drag & Drop** para mover y anidar componentes
- **Visualización en tiempo real** del JSON generado
- **Edición directa del JSON** con sincronización bidireccional
- **Paleta de componentes** con campos, formularios y secciones
- **Configuración avanzada** de campos con validaciones y metadatos
- **Persistencia local** con localStorage
- **Importación/Exportación** de flujos en formato JSON

## 🎨 Paleta de Colores

La aplicación utiliza la paleta de colores de Petzito:

- **Fondo claro**: `#F8F4ED`
- **Dorado mostaza**: `#CA8A04` (botones primarios)
- **Verde oliva**: `#84A92C` (éxitos/estados válidos)
- **Azul verdoso**: `#5EB5BE` (botones secundarios)
- **Amarillo cálido**: `#E6A623` (advertencias)
- **Marrón oscuro**: `#4B2E13` (errores)

## 🏗️ Estructura de Datos

```
Flow
├── Sections[]
│   ├── Forms[]
│   │   ├── Fields[]
│   │   │   ├── Validations
│   │   │   └── Metadata
│   │   └── Submit URL
│   └── Name
└── Name
```

### Tipos de Campos Disponibles

- **Text**: Entrada de texto de una línea
- **Textarea**: Entrada de texto multilínea
- **Number**: Entrada numérica
- **Email**: Entrada de correo electrónico
- **Tel**: Entrada de teléfono
- **Date**: Selector de fecha
- **Checkbox**: Casilla de verificación
- **Select**: Menú desplegable

## 🛠️ Tecnologías Utilizadas

### Versiones Específicas
- **Node.js**: 18.20.5 o superior
- **npm**: 9.0.0 o superior
- **React**: 19.1.1
- **TypeScript**: 4.9.5
- **TailwindCSS**: 3.4.0
- **React DnD**: 16.0.1
- **Monaco Editor**: 4.7.0

### Dependencias Principales
```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "typescript": "^4.9.5",
  "tailwindcss": "^3.4.0",
  "react-dnd": "^16.0.1",
  "react-dnd-html5-backend": "^16.0.1",
  "@monaco-editor/react": "^4.7.0",
  "uuid": "^11.1.0"
}
```

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js**: Asegúrate de tener Node.js 18.20.5 o superior instalado
- **npm**: Debe estar incluido con Node.js
- **Git**: Para clonar el repositorio

### Verificar Versiones
```bash
node --version    # Debe ser >= 18.20.5
npm --version     # Debe ser >= 9.0.0
git --version     # Cualquier versión reciente
```

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd petzito
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Verificar Instalación
```bash
# Verificar que todas las dependencias estén instaladas
npm list --depth=0

# Verificar que no haya conflictos de versiones
npm audit
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm start
```

### 5. Acceder a la Aplicación
- **Local**: [http://localhost:3000](http://localhost:3000)
- **Red**: [http://192.168.1.5:3000](http://192.168.1.5:3000) (o la IP de tu máquina)

## 🚀 Uso

### Crear un Nuevo Flujo

1. **Arrastra componentes** desde la paleta izquierda al área central
2. **Organiza jerárquicamente**: Fields → Forms → Sections → Flow
3. **Configura cada componente** haciendo clic en la flecha para expandir
4. **Visualiza el JSON** en tiempo real en el panel derecho

### Comportamiento del Drag & Drop

- **Flow**: Solo acepta sections
- **Section**: Acepta forms y fields
  - Si no hay forms: crea un nuevo form con el field
  - Si ya hay forms: agrega el field al primer form existente
- **Form**: Solo acepta fields
- **Field**: Solo se puede mover

### Configurar Campos

- **Label**: Nombre del campo
- **Placeholder**: Texto de ayuda
- **Validaciones**: Required, regex, min/max, etc.
- **Metadatos**: Colores de error, traducciones, estilos

### Configurar Formularios

- **Nombre**: Identificador del formulario
- **Submit URL**: Endpoint para enviar datos
- **Campos**: Lista de campos incluidos

### Configurar Secciones

- **Nombre**: Identificador de la sección
- **Formularios**: Lista de formularios agrupados

## 💾 Persistencia

- Los datos se guardan automáticamente en `localStorage`
- Puedes exportar flujos como archivos JSON
- Puedes importar flujos existentes desde archivos JSON

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start

# Construcción para producción
npm run build

# Ejecutar tests
npm test

# Ejectuar configuración (irreversible)
npm run eject

# Verificar dependencias
npm list --depth=0

# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Solución de Problemas

### Error de Puerto en Uso
```bash
# Si el puerto 3000 está ocupado
lsof -ti:3000 | xargs kill -9

# O usar otro puerto
PORT=3001 npm start
```

### Problemas con TailwindCSS
```bash
# Reinstalar TailwindCSS
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Regenerar configuración
npx tailwindcss init -p
```

### Problemas de Dependencias
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript
```bash
# Verificar configuración
npx tsc --noEmit

# Limpiar cache
rm -rf node_modules/.cache
```

## 📁 Estructura del Proyecto

```
petzito/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ComponentPalette.tsx    # Paleta de componentes arrastrables
│   │   ├── FieldComponent.tsx      # Componente de campo individual
│   │   ├── FormComponent.tsx       # Componente de formulario
│   │   ├── SectionComponent.tsx    # Componente de sección
│   │   ├── FlowComponent.tsx       # Componente principal del flujo
│   │   └── JsonPanel.tsx          # Panel de edición JSON
│   ├── types/
│   │   └── index.ts               # Definiciones de tipos TypeScript
│   ├── App.tsx                    # Componente principal de la aplicación
│   ├── index.tsx                  # Punto de entrada
│   └── index.css                  # Estilos globales y TailwindCSS
├── tailwind.config.js             # Configuración de TailwindCSS
├── postcss.config.js              # Configuración de PostCSS
├── tsconfig.json                  # Configuración de TypeScript
├── package.json                   # Dependencias y scripts
└── README.md                      # Este archivo
```

## 🔒 Configuración de Seguridad

### Variables de Entorno
```bash
# Crear archivo .env.local para variables locales
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
```

### Dependencias de Desarrollo
- Todas las dependencias de desarrollo están marcadas con `-D`
- No se incluyen dependencias innecesarias
- Se mantienen versiones estables y compatibles

## 🎯 Funcionalidades Futuras

- [ ] Conectividad con backend
- [ ] Pruebas unitarias e integración
- [ ] Temas personalizables
- [ ] Colaboración en tiempo real
- [ ] Plantillas predefinidas
- [ ] Validación de esquemas
- [ ] Preview de formularios
- [ ] Exportación a diferentes formatos
- [ ] Sistema de versionado de flujos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código
- Usar TypeScript para todo el código
- Seguir las convenciones de React
- Mantener componentes pequeños y reutilizables
- Documentar funciones complejas
- Usar TailwindCSS para estilos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda, por favor abre un issue en el repositorio.

### Información de Contacto
- **Proyecto**: Petzito Flow Builder
- **Repositorio**: [URL del repositorio]
- **Issues**: [URL de issues]

---

**Desarrollado con ❤️ para Petzito**

---

## 🚀 Inicio Rápido

```bash
# Clonar y configurar en 3 pasos
git clone <repository-url>
cd petzito
npm install && npm start
```

¡La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)!
