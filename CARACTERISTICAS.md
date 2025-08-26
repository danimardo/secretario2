# Características de Secretario2

## 🎤 Grabación de Audio

### Botón Principal de Grabación
- **Diseño**: Botón circular grande con icono de micrófono
- **Estados visuales**:
  - 🔴 **Inactivo**: Botón rojo con gradiente, texto "Presiona para grabar"
  - 🔴 **Grabando**: Animación de pulso, texto "Grabando... Presiona para detener"
  - ⚪ **Procesando**: Texto "Procesando grabación..."

### Funcionalidad de Grabación
- **Inicio**: Un clic para comenzar a grabar
- **Fin**: Otro clic para detener la grabación
- **Formato**: Audio WebM con codec Opus
- **Calidad**: 44.1kHz con cancelación de eco y supresión de ruido
- **Permisos**: Solicita acceso al micrófono automáticamente

## 🎵 Reproducción y Guardado

### Panel de Control de Audio
- **Reproductor integrado**: Control HTML5 para escuchar la grabación
- **Botón Guardar**: Guarda el archivo con timestamp automático
- **Botón Descartar**: Elimina la grabación actual
- **Formato de archivo**: `grabacion_YYYY-MM-DDTHH-mm-ss.webm`

### Diálogo de Guardado
- **Ubicación personalizable**: El usuario elige dónde guardar
- **Filtros de archivo**: Solo archivos de audio (MP3, WAV)
- **Confirmación**: Mensaje de éxito con ruta del archivo

## ⚙️ Configuración

### Modal de Configuración
- **Acceso**: Botón de rueda dentada en esquina inferior derecha
- **Animación**: Rotación de 90° al hacer hover
- **Modal**: Overlay con blur de fondo

### Gestión de Token API
- **Campo de entrada**: Input tipo password con toggle de visibilidad
- **Persistencia**: Se guarda automáticamente entre sesiones
- **Seguridad**: Almacenamiento local encriptado
- **Validación**: Confirmación de guardado exitoso

## 🎨 Interfaz de Usuario

### Diseño Visual
- **Tema**: Gradiente púrpura-azul de fondo
- **Tipografía**: Segoe UI, moderna y limpia
- **Colores**:
  - Primario: Gradiente azul-púrpura (#667eea → #764ba2)
  - Grabación: Gradiente rojo (#ff6b6b → #ee5a52)
  - Éxito: Gradiente verde (#2ecc71 → #27ae60)
  - Error: Gradiente rojo (#e74c3c → #c0392b)

### Animaciones y Efectos
- **Hover effects**: Elevación con sombras
- **Pulse animation**: Durante la grabación
- **Backdrop blur**: En modales
- **Smooth transitions**: 0.3s ease en todos los elementos

### Responsive Design
- **Ventana fija**: 400x500px, no redimensionable
- **Centrado**: Elementos alineados al centro
- **Espaciado**: Padding y margins consistentes

## 🔧 Arquitectura Técnica

### Estructura de Archivos
```
secretario2/
├── main.js          # Proceso principal Electron
├── preload.js       # Bridge seguro IPC
├── renderer.js      # Lógica del frontend
├── index.html       # Estructura HTML
├── styles.css       # Estilos CSS
└── assets/          # Recursos (iconos)
```

### APIs Utilizadas
- **MediaRecorder API**: Captura de audio
- **Web Audio API**: Procesamiento de audio
- **Electron IPC**: Comunicación entre procesos
- **File System API**: Guardado de archivos
- **Local Storage**: Configuración persistente

### Seguridad
- **Context Isolation**: Habilitado
- **Node Integration**: Deshabilitado
- **Preload Script**: Para comunicación segura
- **CSP**: Content Security Policy implícito

## 📱 Compatibilidad

### Sistemas Operativos
- ✅ **Windows**: 10/11 (x64)
- ✅ **macOS**: 10.14+ (Intel/Apple Silicon)
- ✅ **Linux**: Distribuciones modernas (x64)

### Navegadores Web (Motor)
- **Chromium**: Versión incluida con Electron
- **APIs modernas**: MediaRecorder, Web Audio
- **Permisos**: Micrófono requerido

## 🚀 Rendimiento

### Optimizaciones
- **Lazy loading**: Recursos cargados bajo demanda
- **Memory management**: Limpieza automática de blobs
- **Stream handling**: Cierre correcto de streams de audio
- **Error handling**: Manejo robusto de errores

### Recursos del Sistema
- **RAM**: ~100-150MB en uso típico
- **CPU**: Mínimo durante grabación
- **Disco**: Solo para archivos guardados
- **Red**: No requiere conexión (excepto para APIs externas)
