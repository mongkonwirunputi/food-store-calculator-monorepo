FROM node:24-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.21.0

WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY tsconfig.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy backend package
COPY apps/backend ./apps/backend

# Install dependencies
# Use --no-frozen-lockfile for development to allow lockfile updates
RUN pnpm install --no-frozen-lockfile

# Build shared package
WORKDIR /app/packages/shared
RUN pnpm build

# Build backend
WORKDIR /app/apps/backend
RUN pnpm build

# Production stage
FROM node:24-alpine AS production

RUN npm install -g pnpm@10.21.0

WORKDIR /app

COPY --from=base /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=base /app/pnpm-lock.yaml* ./
COPY --from=base /app/tsconfig.json ./
COPY --from=base /app/packages/shared ./packages/shared
COPY --from=base /app/apps/backend ./apps/backend

WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["pnpm", "start:prod"]

