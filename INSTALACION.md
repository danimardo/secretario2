# Instrucciones de Instalación - Secretario2

## Requisitos Previos

1. **Node.js**: Descargar e instalar desde [nodejs.org](https://nodejs.org/)
   - Versión recomendada: 18.x o superior
   - Incluye npm automáticamente

## Instalación Paso a Paso

### 1. Verificar Node.js
Abre una terminal/cmd y ejecuta:
```bash
node --version
npm --version
```

### 2. Instalar Dependencias
En la carpeta del proyecto, ejecuta:
```bash
npm install
```

Si hay problemas, intenta:
```bash
npm install electron --save-dev
npm install electron-store --save
```

### 3. Ejecutar la Aplicación

#### Modo Desarrollo:
```bash
npm run dev
```

#### Modo Normal:
```bash
npm start
```

#### Alternativa (si npm no funciona):
```bash
npx electron .
```

## Solución de Problemas

### Error: "electron no encontrado"
```bash
npm install electron --save-dev --force
```

### Error de permisos en Windows
Ejecutar cmd como Administrador

### Error de red/proxy
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

### Instalación manual de Electron
1. Descargar Electron desde [releases de GitHub](https://github.com/electron/electron/releases)
2. Extraer en la carpeta del proyecto
3. Ejecutar: `./electron.exe .` (Windows) o `./electron .` (Mac/Linux)

## Estructura de Archivos Necesarios

Asegúrate de que tienes estos archivos:
- `main.js` - Proceso principal
- `index.html` - Interfaz de usuario
- `renderer.js` - Lógica del frontend
- `preload.js` - Script de seguridad
- `styles.css` - Estilos
- `package.json` - Configuración del proyecto

## Funcionalidades

Una vez instalado, la aplicación incluye:
- ✅ Grabación de audio con botón grande del micrófono
- ✅ Guardado de archivos de audio
- ✅ Modal de configuración para token de API
- ✅ Almacenamiento persistente de configuración
- ✅ Interfaz moderna y responsive

## Contacto

Si tienes problemas con la instalación, verifica:
1. Versión de Node.js compatible
2. Conexión a internet para descargar dependencias
3. Permisos de escritura en la carpeta del proyecto
4. Antivirus no bloqueando la instalación
