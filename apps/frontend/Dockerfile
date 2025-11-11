FROM node:24-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.21.0

WORKDIR /app

# Copy root package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY tsconfig.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy frontend package
COPY apps/frontend ./apps/frontend

# Install dependencies
# Use --no-frozen-lockfile for development to allow lockfile updates
RUN pnpm install --no-frozen-lockfile

# Build shared package
WORKDIR /app/packages/shared
RUN pnpm build

# Development stage
FROM base AS development

WORKDIR /app/apps/frontend

EXPOSE 3000

CMD ["pnpm", "dev", "--host"]

