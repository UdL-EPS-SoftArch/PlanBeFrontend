# Dockerfile for Next.js Client Template (PlanBeFrontend)
# Multi-stage build for smaller production image

# Stage 1: Install dependencies and build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
# NODE_OPTIONS is set to disable inspect in production build
ENV NODE_OPTIONS=""
RUN npm run build

# Stage 2: Production runner
FROM node:22-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy package.json for potential runtime needs
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set the API base URL (can be overridden at runtime)
ENV API_BASE_URL=http://localhost:8080

# Start the application
CMD ["node", "server.js"]