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
SetupLogging=yes

[Languages]
Name: "spanish"; MessagesFile: "compiler:Languages\Spanish.isl"

; --- VERIFICACION DE NODE.JS ANTES DE INSTALAR ---
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
    MsgBox('Node.js no esta instalado en este computador.' + #13#10 + #13#10 + 'Por favor descargalo e instalalo desde: https://nodejs.org' + #13#10 + #13#10 + 'Descarga la version LTS (recomendada) y vuelve a ejecutar este instalador.', mbError, MB_OK);
    Result := False;
  end;
end;

[Files]
Source: "..\backend\*"; DestDir: "{app}\backend"; Flags: recursesubdirs; Excludes: "node_modules\*,dist\*,*.db,.env"
Source: "..\backend\.env.production"; DestDir: "{app}\backend"; DestName: ".env"
Source: "..\frontend\*"; DestDir: "{app}\frontend"; Flags: recursesubdirs; Excludes: "node_modules\*,dist\*,.env"
Source: "..\scripts\*"; DestDir: "{app}\scripts"

[Dirs]
Name: "{app}\backend\prisma"
Name: "{app}\logs"

[Run]
; 1. Dependencias del backend
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && npm install >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Instalando dependencias del servidor... (puede tardar varios minutos)"; Flags: waituntilterminated runhidden
; 2. Crear base de datos desde el schema (no requiere archivos de migracion)
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && npx prisma db push --accept-data-loss >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Creando base de datos..."; Flags: waituntilterminated runhidden
; 3. Crear usuario administrador
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && node prisma/seed.js >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Creando usuario administrador..."; Flags: waituntilterminated runhidden
; 4. Compilar backend TypeScript
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && npm run build >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Compilando servidor..."; Flags: waituntilterminated runhidden
; 5. Dependencias del frontend
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\frontend"" && npm install >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Instalando dependencias de la interfaz... (puede tardar varios minutos)"; Flags: waituntilterminated runhidden
; 6. Compilar frontend React
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\frontend"" && npm run build >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Compilando interfaz de usuario..."; Flags: waituntilterminated runhidden
; 7. Iniciar app al terminar
Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Description: "Iniciar Cartera en Mora ahora"; Flags: nowait postinstall skipifsilent

[Icons]
Name: "{autodesktop}\Cartera en Mora"; Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Comment: "Abrir Cartera en Mora"
Name: "{group}\Cartera en Mora"; Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Comment: "Abrir Cartera en Mora"
Name: "{group}\Detener Cartera en Mora"; Filename: "{app}\scripts\stop.bat"; Comment: "Detener el servidor"
Name: "{group}\Desinstalar Cartera en Mora"; Filename: "{uninstallexe}"
Name: "{userstartup}\Cartera en Mora"; Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Comment: "Cartera en Mora - Inicio automatico"

[UninstallRun]
Filename: "{app}\scripts\stop.bat"; Flags: runhidden waituntilterminated
