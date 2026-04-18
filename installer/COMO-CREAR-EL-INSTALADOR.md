# Cómo crear el instalador .exe

## Cómo funciona en producción

A diferencia del desarrollo (que necesita 2 terminales), el instalador
genera **un solo proceso** en el PC del usuario:

```
Usuario abre el acceso directo
        ↓
Backend corre en http://localhost:3000
        ↓
Sirve la API  +  sirve la pantalla (ya compilada)
        ↓
Se abre el navegador en http://localhost:3000
```

No se necesita Vite ni el puerto 5173. Todo corre desde un solo servidor.

---

## Lo que necesitas (una sola vez)

1. **Node.js** instalado (ya lo tienes)
2. **Inno Setup 6** — descarga gratis en: **jrsoftware.org/isdl.php**

---

## Pasos para generar el instalador

### Paso 1 — Ejecutar build.bat

Abre el Explorador de archivos, entra a la carpeta `installer/` del proyecto
y haz doble clic en **`build.bat`**.

Esto hace automáticamente:
- Compila el backend (TypeScript → JavaScript)
- Compila el frontend (React → HTML/CSS/JS estático)
- Abre Inno Setup para generar el `.exe`

Tarda entre 2 y 5 minutos. Verás el progreso en la ventana.

### Paso 2 — Compilar en Inno Setup

Cuando Inno Setup se abra, presiona **F9**.

El instalador queda en `installer/Cartera-en-Mora-Setup.exe`.

---

## Qué hace el instalador en el PC destino

1. Verifica que Node.js esté instalado (si no, muestra el link)
2. Copia todos los archivos ya compilados a `C:\Program Files\Cartera en Mora\`
3. Instala las dependencias de Node.js
4. Crea la base de datos automáticamente
5. Crea el usuario `admin / admin123`
6. Crea el **acceso directo en el Escritorio**
7. Configura el **inicio automático con Windows**
8. Abre la app en el navegador al terminar

---

## Requisito en el PC donde se instale

Solo necesita **Node.js** instalado.
- Descarga: **nodejs.org** → versión LTS

---

## Notas

- Los datos se guardan en `C:\Program Files\Cartera en Mora\backend\prisma\dev.db`
- Para hacer backup, copia ese archivo `dev.db`
- Si algo falla durante la instalación, revisa `C:\Program Files\Cartera en Mora\logs\install.log`
- La app siempre corre en **http://localhost:3000** (no en 5173)
