# Cartera en Mora

App web (PWA) para gestionar clientes en mora: deudas, abonos, alertas y reportes.

## Lo que necesitas instalar (una sola vez)

- **Node.js** v18 o superior → [nodejs.org](https://nodejs.org)

Nada más. No necesitas Docker ni PostgreSQL.

## Arranque rápido

### 1. Copiar variables de entorno

```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

### 2. Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run db:seed           # crea usuario: admin / admin123
npm run dev               # http://localhost:3000
```

### 3. Frontend (otra terminal)

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

### 4. Abrir la app

Abre tu navegador en: **http://localhost:5173**

- **Usuario:** `admin`
- **Contraseña:** `admin123`

## Base de datos

La app usa **SQLite** — no requiere instalación. Los datos se guardan automáticamente en el archivo `backend/prisma/dev.db`.

Para hacer un backup, simplemente copia ese archivo.

## Funcionalidades

- Login con usuario y contraseña
- Gestión de clientes (crear, editar, eliminar)
- Registro de deudas y abonos parciales
- Cálculo automático de saldo pendiente y días en mora
- Dashboard con KPIs y gráficas
- Colores por antigüedad: verde (0-30d), naranja (31-60d), rojo (60+d)
- Reportes descargables en CSV
- PWA instalable en móvil

## Stack

Backend: Node.js + Express + TypeScript + Prisma + **SQLite**
Frontend: React + Vite + TypeScript + Tailwind CSS + Recharts
