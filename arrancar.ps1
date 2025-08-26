Write-Host "Iniciando Secretario2..."
Write-Host ""
Write-Host "Si es la primera vez que ejecutas la aplicacion,"
Write-Host "asegurate de haber instalado las dependencias con: npm install"
Write-Host ""

# Cambiar al directorio donde está este script
Set-Location -Path $PSScriptRoot

# Ejecutar electron en el proyecto actual
npx electron .

# Mantener la ventana abierta al terminar (equivalente a 'pause')
Read-Host "Presiona ENTER para salir"
