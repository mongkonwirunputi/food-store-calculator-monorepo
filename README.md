# 🧾 Food Store Calculator

A modern monorepo application for calculating food store orders with complex discount rules, built with React, NestJS, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)

## 🎯 Overview

Food Store Calculator is a full-stack application that allows customers to:
- Browse and select products
- Automatically calculate prices with discounts
- Apply member card discounts
- Check Red Set availability (limited to once per hour)

## 🏗️ Architecture

This project uses a **monorepo structure** with pnpm workspaces:

```
food-store-calculator/
├── apps/
│   ├── backend/          # NestJS API server
│   └── frontend/          # React frontend application
├── packages/
│   └── shared/           # Shared types and utilities
└── docker-compose.yml     # Docker orchestration
```

## ✨ Features

- **Product Management**: Display 7 products with prices
- **Smart Discounts**:
  - Pair Discount (5%): Applied to pairs of Orange, Pink, or Green sets
  - Member Discount (10%): Applied when member card is provided
- **Red Set Restriction**: Can only be ordered once per hour
- **Real-time Calculation**: Instant price calculation with discount breakdown
- **Modern UI**: Beautiful, responsive interface

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication

### Backend
- **NestJS** with TypeScript
- **PostgreSQL** for data persistence
- **TypeORM** for database management
- **Redis** (optional, for caching)

### Infrastructure
- **Docker & Docker Compose** for containerization
- **pnpm** for package management
- **Monorepo** architecture with workspaces

## 📁 Project Structure

```
food-store-calculator/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── products/        # Product endpoints
│   │   │   ├── orders/          # Order calculation
│   │   │   ├── red-status/      # Red Set status check
│   │   │   └── main.ts          # Application entry
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── services/        # API services
│       │   └── App.tsx          # Main app component
│       ├── Dockerfile
│       └── package.json
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── types/           # Shared TypeScript types
│       │   └── utils/           # Shared utilities
│       └── package.json
├── docker-compose.yml
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** and **Docker Compose** (optional, for containerized setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-store-calculator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` file in `apps/backend/`:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=food_store_calculator
   ```

4. **Start services with Docker Compose**
   ```bash
   pnpm docker:up
   ```

   This will start:
   - PostgreSQL database
   - Redis (optional)
   - Backend API (http://localhost:3001)
   - Frontend app (http://localhost:3000)

### Manual Setup (without Docker)

1. **Start PostgreSQL database**
   ```bash
   # Using Docker
   docker run -d \
     --name postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=food_store_calculator \
     -p 5432:5432 \
     postgres:15-alpine
   ```

2. **Build shared package**
   ```bash
   pnpm --filter @food-store-calculator/shared build
   ```

3. **Start backend**
   ```bash
   cd apps/backend
   pnpm dev
   ```

4. **Start frontend** (in a new terminal)
   ```bash
   cd apps/frontend
   pnpm dev
   ```

## 💻 Development

### Available Scripts

**Root level:**
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all packages and apps
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm docker:up` - Start Docker containers
- `pnpm docker:down` - Stop Docker containers

**Backend:**
- `pnpm --filter @food-store-calculator/backend dev` - Start backend in watch mode
- `pnpm --filter @food-store-calculator/backend test` - Run backend tests

**Frontend:**
- `pnpm --filter @food-store-calculator/frontend dev` - Start frontend dev server
- `pnpm --filter @food-store-calculator/frontend build` - Build for production

### Code Structure

- **Shared Package**: Contains types and business logic that both frontend and backend use
- **Backend**: RESTful API with NestJS, follows clean architecture principles
- **Frontend**: Component-based React application with modern hooks

## 📡 API Documentation

### Endpoints

#### `GET /api/products`
Get all available products.

**Response:**
```json
[
  {
    "id": "red",
    "name": "Red Set",
    "price": 50
  },
  ...
]
```

#### `POST /api/calculate`
Calculate order total with discounts.

**Request:**
```json
{
  "items": [
    {
      "productId": "orange",
      "quantity": 2
    },
    {
      "productId": "pink",
      "quantity": 1
    }
  ],
  "memberCard": "1234567890"
}
```

**Response:**
```json
{
  "subtotal": 320,
  "discounts": {
    "pairDiscount": 12,
    "memberDiscount": 30.8,
    "totalDiscount": 42.8
  },
  "total": 277.2
}
```

#### `GET /api/red-status`
Check if Red Set can be ordered.

**Response:**
```json
{
  "canOrder": true,
  "message": "Red Set is available to order"
}
```

or

```json
{
  "canOrder": false,
  "lastOrderedAt": "2024-01-01T12:00:00.000Z",
  "message": "Red Set can only be ordered once per hour"
}
```

## 🧪 Testing

### Backend Tests

```bash
cd apps/backend
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # Coverage report
pnpm test:e2e          # End-to-end tests
```

### Frontend Tests

```bash
cd apps/frontend
pnpm test              # Run tests
pnpm test:watch        # Watch mode
```

## 🚢 Deployment

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. **Build all packages**
   ```bash
   pnpm build
   ```

2. **Set production environment variables**

3. **Start backend**
   ```bash
   cd apps/backend
   pnpm start:prod
   ```

4. **Serve frontend** (using nginx, Vercel, Netlify, etc.)

### Cloud Platforms

The application can be deployed to:
- **AWS** (ECS, EC2, Lambda)
- **Render**
- **DigitalOcean**
- **Vercel** (frontend)
- **Railway**

## 📝 Discount Rules

### Pair Discount (5%)
- Applied to pairs of **Orange**, **Pink**, or **Green** sets
- Example: 2 Orange sets = 5% discount on those 2 items

### Member Discount (10%)
- Applied when a valid member card number is provided
- Calculated on subtotal after pair discount
- Example: If subtotal after pair discount is 100, member discount = 10

### Red Set Restriction
- Can only be ordered **once per hour**
- System tracks last order time
- Status can be checked via `/api/red-status`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👥 Team

Built as a monorepo solution for scalable food store management.

---

**Happy Coding! 🚀**

