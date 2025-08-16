# Petzito Flow Builder - Scripts de Desarrollo

## 🚀 Comandos Principales

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

### Mantenimiento
```bash
# Verificar dependencias
npm list --depth=0

# Verificar vulnerabilidades
npm audit

# Corregir vulnerabilidades automáticamente
npm audit fix

# Limpiar cache
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Herramientas de Desarrollo
```bash
# Verificar TypeScript
npx tsc --noEmit

# Verificar ESLint
npx eslint src/ --ext .ts,.tsx

# Formatear código con Prettier (si está instalado)
npx prettier --write src/

# Verificar dependencias duplicadas
npm ls
```

## 🔧 Scripts Personalizados

### Verificar Puerto
```bash
# Verificar si el puerto 3000 está en uso
lsof -ti:3000

# Matar proceso en puerto 3000
lsof -ti:3000 | xargs kill -9

# Usar puerto alternativo
PORT=3001 npm start
```

### Limpieza del Proyecto
```bash
# Limpiar build
rm -rf build/

# Limpiar cache de TypeScript
rm -rf node_modules/.cache

# Limpiar logs
rm -f npm-debug.log*
rm -f yarn-debug.log*
```

### Verificación de Versiones
```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version

# Verificar todas las versiones
node --version && npm --version && git --version
```

## 🐛 Debugging

### Logs de Desarrollo
```bash
# Ver logs en tiempo real
tail -f npm-debug.log

# Ver logs del navegador
# Abrir DevTools > Console
```

### Verificar Configuración
```bash
# Verificar TailwindCSS
npx tailwindcss --help

# Verificar PostCSS
npx postcss --help

# Verificar configuración de TypeScript
npx tsc --showConfig
```

## 📦 Gestión de Dependencias

### Agregar Dependencias
```bash
# Dependencia de producción
npm install package-name

# Dependencia de desarrollo
npm install -D package-name

# Dependencia específica
npm install package-name@version
```

### Actualizar Dependencias
```bash
# Verificar actualizaciones disponibles
npm outdated

# Actualizar dependencias
npm update

# Actualizar a la última versión
npm install package-name@latest
```

## 🚀 Despliegue

### Build de Producción
```bash
# Construir aplicación
npm run build

# Verificar build
ls -la build/

# Servir build localmente
npx serve -s build
```

### Análisis del Bundle
```bash
# Analizar tamaño del bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🔍 Monitoreo

### Performance
```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html

# Bundle analyzer
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer build/static/js/*.js
```

### Dependencias
```bash
# Ver dependencias desactualizadas
npm outdated

# Ver dependencias con vulnerabilidades
npm audit

# Ver dependencias duplicadas
npm ls
```

## 📝 Notas Importantes

- **Node.js**: Requiere versión 18.20.5 o superior
- **npm**: Requiere versión 9.0.0 o superior
- **Puerto**: Por defecto usa el puerto 3000
- **Hot Reload**: Habilitado por defecto en desarrollo
- **TypeScript**: Configurado con strict mode
- **TailwindCSS**: Configurado con PostCSS

## 🆘 Solución de Problemas Comunes

### Error de Puerto
```bash
# Solución rápida
PORT=3001 npm start
```

### Error de Dependencias
```bash
# Solución completa
rm -rf node_modules package-lock.json
npm install
```

### Error de TypeScript
```bash
# Verificar configuración
npx tsc --noEmit
```

### Error de TailwindCSS
```bash
# Reinstalar
npm uninstall tailwindcss postcss autoprefixer
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npx tailwindcss init -p
```
