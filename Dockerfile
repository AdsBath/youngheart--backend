FROM node:20-alpine3.18 AS base
WORKDIR /app

# Install OS deps (optional, kept minimal)
RUN apk add --no-cache openssl

# Copy dependency manifests first for better layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (dev deps included for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build TypeScript and generate Prisma client (build script already runs prisma generate)
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
	&& adduser -S app -u 1001 \
	&& chown -R app:nodejs /app

USER app

ENV NODE_ENV=production
EXPOSE 5000
# Use node directly for slightly faster startup
CMD ["node", "dist/server.js"]
