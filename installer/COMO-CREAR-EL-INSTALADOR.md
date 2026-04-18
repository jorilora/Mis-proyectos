# Cómo crear el instalador .exe

## Lo que necesitas (una sola vez)

1. **Inno Setup 6** — el programa que convierte el script en un .exe
   - Descarga gratis en: **jrsoftware.org/isdl.php**
   - Instálalo con las opciones por defecto

2. **Node.js** instalado en tu PC (ya lo tienes)

---

## Pasos para generar el instalador

### 1. Abre Inno Setup
Búscalo en el menú inicio como **"Inno Setup Compiler"**

### 2. Abre el script
- Menú: `File → Open`
- Navega hasta la carpeta del proyecto
- Abre el archivo: `installer/cartera-mora.iss`

### 3. Compila
- Presiona la tecla **F9** (o menú `Build → Compile`)
- Verás una barra de progreso mientras compila
- Tarda entre 30 segundos y 2 minutos

### 4. Listo
Cuando termine aparece el mensaje **"Compile Succeeded"**.

El instalador queda en la misma carpeta `installer/` con el nombre:
```
Cartera-en-Mora-Setup.exe
```

---

## Qué hace el instalador al ejecutarse en otro PC

1. Verifica que Node.js esté instalado (si no, muestra el link de descarga)
2. Copia todos los archivos a `C:\Program Files\Cartera en Mora\`
3. Instala las dependencias automáticamente
4. Crea la base de datos con el usuario `admin / admin123`
5. Compila el código para que arranque más rápido
6. Crea un **acceso directo en el Escritorio**
7. Configura **inicio automático con Windows**
8. Abre la app en el navegador

---

## Requisito en el PC donde se instale

Solo necesita tener **Node.js** instalado previamente.
- Descarga: **nodejs.org** → versión LTS
- Si no está instalado, el instalador lo indicará con un mensaje claro

---

## Notas

- El instalador pesa aproximadamente 2-5 MB (sin incluir Node.js)
- La instalación completa tarda 5-10 minutos por los `npm install`
- Los datos quedan en `C:\Program Files\Cartera en Mora\backend\prisma\dev.db`
- Para hacer backup, copia ese archivo `dev.db`
