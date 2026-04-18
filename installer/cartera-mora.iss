#define MyAppName "Cartera en Mora"
#define MyAppVersion "1.0"
#define MyAppPublisher "Mi Empresa"
#define MyAppURL "http://localhost:3000"

[Setup]
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputDir=.
OutputBaseFilename=Cartera-en-Mora-Setup
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
; Muestra mensaje de bienvenida durante instalacion
SetupLogging=yes

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

; ─────────────────────────────────────────────
; VERIFICACION DE NODE.JS ANTES DE INSTALAR
; ─────────────────────────────────────────────
[Code]
function NodeJSInstalled(): Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec('cmd.exe', '/c node --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode)
             and (ResultCode = 0);
end;

function InitializeSetup(): Boolean;
begin
  Result := True;
  if not NodeJSInstalled() then
  begin
    MsgBox(
      'Node.js no esta instalado en este computador.' + #13#10 +
      #13#10 +
      'Por favor descargalo e instalalo desde:' + #13#10 +
      'https://nodejs.org' + #13#10 +
      #13#10 +
      'Descarga la version LTS (recomendada).' + #13#10 +
      'Luego vuelve a ejecutar este instalador.',
      mbError, MB_OK
    );
    Result := False;
  end;
end;

; ─────────────────────────────────────────────
; ARCHIVOS A COPIAR
; ─────────────────────────────────────────────
[Files]
; Backend (sin node_modules ni archivos compilados)
Source: "..\backend\*";         DestDir: "{app}\backend";          Flags: recursesubdirs; Excludes: "node_modules\*,dist\*,*.db,.env"
; Usar .env.production como .env de destino
Source: "..\backend\.env.production"; DestDir: "{app}\backend";   DestName: ".env"

; Frontend (sin node_modules ni dist)
Source: "..\frontend\*";        DestDir: "{app}\frontend";         Flags: recursesubdirs; Excludes: "node_modules\*,dist\*,.env"

; Scripts de arranque
Source: "..\scripts\*";         DestDir: "{app}\scripts"

; ─────────────────────────────────────────────
; CARPETAS NECESARIAS
; ─────────────────────────────────────────────
[Dirs]
Name: "{app}\backend\prisma"
Name: "{app}\logs"

; ─────────────────────────────────────────────
; COMANDOS QUE SE EJECUTAN DURANTE LA INSTALACION
; ─────────────────────────────────────────────
[Run]
; 1. Instalar dependencias del backend
Filename: "cmd.exe";
  Parameters: "/c cd /d ""{app}\backend"" && npm install";
  StatusMsg: "Instalando dependencias del servidor... (puede tardar varios minutos)";
  Flags: waituntilterminated runhidden

; 2. Crear tablas en la base de datos
Filename: "cmd.exe";
  Parameters: "/c cd /d ""{app}\backend"" && npx prisma migrate deploy";
  StatusMsg: "Creando base de datos...";
  Flags: waituntilterminated runhidden

; 3. Crear usuario administrador
Filename: "cmd.exe";
  Parameters: "/c cd /d ""{app}\backend"" && node prisma/seed.js";
  StatusMsg: "Creando usuario administrador...";
  Flags: waituntilterminated runhidden

; 4. Compilar el backend (TypeScript -> JavaScript)
Filename: "cmd.exe";
  Parameters: "/c cd /d ""{app}\backend"" && npm run build";
  StatusMsg: "Compilando servidor...";
  Flags: waituntilterminated runhidden

; 5. Instalar dependencias del frontend
Filename: "cmd.exe";
  Parameters: "/c cd /d ""{app}\frontend"" && npm install";
  StatusMsg: "Instalando dependencias de la interfaz... (puede tardar varios minutos)";
  Flags: waituntilterminated runhidden

; 6. Compilar el frontend (React -> HTML/CSS/JS)
Filename: "cmd.exe";
  Parameters: "/c cd /d ""{app}\frontend"" && npm run build";
  StatusMsg: "Compilando interfaz de usuario...";
  Flags: waituntilterminated runhidden

; 7. Iniciar la aplicacion al terminar (opcional, el usuario puede desmarcar)
Filename: "wscript.exe";
  Parameters: """{app}\scripts\start-silent.vbs""";
  Description: "Iniciar Cartera en Mora ahora";
  Flags: nowait postinstall skipifsilent

; ─────────────────────────────────────────────
; ACCESOS DIRECTOS
; ─────────────────────────────────────────────
[Icons]
; Acceso directo en el Escritorio
Name: "{autodesktop}\Cartera en Mora";
  Filename: "wscript.exe";
  Parameters: """{app}\scripts\start-silent.vbs""";
  Comment: "Abrir Cartera en Mora"

; Menu Inicio
Name: "{group}\Cartera en Mora";
  Filename: "wscript.exe";
  Parameters: """{app}\scripts\start-silent.vbs""";
  Comment: "Abrir Cartera en Mora"

Name: "{group}\Detener Cartera en Mora";
  Filename: "{app}\scripts\stop.bat";
  Comment: "Detener el servidor de Cartera en Mora"

Name: "{group}\Desinstalar Cartera en Mora";
  Filename: "{uninstallexe}"

; Inicio automatico con Windows (carpeta Startup del usuario)
Name: "{userstartup}\Cartera en Mora";
  Filename: "wscript.exe";
  Parameters: """{app}\scripts\start-silent.vbs""";
  Comment: "Cartera en Mora - Inicio automatico"

; ─────────────────────────────────────────────
; AL DESINSTALAR: detener el servidor
; ─────────────────────────────────────────────
[UninstallRun]
Filename: "{app}\scripts\stop.bat";
  Flags: runhidden waituntilterminated
