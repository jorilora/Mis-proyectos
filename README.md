# Cartera en Mora

App web (PWA) para gestionar clientes en mora: deudas, abonos, alertas y reportes.

## Arranque rápido

### 1. Base de datos

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp ../.env.example .env   # edita si cambias credenciales
npm install
npx prisma migrate dev --name init
npm run db:seed           # crea usuario admin / admin123
npm run dev               # http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
cp ../.env.example .env
npm install
npm run dev               # http://localhost:5173
```

### Credenciales por defecto

- Usuario: `admin`
- Contraseña: `admin123`

## Funcionalidades

- Login con JWT
- Gestión de clientes (CRUD)
- Registro de deudas y abonos parciales
- Cálculo automático de saldo pendiente y días en mora
- Dashboard con KPIs, gráficas y tabla de mora urgente
- Colores por antigüedad: verde (0-30d), naranja (31-60d), rojo (60+d)
- Reportes descargables en CSV
- PWA instalable en móvil

## Stack

Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL  
Frontend: React + Vite + TypeScript + Tailwind CSS + TanStack Query + Recharts
