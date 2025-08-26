# Funcionalidad de Transcripción - Secretario2

## 🎯 Nueva Funcionalidad Integrada

La aplicación ahora incluye transcripción automática de audio usando la API de Mistral AI con el modelo `voxtral-mini-latest`.

## 🔧 Configuración Requerida

### 1. Token de API
- Obtén tu token de API de Mistral AI desde [console.mistral.ai](https://console.mistral.ai)
- Configúralo en la aplicación usando el botón de configuración (⚙️)
- El token se guarda de forma persistente entre sesiones

### 2. Conexión a Internet
- La transcripción requiere conexión a internet para comunicarse con la API
- Los archivos de audio se envían de forma segura a los servidores de Mistral AI

## 🎵 Flujo de Uso Completo

### Paso 1: Grabar Audio
1. Presiona el botón del micrófono para iniciar la grabación
2. El botón mostrará animación de latido mientras graba
3. Presiona nuevamente para detener la grabación

### Paso 2: Guardado Automático
- El audio se guarda automáticamente en `Documentos/temporal/`
- Formato: `grabacion_YYYY-MM-DDTHH-mm-ss.webm`
- No se requiere intervención del usuario

### Paso 3: Controles de Audio
- **Reproducir/Pausar**: Escucha la grabación antes de transcribir
- **Transcribir**: Envía el audio a la API de Mistral AI
- **Nueva Grabación**: Limpia todo y permite empezar de nuevo

### Paso 4: Transcripción
1. Presiona el botón "Transcribir"
2. El botón cambia a "Transcribiendo..." y se deshabilita
3. Se muestra el estado: "Enviando audio a la API..."
4. El texto transcrito aparece en el área de texto

### Paso 5: Gestión del Texto
- **Lectura**: El texto aparece en un área de texto de solo lectura
- **Copia**: Botón "Copiar" para enviar el texto al portapapeles
- **Feedback visual**: El botón cambia a "Copiado!" temporalmente

## 🔒 Seguridad y Privacidad

### Almacenamiento Local
- Los archivos de audio se guardan localmente en tu computadora
- El token de API se almacena de forma segura usando electron-store
- No se almacenan datos en servidores externos (excepto durante la transcripción)

### Comunicación con API
- Conexión HTTPS segura con api.mistral.ai
- El archivo de audio se envía temporalmente para transcripción
- Mistral AI procesa el audio y devuelve solo el texto

## 📋 Especificaciones Técnicas

### API Endpoint
```
POST https://api.mistral.ai/v1/audio/transcriptions
```

### Headers Requeridos
```
x-api-key: [TU_TOKEN_API]
Content-Type: multipart/form-data
```

### Parámetros
- `file`: Archivo de audio (WebM/Opus)
- `model`: "voxtral-mini-latest"

### Respuesta
```json
{
  "text": "Texto transcrito del audio..."
}
```

## 🎨 Interfaz de Usuario

### Nuevos Elementos
- **Botón "Transcribir"**: Color azul, entre Reproducir y Nueva Grabación
- **Sección de Transcripción**: Aparece después de iniciar transcripción
- **Área de Texto**: Campo de solo lectura con scroll vertical
- **Botón "Copiar"**: Color púrpura con icono de clipboard
- **Estados Visuales**: Loading (azul), Success (verde), Error (rojo)

### Responsive Design
- La sección de transcripción se adapta al contenido
- Máximo 200px de altura con scroll automático
- Ancho consistente con el resto de la aplicación

## 🚨 Manejo de Errores

### Errores Comunes
1. **Token no configurado**: Redirige al modal de configuración
2. **Sin conexión**: Muestra error de red
3. **API no disponible**: Muestra error del servidor
4. **Archivo no encontrado**: Error de archivo local
5. **Formato no soportado**: Error de formato de audio

### Mensajes de Estado
- ✅ **Éxito**: "Transcripción completada exitosamente"
- ⏳ **Cargando**: "Enviando audio a la API..."
- ❌ **Error**: Mensaje específico del error ocurrido

## 🔄 Flujo de Datos

```
[Grabación] → [Archivo Local] → [API Mistral] → [Texto] → [Portapapeles]
     ↓              ↓              ↓           ↓           ↓
[WebM/Opus] → [Documentos/temp] → [HTTPS] → [JSON] → [Clipboard API]
```

## 💡 Consejos de Uso

### Para Mejores Resultados
- Habla claramente y a velocidad normal
- Evita ruido de fondo excesivo
- Mantén el micrófono a distancia apropiada
- Verifica tu conexión a internet antes de transcribir

### Gestión de Archivos
- Los archivos se acumulan en `Documentos/temporal/`
- Puedes eliminar archivos antiguos manualmente
- Cada grabación tiene timestamp único para evitar conflictos

### Uso del Token API
- Mantén tu token seguro y no lo compartas
- El token se almacena localmente, no en la nube
- Puedes cambiar el token en cualquier momento desde configuración
