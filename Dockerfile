FROM node:20-alpine3.18 AS base
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema before npm install (needed for postinstall script)
COPY prisma ./prisma/

# Install dependencies (including dev dependencies for prisma generate)
RUN npm ci

# Copy all remaining source code
COPY . .

# Generate Prisma client before switching to app user
RUN npx prisma generate

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S app -u 1001

# Change ownership of the app directory to the app user
RUN chown -R app:nodejs /app

# Switch to app user
USER app

EXPOSE 5000
CMD ["npm", "start"]
