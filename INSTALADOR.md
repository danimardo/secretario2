# Instalación de Secretario AI

## 📦 Instalación Manual (Recomendada)

### 🔧 Requisitos Previos

1. **Node.js** (versión 16 o superior)
   - Descargar desde: https://nodejs.org/
   - Verificar instalación: `node --version`

### 📥 Instalación

1. **Descargar el código fuente**
   - Descargar como ZIP o clonar el repositorio
   - Extraer en una carpeta (ej: `C:\Secretario-AI\`)

2. **Instalar dependencias**
   ```bash
   cd C:\Secretario-AI\
   npm install
   ```

3. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

### 🚀 Crear Acceso Directo

Para facilitar el acceso, crear archivo `Secretario-AI.bat`:

```batch
@echo off
cd /d "C:\Secretario-AI"
npm start
pause
```

### ⚙️ Configuración Inicial

1. **Token de API**
   - Obtener token en: https://console.mistral.ai/
   - Hacer clic en el botón de configuración (⚙️)
   - Pegar el token y guardar

### 🎯 Funcionalidades

- ✅ **Grabación de audio** con un clic
- ✅ **Transcripción automática** usando Mistral AI
- ✅ **Mejora de texto** automática
- ✅ **Configuración persistente** (formal/informal, mail/chat, idioma)
- ✅ **Opción de desactivar LLM** para solo transcribir

## 🚧 Instalador Automático (En Desarrollo)

**Estado:** Configuración completada, resolviendo conflictos de archivos.

**Próximamente:** Archivo `Secretario-AI-Setup.exe` para instalación automática.

### Configuración Completada

- ✅ **electron-builder** instalado
- ✅ **package.json** configurado para Windows
- ✅ **Licencia MIT** incluida
- ✅ **Scripts de build** preparados

### Problema Actual

Error: `El proceso no tiene acceso al archivo porque está siendo utilizado por otro proceso.`

**Solución en progreso:** Configuración de carpetas temporales y limpieza de procesos.

---

La instalación manual es **100% funcional** mientras se completa el instalador automático.

## 🎨 Iconos Configurados

### ✅ Iconos Disponibles
- **icon.ico** - Para Windows (aplicación e instalador)
- **icon.png** - Para multiplataforma y web
- **icon.svg** - Formato vectorial original

### ✅ Configuración Implementada
```json
"win": {
  "icon": "assets/icon.ico",
  "target": "nsis"
},
"mac": {
  "icon": "assets/icon.png"
},
"linux": {
  "icon": "assets/icon.png"
}
```

### ✅ Aplicación con Icono
- **Ventana principal**: Muestra el icono personalizado
- **Barra de tareas**: Icono visible en Windows
- **Instalador**: Usará el icono cuando se genere

Los iconos están completamente configurados y funcionando en la aplicación.
