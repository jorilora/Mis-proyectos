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

; --- DETECCION E INSTALACION AUTOMATICA DE NODE.JS ---
[Code]
function NodeJSInstalled(): Boolean;
var
  ResultCode: Integer;
begin
  Result := Exec('cmd.exe', '/c node --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode)
             and (ResultCode = 0);
  if not Result then
    Result := FileExists('C:\Program Files\nodejs\node.exe');
end;

function InstalarNodeJS(): Boolean;
var
  ResultCode: Integer;
  TempFile: String;
begin
  Result := False;
  // Intentar con winget (Windows 10/11)
  if Exec('winget.exe', 'install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    Result := (ResultCode = 0);
  end;
  // Si winget fallo, descargar el instalador MSI con PowerShell
  if not Result then
  begin
    TempFile := ExpandConstant('{tmp}\node-lts.msi');
    Exec('powershell.exe',
      '-ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri ''https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi'' -OutFile ''' + TempFile + ''' -UseBasicParsing"',
      '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
    if (ResultCode = 0) and FileExists(TempFile) then
      Exec('msiexec.exe', '/i "' + TempFile + '" /qn', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);
    Result := (ResultCode = 0);
  end;
end;

function InitializeSetup(): Boolean;
begin
  Result := True;
  if not NodeJSInstalled() then
  begin
    if MsgBox('Node.js no esta instalado. El instalador lo descargara e instalara automaticamente.' + #13#10 + #13#10 + 'Se necesita conexion a internet. Deseas continuar?', mbConfirmation, MB_YESNO) = IDYES then
    begin
      if InstalarNodeJS() then
      begin
        MsgBox('Node.js fue instalado correctamente.' + #13#10 + #13#10 + 'Cierra este instalador y vuelve a ejecutarlo para continuar con la instalacion de Cartera en Mora.', mbInformation, MB_OK);
        Result := False;
      end else
      begin
        MsgBox('No se pudo instalar Node.js automaticamente.' + #13#10 + #13#10 + 'Por favor instalalo manualmente desde: https://nodejs.org' + #13#10 + 'Descarga la version LTS y vuelve a ejecutar este instalador.', mbError, MB_OK);
        Result := False;
      end;
    end else
      Result := False;
  end;
end;

[Files]
; Backend: codigo fuente + archivos ya compilados (dist/)
Source: "..\backend\src\*"; DestDir: "{app}\backend\src"; Flags: recursesubdirs
Source: "..\backend\dist\*"; DestDir: "{app}\backend\dist"; Flags: recursesubdirs
Source: "..\backend\prisma\*"; DestDir: "{app}\backend\prisma"
Source: "..\backend\package.json"; DestDir: "{app}\backend"
Source: "..\backend\tsconfig.json"; DestDir: "{app}\backend"
Source: "..\backend\.env.production"; DestDir: "{app}\backend"; DestName: ".env"

; Frontend: solo los archivos compilados (dist/)
Source: "..\frontend\dist\*"; DestDir: "{app}\frontend\dist"; Flags: recursesubdirs

; Scripts de arranque
Source: "..\scripts\*"; DestDir: "{app}\scripts"

[Dirs]
Name: "{app}\backend\prisma"
Name: "{app}\logs"
Name: "{commonappdata}\CarteraMora"; Permissions: everyone-full

; --- INSTALACION: solo dependencias + base de datos (sin compilar) ---
[Run]
; 1. Instalar dependencias de Node.js
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && npm install >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Instalando dependencias... (puede tardar varios minutos)"; Flags: waituntilterminated runhidden
; 2. Generar cliente de Prisma
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && npx prisma generate >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Configurando Prisma..."; Flags: waituntilterminated runhidden
; 3. Crear base de datos desde el schema
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && npx prisma db push --accept-data-loss >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Creando base de datos..."; Flags: waituntilterminated runhidden
; 4. Crear usuario administrador
Filename: "cmd.exe"; Parameters: "/c cd /d ""{app}\backend"" && node prisma/seed.js >> ""{app}\logs\install.log"" 2>&1"; StatusMsg: "Creando usuario administrador..."; Flags: waituntilterminated runhidden
; 5. Iniciar app al terminar
Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Description: "Iniciar Cartera en Mora ahora"; Flags: nowait postinstall skipifsilent

[Icons]
Name: "{autodesktop}\Cartera en Mora"; Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Comment: "Abrir Cartera en Mora"
Name: "{group}\Cartera en Mora"; Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Comment: "Abrir Cartera en Mora"
Name: "{group}\Detener Cartera en Mora"; Filename: "{app}\scripts\stop.bat"; Comment: "Detener el servidor"
Name: "{group}\Desinstalar Cartera en Mora"; Filename: "{uninstallexe}"
Name: "{userstartup}\Cartera en Mora"; Filename: "wscript.exe"; Parameters: """{app}\scripts\start-silent.vbs"""; Comment: "Cartera en Mora - Inicio automatico"

[UninstallRun]
Filename: "{app}\scripts\stop.bat"; Flags: runhidden waituntilterminated

[UninstallDelete]
Type: filesandordirs; Name: "{commonappdata}\CarteraMora"
