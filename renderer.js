class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.stream = null;
        this.currentAudioPath = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadApiToken();
        this.loadCommunicationStyle();
        this.loadMessageType();
        this.loadLanguage();
        this.loadTargetPersons();
        this.loadProcessWithLLM();

        // Actualizar estado inicial de los controles
        setTimeout(() => this.updateControlsState(), 100);
    }

    initializeElements() {
        this.recordButton = document.getElementById('recordButton');
        this.recordStatus = document.getElementById('recordStatus');
        this.audioControls = document.getElementById('audioControls');
        this.audioPlayback = document.getElementById('audioPlayback');
        this.discardButton = document.getElementById('discardButton');
        this.settingsButton = document.getElementById('settingsButton');
        this.settingsModal = document.getElementById('settingsModal');
        this.closeModal = document.getElementById('closeModal');
        this.apiTokenInput = document.getElementById('apiToken');
        this.togglePassword = document.getElementById('togglePassword');
        this.saveSettings = document.getElementById('saveSettings');
        this.cancelSettings = document.getElementById('cancelSettings');

        // Elementos de transcripción
        this.transcriptionSection = document.getElementById('transcriptionSection');
        this.transcriptionText = document.getElementById('transcriptionText');
        this.transcriptionStatus = document.getElementById('transcriptionStatus');
        this.copyButton = document.getElementById('copyButton');
        this.pasteButton = document.getElementById('pasteButton');

        // Elementos de estilo de comunicación
        this.formalRadio = document.getElementById('formalRadio');
        this.informalRadio = document.getElementById('informalRadio');

        // Elementos de tipo de mensaje
        this.mailRadio = document.getElementById('mailRadio');
        this.chatRadio = document.getElementById('chatRadio');

        // Elementos de idioma
        this.spanishRadio = document.getElementById('spanishRadio');
        this.englishRadio = document.getElementById('englishRadio');

        // Elementos de procesamiento con LLM
        this.llmYesRadio = document.getElementById('llmYesRadio');
        this.llmNoRadio = document.getElementById('llmNoRadio');

        // Elementos de personas objetivo
        this.onePersonRadio = document.getElementById('onePersonRadio');
        this.severalPersonsRadio = document.getElementById('severalPersonsRadio');

        // Botón de reprocesar
        this.reprocessButton = document.getElementById('reprocessButton');
    }

    setupEventListeners() {
        this.recordButton.addEventListener('click', () => this.toggleRecording());
        this.discardButton.addEventListener('click', () => this.discardAudio());
        this.copyButton.addEventListener('click', () => this.copyTranscription());
        this.pasteButton.addEventListener('click', () => this.pasteFromClipboard());

        // Event listeners para radio buttons
        this.formalRadio.addEventListener('change', () => this.saveCommunicationStyle());
        this.informalRadio.addEventListener('change', () => this.saveCommunicationStyle());

        this.mailRadio.addEventListener('change', () => this.saveMessageType());
        this.chatRadio.addEventListener('change', () => this.saveMessageType());

        this.spanishRadio.addEventListener('change', () => this.saveLanguage());
        this.englishRadio.addEventListener('change', () => this.saveLanguage());

        this.onePersonRadio.addEventListener('change', () => this.saveTargetPersons());
        this.severalPersonsRadio.addEventListener('change', () => this.saveTargetPersons());

        this.llmYesRadio.addEventListener('change', () => {
            this.saveProcessWithLLM();
            this.updateControlsState();
        });
        this.llmNoRadio.addEventListener('change', () => {
            this.saveProcessWithLLM();
            this.updateControlsState();
        });

        this.reprocessButton.addEventListener('click', () => this.reprocessText());

        // Event listener para actualizar estado del botón cuando cambie el texto
        this.transcriptionText.addEventListener('input', () => this.updateControlsState());
        this.settingsButton.addEventListener('click', () => this.openSettings());
        this.closeModal.addEventListener('click', () => this.closeSettings());
        this.togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        this.saveSettings.addEventListener('click', () => this.saveApiToken());
        this.cancelSettings.addEventListener('click', () => this.closeSettings());

        // Cerrar modal al hacer clic fuera
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });

        // Cerrar modal con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.settingsModal.style.display === 'block') {
                this.closeSettings();
            }
        });


    }

    async toggleRecording() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    async startRecording() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });

            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            
            this.recordButton.classList.add('recording');
            this.recordStatus.textContent = 'Grabando... Presiona para detener';
            this.audioControls.style.display = 'none';

        } catch (error) {
            console.error('Error al acceder al micrófono:', error);
            alert('Error al acceder al micrófono. Por favor, verifica los permisos.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            this.recordButton.classList.remove('recording');
            this.recordStatus.textContent = 'Procesando grabación...';

            // Detener el stream
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
        }
    }

    async processRecording() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        this.audioPlayback.src = audioUrl;
        this.audioControls.style.display = 'block';
        this.recordStatus.textContent = 'Guardando grabación...';

        // Guardar automáticamente
        this.currentAudioBlob = audioBlob;
        await this.saveAudioAutomatically();

        // Transcribir automáticamente después de guardar
        await this.transcribeAudioAutomatically();
    }

    async saveAudioAutomatically() {
        if (!this.currentAudioBlob) {
            this.recordStatus.textContent = 'Error: No hay audio para guardar';
            return;
        }

        try {
            // Convertir blob a array buffer
            const arrayBuffer = await this.currentAudioBlob.arrayBuffer();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `grabacion_${timestamp}.webm`;

            const result = await window.electronAPI.saveAudio(arrayBuffer, filename);

            if (result.success) {
                this.currentAudioPath = result.path;
                this.recordStatus.textContent = `Grabación guardada en: Documentos/temporal/`;
                // Mostrar controles para reproducir o descartar
                setTimeout(() => {
                    this.recordStatus.textContent = 'Grabación completada y guardada';
                }, 3000);
            } else {
                this.recordStatus.textContent = `Error al guardar: ${result.error}`;
            }
        } catch (error) {
            console.error('Error al guardar audio:', error);
            this.recordStatus.textContent = 'Error al guardar el audio';
        }
    }



    async transcribeAudioAutomatically() {
        if (!this.currentAudioPath) {
            this.recordStatus.textContent = 'Error: No hay archivo de audio para transcribir';
            return;
        }

        try {
            const apiToken = await window.electronAPI.getApiToken();
            if (!apiToken || apiToken.trim() === '') {
                this.recordStatus.textContent = 'Configura tu token de API para transcribir';
                this.transcriptionStatus.textContent = 'Token de API no configurado. Ve a configuración.';
                this.transcriptionStatus.className = 'transcription-status error';
                this.transcriptionSection.style.display = 'block';
                return;
            }

            // Mostrar estado de carga
            this.recordStatus.textContent = 'Transcribiendo audio...';
            this.transcriptionStatus.textContent = 'Enviando audio a la API...';
            this.transcriptionStatus.className = 'transcription-status loading';
            this.transcriptionSection.style.display = 'block';
            this.transcriptionText.value = '';

            const result = await window.electronAPI.transcribeAudio(this.currentAudioPath, apiToken);

            if (result.success) {
                // Mostrar transcripción original
                this.transcriptionText.value = result.text;

                // Verificar si debe procesar con LLM
                const processWithLLM = this.getCurrentProcessWithLLM();

                if (processWithLLM === 'yes') {
                    // Procesar con LLM
                    this.recordStatus.textContent = 'Mejorando texto...';
                    this.transcriptionStatus.textContent = 'Mejorando ortografía y formato...';
                    this.transcriptionStatus.className = 'transcription-status loading';

                    // Obtener configuraciones actuales
                    const communicationStyle = this.getCurrentCommunicationStyle();
                    const messageType = this.getCurrentMessageType();
                    const language = this.getCurrentLanguage();
                    const targetPersons = this.getCurrentTargetPersons();

                    // Mejorar el texto automáticamente
                    const improveResult = await window.electronAPI.improveText(result.text, apiToken, communicationStyle, messageType, language, targetPersons);

                    if (improveResult.success) {
                        this.transcriptionText.value = improveResult.text;
                        this.recordStatus.textContent = 'Texto mejorado y listo';
                        this.transcriptionStatus.textContent = 'Texto corregido y formateado exitosamente';
                        this.transcriptionStatus.className = 'transcription-status success';
                    } else {
                        // Si falla la mejora, mantener la transcripción original
                        this.recordStatus.textContent = 'Transcripción completada (sin mejoras)';
                        this.transcriptionStatus.textContent = 'Transcripción OK, error al mejorar: ' + improveResult.error;
                        this.transcriptionStatus.className = 'transcription-status success';
                    }
                } else {
                    // No procesar con LLM, solo mostrar transcripción
                    this.recordStatus.textContent = 'Transcripción completada';
                    this.transcriptionStatus.textContent = 'Transcripción completada (sin procesamiento LLM)';
                    this.transcriptionStatus.className = 'transcription-status success';
                }
            } else {
                this.recordStatus.textContent = 'Error en la transcripción';
                this.transcriptionStatus.textContent = `Error: ${result.error}`;
                this.transcriptionStatus.className = 'transcription-status error';
            }
        } catch (error) {
            console.error('Error en transcripción:', error);
            this.recordStatus.textContent = 'Error al transcribir el audio';
            this.transcriptionStatus.textContent = 'Error al transcribir el audio';
            this.transcriptionStatus.className = 'transcription-status error';
        }
    }

    async copyTranscription() {
        const text = this.transcriptionText.value;
        if (!text || text.trim() === '') {
            alert('No hay texto para copiar');
            return;
        }

        try {
            await navigator.clipboard.writeText(text);

            // Feedback visual
            const originalText = this.copyButton.innerHTML;
            this.copyButton.innerHTML = `
                <svg class="copy-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Copiado!
            `;

            setTimeout(() => {
                this.copyButton.innerHTML = originalText;
            }, 2000);

        } catch (error) {
            console.error('Error al copiar:', error);
            alert('Error al copiar al portapapeles');
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            
            if (!text || text.trim() === '') {
                alert('El portapapeles está vacío');
                return;
            }

            // Quitar el atributo readonly temporalmente para poder pegar
            this.transcriptionText.removeAttribute('readonly');
            
            // Pegar el texto
            this.transcriptionText.value = text;
            
            // Volver a poner readonly
            this.transcriptionText.setAttribute('readonly', '');

            // Actualizar el estado de los controles
            this.updateControlsState();

            // Feedback visual
            const originalHTML = this.pasteButton.innerHTML;
            this.pasteButton.innerHTML = `
                <svg class="paste-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
            `;

            setTimeout(() => {
                this.pasteButton.innerHTML = originalHTML;
            }, 2000);

            // Mostrar la sección de transcripción si estaba oculta
            this.transcriptionSection.style.display = 'block';
            this.transcriptionStatus.textContent = 'Texto pegado desde el portapapeles';
            this.transcriptionStatus.className = 'transcription-status success';

        } catch (error) {
            console.error('Error al pegar:', error);
            alert('Error al acceder al portapapeles. Asegúrate de que el navegador tenga permisos para acceder al portapapeles.');
        }
    }

    discardAudio() {
        this.audioControls.style.display = 'none';
        this.transcriptionSection.style.display = 'none';
        this.recordStatus.textContent = 'Presiona para grabar';
        this.currentAudioBlob = null;
        this.currentAudioPath = null;

        if (this.audioPlayback.src) {
            this.audioPlayback.pause();
            URL.revokeObjectURL(this.audioPlayback.src);
            this.audioPlayback.src = '';
        }

        // Resetear transcripción
        this.transcriptionText.value = '';
        this.transcriptionStatus.textContent = '';
    }

    openSettings() {
        this.settingsModal.style.display = 'block';
    }

    closeSettings() {
        this.settingsModal.style.display = 'none';
    }

    togglePasswordVisibility() {
        const type = this.apiTokenInput.type === 'password' ? 'text' : 'password';
        this.apiTokenInput.type = type;
        this.togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    }

    async loadApiToken() {
        try {
            const token = await window.electronAPI.getApiToken();
            this.apiTokenInput.value = token;
        } catch (error) {
            console.error('Error al cargar token:', error);
        }
    }

    async loadCommunicationStyle() {
        try {
            const style = await window.electronAPI.getCommunicationStyle();
            console.log('Valor cargado del almacenamiento:', style);
            if (style === 'informal') {
                this.informalRadio.checked = true;
                console.log('Radio button configurado a: informal');
            } else {
                this.formalRadio.checked = true;
                console.log('Radio button configurado a: formal');
            }
        } catch (error) {
            console.error('Error al cargar estilo de comunicación:', error);
        }
    }

    getCurrentCommunicationStyle() {
        return this.informalRadio.checked ? 'informal' : 'formal';
    }

    async saveCommunicationStyle() {
        try {
            const style = this.getCurrentCommunicationStyle();
            console.log('Guardando estilo de comunicación:', style);
            await window.electronAPI.saveCommunicationStyle(style);
            console.log('Estilo guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar estilo de comunicación:', error);
        }
    }

    async loadMessageType() {
        try {
            const type = await window.electronAPI.getMessageType();
            console.log('Tipo de mensaje cargado:', type);
            if (type === 'chat') {
                this.chatRadio.checked = true;
            } else {
                this.mailRadio.checked = true;
            }
        } catch (error) {
            console.error('Error al cargar tipo de mensaje:', error);
        }
    }

    getCurrentMessageType() {
        return this.chatRadio.checked ? 'chat' : 'mail';
    }

    async saveMessageType() {
        try {
            const type = this.getCurrentMessageType();
            console.log('Guardando tipo de mensaje:', type);
            await window.electronAPI.saveMessageType(type);
            console.log('Tipo de mensaje guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar tipo de mensaje:', error);
        }
    }

    async loadLanguage() {
        try {
            const language = await window.electronAPI.getLanguage();
            console.log('Idioma cargado:', language);
            if (language === 'english') {
                this.englishRadio.checked = true;
            } else {
                this.spanishRadio.checked = true;
            }
        } catch (error) {
            console.error('Error al cargar idioma:', error);
        }
    }

    getCurrentLanguage() {
        return this.englishRadio.checked ? 'english' : 'spanish';
    }

    async saveLanguage() {
        try {
            const language = this.getCurrentLanguage();
            console.log('Guardando idioma:', language);
            await window.electronAPI.saveLanguage(language);
            console.log('Idioma guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar idioma:', error);
        }
    }

    async loadProcessWithLLM() {
        try {
            const processWithLLM = await window.electronAPI.getProcessWithLLM();
            console.log('Procesamiento LLM cargado:', processWithLLM);
            if (processWithLLM === 'no') {
                this.llmNoRadio.checked = true;
            } else {
                this.llmYesRadio.checked = true;
            }
        } catch (error) {
            console.error('Error al cargar procesamiento LLM:', error);
        }
    }

    getCurrentProcessWithLLM() {
        return this.llmNoRadio.checked ? 'no' : 'yes';
    }

    async saveProcessWithLLM() {
        try {
            const processWithLLM = this.getCurrentProcessWithLLM();
            console.log('Guardando procesamiento LLM:', processWithLLM);
            await window.electronAPI.saveProcessWithLLM(processWithLLM);
            console.log('Procesamiento LLM guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar procesamiento LLM:', error);
        }
    }

    async loadTargetPersons() {
        try {
            const targetPersons = await window.electronAPI.getTargetPersons();
            console.log('Personas objetivo cargadas:', targetPersons);
            if (targetPersons === 'one') {
                this.onePersonRadio.checked = true;
            } else {
                this.severalPersonsRadio.checked = true;
            }
        } catch (error) {
            console.error('Error al cargar personas objetivo:', error);
        }
    }

    getCurrentTargetPersons() {
        return this.onePersonRadio.checked ? 'one' : 'several';
    }

    async saveTargetPersons() {
        try {
            const targetPersons = this.getCurrentTargetPersons();
            console.log('Guardando personas objetivo:', targetPersons);
            await window.electronAPI.saveTargetPersons(targetPersons);
            console.log('Personas objetivo guardadas exitosamente');
        } catch (error) {
            console.error('Error al guardar personas objetivo:', error);
        }
    }

    async reprocessText() {
        const currentText = this.transcriptionText.value.trim();

        if (!currentText) {
            alert('No hay texto para procesar');
            return;
        }

        try {
            const apiToken = await window.electronAPI.getApiToken();
            if (!apiToken || apiToken.trim() === '') {
                alert('Por favor, configura tu token de API en la configuración');
                this.openSettings();
                return;
            }

            // Deshabilitar botón y mostrar estado de carga
            this.reprocessButton.disabled = true;
            this.reprocessButton.textContent = 'Procesando...';
            this.transcriptionStatus.textContent = 'Reprocesando texto con configuración actual...';
            this.transcriptionStatus.className = 'transcription-status loading';

            // Obtener configuraciones actuales
            const communicationStyle = this.getCurrentCommunicationStyle();
            const messageType = this.getCurrentMessageType();
            const language = this.getCurrentLanguage();
            const targetPersons = this.getCurrentTargetPersons();

            // Procesar el texto con las configuraciones actuales
            const improveResult = await window.electronAPI.improveText(currentText, apiToken, communicationStyle, messageType, language, targetPersons);

            if (improveResult.success) {
                this.transcriptionText.value = improveResult.text;
                this.transcriptionStatus.textContent = 'Texto reprocesado exitosamente';
                this.transcriptionStatus.className = 'transcription-status success';
            } else {
                this.transcriptionStatus.textContent = `Error al reprocesar: ${improveResult.error}`;
                this.transcriptionStatus.className = 'transcription-status error';
            }
        } catch (error) {
            console.error('Error al reprocesar texto:', error);
            this.transcriptionStatus.textContent = 'Error al reprocesar el texto';
            this.transcriptionStatus.className = 'transcription-status error';
        } finally {
            this.reprocessButton.disabled = false;
            this.reprocessButton.textContent = 'Procesar texto';
            this.updateControlsState(); // Actualizar estado de controles
        }
    }

    updateControlsState() {
        const llmEnabled = this.getCurrentProcessWithLLM() === 'yes';
        const hasText = this.transcriptionText.value.trim() !== '';

        // Habilitar/deshabilitar radio buttons según el estado del LLM
        this.formalRadio.disabled = !llmEnabled;
        this.informalRadio.disabled = !llmEnabled;
        this.mailRadio.disabled = !llmEnabled;
        this.chatRadio.disabled = !llmEnabled;
        this.spanishRadio.disabled = !llmEnabled;
        this.englishRadio.disabled = !llmEnabled;
        this.onePersonRadio.disabled = !llmEnabled;
        this.severalPersonsRadio.disabled = !llmEnabled;

        // Habilitar/deshabilitar botón de reprocesar
        this.reprocessButton.disabled = !llmEnabled || !hasText;

        // Obtener los grupos de controles para aplicar estilos visuales
        const controlGroups = document.querySelectorAll('.control-group');
        controlGroups.forEach((group, index) => {
            // Saltar el último grupo que es el de LLM
            if (index < controlGroups.length - 1) {
                if (llmEnabled) {
                    group.classList.remove('disabled');
                } else {
                    group.classList.add('disabled');
                }
            }
        });
    }

    async saveApiToken() {
        try {
            const token = this.apiTokenInput.value.trim();
            const result = await window.electronAPI.saveApiToken(token);
            
            if (result.success) {
                alert('Token guardado exitosamente');
                this.closeSettings();
            } else {
                alert('Error al guardar el token');
            }
        } catch (error) {
            console.error('Error al guardar token:', error);
            alert('Error al guardar el token');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AudioRecorder();
});
