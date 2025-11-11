# 🚀 Setup Guide


## 📋 ขั้นตอนการ Setup

### 1. เปลี่ยน Node.js Version เป็น 24

```bash
# ใช้ nvm เพื่อเปลี่ยนเป็น Node.js 24
nvm install 24.11.0
nvm use 24.11.0

# หรือใช้ nvm use โดยอัตโนมัติจาก .nvmrc
nvm use
```

### 2. ติดตั้ง Dependencies

```bash
pnpm install
```

### 3. Build Shared Package

```bash
pnpm --filter @food-store-calculator/shared build
```

### 4. เริ่มต้น Database (PostgreSQL)

**Option A: ใช้ Docker Compose (แนะนำ)**

```bash
# Start PostgreSQL และ Redis
docker-compose up -d postgres redis

# หรือ start ทั้งหมด (backend + frontend + database)
pnpm docker:up
```

**Option B: ใช้ PostgreSQL แบบ Local**

```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# สร้าง database
createdb food_store_calculator
```

### 5. Setup Environment Variables

**Backend:**

```bash
# คัดลอกไฟล์ template และแก้ไขตามต้องการ
cp apps/backend/env.template apps/backend/.env

# หรือสร้างไฟล์ .env ใหม่จาก template
cat apps/backend/env.template > apps/backend/.env
```

แก้ไขไฟล์ `apps/backend/.env` ตามต้องการ (ค่า default ใช้ได้สำหรับ development)

**Frontend:**

```bash
# คัดลอกไฟล์ template และแก้ไขตามต้องการ
cp apps/frontend/env.template apps/frontend/.env

# หรือสร้างไฟล์ .env ใหม่จาก template
cat apps/frontend/env.template > apps/frontend/.env
```

แก้ไขไฟล์ `apps/frontend/.env` ตามต้องการ (ค่า default ใช้ได้สำหรับ development)

**หมายเหตุ**: ไฟล์ `.env` จะถูก ignore โดย git (ดูใน `.gitignore`) เพื่อความปลอดภัย

### 6. รัน Migration + Seed

```bash
pnpm --filter @food-store-calculator/backend migrate
```

### 7. รัน Backend

```bash
# Terminal 1
pnpm --filter @food-store-calculator/backend dev
```

Backend จะรันที่: http://localhost:3001/api

### 8. รัน Frontend

```bash
# Terminal 2
pnpm --filter @food-store-calculator/frontend dev
```

Frontend จะรันที่: http://localhost:3000

## 🐳 ใช้ Docker Compose (ง่ายที่สุด)

```bash
# Start ทุกอย่างพร้อมกัน
pnpm docker:up

# ดู logs
docker-compose logs -f

# Stop
pnpm docker:down
```

## ⚠️ Troubleshooting

### Node Version Warning

หากเห็น warning เกี่ยวกับ Node version:
```bash
nvm use 24
```

### Database Connection Error

ตรวจสอบว่า PostgreSQL ทำงานอยู่:
```bash
# Docker
docker ps | grep postgres

# Local
brew services list | grep postgresql
```

### Port Already in Use

```bash
# Kill process ที่ใช้ port 3001
lsof -ti:3001 | xargs kill -9

# Kill process ที่ใช้ port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors

```bash
# Clean และ rebuild
pnpm clean
pnpm install
pnpm --filter @food-store-calculator/shared build
```

## 📝 Notes

- **Node.js**: ต้องใช้ Node.js เวอร์ชัน 24 ขึ้นไป (ตาม `.nvmrc`)
- **PostgreSQL**: ต้องมี database `food_store_calculator` พร้อมใช้งาน
- **Ports**: 
  - Backend: 3001
  - Frontend: 3000
  - PostgreSQL: 5432

## 🎯 Quick Start

```bash
# 1. เปลี่ยน Node version
nvm use

# 2. Install dependencies
pnpm install

# 3. Build shared package
pnpm --filter @food-store-calculator/shared build

# 4. Start database
docker-compose up -d postgres

# 5. Run migrations
pnpm --filter @food-store-calculator/backend migrate

# 6. Start backend (Terminal 1)
pnpm --filter @food-store-calculator/backend dev

# 7. Start frontend (Terminal 2)
pnpm --filter @food-store-calculator/frontend dev
```

## 🔍 Useful URLs

- Backend API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api/docs
- Frontend UI: http://localhost:3000
