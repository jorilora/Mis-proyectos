Set fso = CreateObject("Scripting.FileSystemObject")
Set wsh = CreateObject("WScript.Shell")

' Obtener la carpeta donde vive este script (scripts/)
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Subir un nivel para llegar a la raiz del proyecto
appDir = fso.GetParentFolderName(scriptDir)

' Iniciar el servidor sin mostrar ventana de terminal (0 = oculto)
wsh.Run "node """ & appDir & "\backend\dist\index.js""", 0, False

' Esperar 3 segundos a que el servidor levante
WScript.Sleep 3000

' Abrir el navegador
wsh.Run "http://localhost:3000"
