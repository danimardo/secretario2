# Secretario2 - Grabador de Audio

Una aplicación de escritorio desarrollada con Electron para grabar audio de forma sencilla y rápida.

## Características

- 🎤 **Grabación de audio**: Botón grande e intuitivo para iniciar/detener grabación
- 💾 **Guardado automático**: Guarda las grabaciones en formato WebM
- ⚙️ **Configuración persistente**: Modal de configuración para guardar token de API
- 🎨 **Interfaz moderna**: Diseño limpio y atractivo con gradientes y animaciones
- 🔒 **Almacenamiento seguro**: Configuración guardada de forma persistente entre sesiones

## Instalación

1. Clona o descarga este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Construir ejecutable
```bash
npm run build
```

## Funcionalidades

### Grabación de Audio
- Presiona el botón del micrófono para iniciar la grabación
- Presiona nuevamente para detener
- Reproduce el audio grabado antes de guardarlo
- Guarda o descarta la grabación según necesites

### Configuración
- Botón de configuración (rueda dentada) en la esquina inferior derecha
- Modal para ingresar y guardar token de API
- La configuración se mantiene entre sesiones de la aplicación

## Estructura del Proyecto

```
secretario2/
├── main.js          # Proceso principal de Electron
├── preload.js       # Script de preload para comunicación segura
├── index.html       # Interfaz de usuario
├── styles.css       # Estilos de la aplicación
├── renderer.js      # Lógica del frontend
├── package.json     # Configuración del proyecto
├── assets/          # Recursos (iconos, imágenes)
└── README.md        # Este archivo
```

## Tecnologías Utilizadas

- **Electron**: Framework para aplicaciones de escritorio
- **Web Audio API**: Para grabación de audio
- **MediaRecorder API**: Para captura de audio
- **electron-store**: Para almacenamiento persistente de configuración
- **CSS3**: Para estilos modernos con gradientes y animaciones

## Permisos Requeridos

La aplicación requiere acceso al micrófono para funcionar correctamente. El navegador/sistema solicitará permisos la primera vez que uses la aplicación.

## Compatibilidad

- Windows 10/11
- macOS 10.14+
- Linux (distribuciones modernas)

## Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

MIT License - ver el archivo LICENSE para más detalles.
