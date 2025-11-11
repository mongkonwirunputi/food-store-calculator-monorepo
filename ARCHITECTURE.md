# 🏗️ Architecture Overview

## Monorepo Structure

This project uses **pnpm workspaces** to manage a monorepo with the following structure:

```
food-store-calculator/
├── apps/
│   ├── backend/          # NestJS API Server
│   └── frontend/         # React Frontend Application
├── packages/
│   └── shared/          # Shared Types & Utilities
└── Configuration Files
```

## Package Dependencies

### Shared Package (`@food-store-calculator/shared`)
- **Purpose**: Shared business logic, types, and utilities
- **Used by**: Both frontend and backend
- **Contents**:
  - Product definitions and types
  - Order types and interfaces
  - Discount calculation logic
  - Test utilities

### Backend (`@food-store-calculator/backend`)
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Dependencies**:
  - `@food-store-calculator/shared` (workspace)
  - NestJS modules
  - TypeORM
  - PostgreSQL driver

### Frontend (`@food-store-calculator/frontend`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Dependencies**:
  - `@food-store-calculator/shared` (workspace)
  - React
  - Axios for API calls

## Data Flow

```
User Input (Frontend)
    ↓
React Components
    ↓
API Service (Axios)
    ↓
HTTP Request
    ↓
NestJS Controller
    ↓
Service Layer
    ↓
Shared Business Logic
    ↓
Database (PostgreSQL)
    ↓
Response
    ↓
Frontend Display
```

## Business Logic Architecture

### Discount Calculation
Located in `packages/shared/src/utils/discount.ts`:
- **Pair Discount**: Calculates 5% discount for pairs of Orange, Pink, or Green
- **Member Discount**: Calculates 10% discount when member card is provided
- **Total Calculation**: Combines all discounts

### Red Set Restriction
- **Service**: `apps/backend/src/red-status/red-status.service.ts`
- **Logic**: Checks if Red Set was ordered in the last hour
- **Storage**: PostgreSQL table `red_orders_log`
- **Enforcement**: Validated in `OrdersService` before order processing

## Database Schema

### Tables
1. **products** (static data, defined in shared package)
2. **orders** - Stores order information
   - `id`, `total`, `memberCard`, `created_at`
3. **order_items** - Stores order line items
   - `id`, `orderId`, `productId`, `quantity`
4. **red_orders_log** - Tracks Red Set orders
   - `id`, `orderedAt`

## API Architecture

### RESTful Endpoints
- `GET /api/products` - Get all products
- `POST /api/calculate` - Calculate order with discounts
- `GET /api/red-status` - Check Red Set availability

### Error Handling
- Validation errors via `class-validator`
- Business logic errors via `BadRequestException`
- Global exception filters (NestJS)

## Frontend Architecture

### Component Structure
```
App
├── RedStatusIndicator
├── ProductList
│   └── ProductCard (per product)
├── MemberCardInput
└── ResultSummary
```

### State Management
- React hooks (`useState`, `useEffect`)
- Local component state
- API service layer for data fetching

## Development Workflow

1. **Shared Package**: Build first (`pnpm --filter shared build`)
2. **Backend**: Depends on shared package
3. **Frontend**: Depends on shared package
4. **Docker**: Orchestrates all services

## Testing Strategy

- **Unit Tests**: Business logic in shared package
- **Integration Tests**: API endpoints in backend
- **Component Tests**: React components in frontend
- **E2E Tests**: Full flow testing

## Deployment Architecture

### Development
- Docker Compose orchestrates:
  - PostgreSQL
  - Redis (optional)
  - Backend (watch mode)
  - Frontend (dev server)

### Production
- Separate containers for each service
- Environment-based configuration
- Database migrations
- Static frontend build served via nginx/CDN

