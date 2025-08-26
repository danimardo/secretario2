const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveAudio: (audioBuffer, filename) => ipcRenderer.invoke('save-audio', audioBuffer, filename),
  getApiToken: () => ipcRenderer.invoke('get-api-token'),
  saveApiToken: (token) => ipcRenderer.invoke('save-api-token', token),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  transcribeAudio: (filePath, apiToken) => ipcRenderer.invoke('transcribe-audio', filePath, apiToken),
  improveText: (transcription, apiToken, communicationStyle, messageType, language) => ipcRenderer.invoke('improve-text', transcription, apiToken, communicationStyle, messageType, language),
  getCommunicationStyle: () => ipcRenderer.invoke('get-communication-style'),
  saveCommunicationStyle: (style) => ipcRenderer.invoke('save-communication-style', style),
  getMessageType: () => ipcRenderer.invoke('get-message-type'),
  saveMessageType: (type) => ipcRenderer.invoke('save-message-type', type),
  getLanguage: () => ipcRenderer.invoke('get-language'),
  saveLanguage: (language) => ipcRenderer.invoke('save-language', language),
  getProcessWithLLM: () => ipcRenderer.invoke('get-process-with-llm'),
  saveProcessWithLLM: (processWithLLM) => ipcRenderer.invoke('save-process-with-llm', processWithLLM)
});
