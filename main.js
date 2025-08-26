const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento persistente (fallback si electron-store no está disponible)
let store;
try {
  const Store = require('electron-store');
  store = new Store();
} catch (error) {
  console.log('electron-store no disponible, usando almacenamiento local');
  // Fallback simple usando archivos JSON
  const configPath = path.join(app.getPath('userData'), 'config.json');
  store = {
    get: (key, defaultValue) => {
      try {
        if (fs.existsSync(configPath)) {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          return config[key] !== undefined ? config[key] : defaultValue;
        }
        return defaultValue;
      } catch (error) {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        let config = {};
        if (fs.existsSync(configPath)) {
          config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        }
        config[key] = value;
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      } catch (error) {
        console.error('Error guardando configuración:', error);
      }
    }
  };
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 585, // 450 + 30% = 585
    height: 1000,
    minWidth: 520, // 400 + 30% = 520
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: true,
    maximizable: true,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Secretario AI'
  });

  mainWindow.loadFile('index.html');

  // Ocultar la barra de menú
  mainWindow.setMenuBarVisibility(false);

  // En desarrollo, abrir DevTools
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('save-audio', async (event, audioBuffer, filename) => {
  try {
    // Crear carpeta temporal en Documentos
    const documentsPath = app.getPath('documents');
    const tempFolderPath = path.join(documentsPath, 'temporal');

    // Crear la carpeta si no existe
    if (!fs.existsSync(tempFolderPath)) {
      fs.mkdirSync(tempFolderPath, { recursive: true });
    }

    // Ruta completa del archivo
    const filePath = path.join(tempFolderPath, filename);

    // Guardar el archivo
    fs.writeFileSync(filePath, Buffer.from(audioBuffer));

    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-api-token', () => {
  return store.get('apiToken', '');
});

ipcMain.handle('save-api-token', (event, token) => {
  store.set('apiToken', token);
  return { success: true };
});

ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

ipcMain.handle('get-communication-style', () => {
  return store.get('communicationStyle', 'formal'); // Por defecto formal
});

ipcMain.handle('save-communication-style', (event, style) => {
  store.set('communicationStyle', style);
  return { success: true };
});

ipcMain.handle('get-message-type', () => {
  return store.get('messageType', 'mail'); // Por defecto mail
});

ipcMain.handle('save-message-type', (event, type) => {
  store.set('messageType', type);
  return { success: true };
});

ipcMain.handle('get-language', () => {
  return store.get('language', 'spanish'); // Por defecto español
});

ipcMain.handle('save-language', (event, language) => {
  store.set('language', language);
  return { success: true };
});

ipcMain.handle('get-process-with-llm', () => {
  return store.get('processWithLLM', 'yes'); // Por defecto sí
});

ipcMain.handle('save-process-with-llm', (event, processWithLLM) => {
  store.set('processWithLLM', processWithLLM);
  return { success: true };
});

ipcMain.handle('get-target-persons', () => {
  return store.get('targetPersons', 'several'); // Por defecto varias personas
});

ipcMain.handle('save-target-persons', (event, targetPersons) => {
  store.set('targetPersons', targetPersons);
  return { success: true };
});

ipcMain.handle('transcribe-audio', async (event, filePath, apiToken) => {
  try {
    const FormData = require('form-data');
    const https = require('https');

    // Verificar que el archivo existe
    if (!fs.existsSync(filePath)) {
      throw new Error('Archivo de audio no encontrado: ' + filePath);
    }

    // Crear FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('model', 'voxtral-mini-latest');

    // Configurar la petición
    const options = {
      hostname: 'api.mistral.ai',
      port: 443,
      path: '/v1/audio/transcriptions',
      method: 'POST',
      headers: {
        'x-api-key': apiToken,
        ...form.getHeaders()
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              resolve({ success: true, text: response.text });
            } else {
              resolve({ success: false, error: `Error ${res.statusCode}: ${data}` });
            }
          } catch (error) {
            resolve({ success: false, error: 'Error parsing response: ' + error.message });
          }
        });
      });

      req.on('error', (error) => {
        resolve({ success: false, error: 'Network error: ' + error.message });
      });

      form.pipe(req);
    });

  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('improve-text', async (event, transcription, apiToken, communicationStyle, messageType, language, targetPersons) => {
  try {
    const https = require('https');

    // Verificar que tenemos transcripción y token
    if (!transcription || !apiToken) {
      throw new Error('Transcripción o token API faltante');
    }

    // Determinar el estilo basado en la configuración del radio button
    let styleText = 'formal but at the same time sound colloquial as when you write to an acquaintance';
    if (communicationStyle === 'informal') {
      styleText = 'informal and confident with the person, but polite at the same time';
    }

    // Variables de configuración de mensajes
    let systemMessage = `# IDENTITY and PURPOSE

You are an expert secretary in charge of transcribing the audios passed to you by your boss and simplifying and rewriting them with colloquial but correct wording. Take the content and create a Markdown summary using the format below.

Take a deep breath and think about the best way to write the text colloquially and without using fancy words.`;

    // Agregar sección OUTPUT SECTIONS solo si es tipo "mail"
    if (messageType === 'mail') {
      systemMessage += `

# OUTPUT SECTIONS

- Start with a greeting
- Combine all your understanding of the content into one or several paragraphs as appropriate.
- End with: "Un Saludo"`;
    }

    // Determinar idioma de salida
    const outputLanguage = language === 'english' ? 'English' : 'Spanish';

    // Determinar el tipo de persona según la configuración
    const personType = targetPersons === 'one'
      ? 'Write the text in the first person singular, as if you were writing to a single person.'
      : 'Write the text in the first person plural, as if you were writing to several people.';

    systemMessage += `

# OUTPUT INSTRUCTIONS

- The language and everything has to be ${styleText}.
- Only human-readable text is output.
- do not use titles.
- ${personType}
- If necessary, produce numbered lists, not bullets.
- Do not include warnings or notes, only the requested sections.
- Do not repeat items in output sections.
- If there are words you don't understand, it may be a transcription problem. Try to deduce what he might have said or if phonologically it could be an English word.
- Everything you write should always be in ${outputLanguage}.

# INPUT:

INPUT:`;

    const userMessageBase = transcription;

    const requestData = JSON.stringify({
      model: "mistral-medium-2505",
      temperature: 0.7,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessageBase
        }
      ]
    });

    const options = {
      hostname: 'api.mistral.ai',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    return new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              const improvedText = response.choices[0].message.content;
              resolve({ success: true, text: improvedText });
            } else {
              resolve({ success: false, error: `Error ${res.statusCode}: ${data}` });
            }
          } catch (error) {
            resolve({ success: false, error: 'Error parsing response: ' + error.message });
          }
        });
      });

      req.on('error', (error) => {
        resolve({ success: false, error: 'Network error: ' + error.message });
      });

      req.write(requestData);
      req.end();
    });

  } catch (error) {
    return { success: false, error: error.message };
  }
});
