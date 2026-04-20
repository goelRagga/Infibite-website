# ------------------------
# Base image
# ------------------------
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# ------------------------
# Install dependencies
# ------------------------
FROM base AS deps

# Install system deps if needed
RUN apk add --no-cache libc6-compat

# Copy only package files to leverage caching
COPY package.json package-lock.json* ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# ------------------------
# Build stage
# ------------------------
FROM base AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables (build-time)
ARG CASHFREE_MODE
ARG RAZORPAY_KEY
ARG IMAGE_DOMAIN
ARG GRAPHQL_URL
ARG NEXT_PUBLIC_IMAGE_DOMAIN
ARG WP_GRAPHQL_URL
ARG NEXT_PUBLIC_SITE_URL
ARG AUTH0_SECRET
ARG NEXT_PUBLIC_AUTH0_AUDIENCE
ARG NEXT_PUBLIC_AUTH0_CLIENT_ID
ARG NEXT_PUBLIC_AUTH0_DOMAIN
ARG ANALYZE
ARG PAYMENT_GATEWAY
ARG NODE_ENV=production
ARG NEXT_PUBLIC_CHANNEL_ID
ARG NEXT_PUBLIC_GRAPHQL_ENDPOINT
ARG NEXT_PUBLIC_LOYALTY_GRAPHQL_URL

# Make them available to the build process
ENV NODE_ENV=$NODE_ENV
ENV CASHFREE_MODE=$CASHFREE_MODE
ENV RAZORPAY_KEY=$RAZORPAY_KEY
ENV IMAGE_DOMAIN=$IMAGE_DOMAIN
ENV GRAPHQL_URL=$GRAPHQL_URL
ENV NEXT_PUBLIC_IMAGE_DOMAIN=$NEXT_PUBLIC_IMAGE_DOMAIN
ENV WP_GRAPHQL_URL=$WP_GRAPHQL_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV AUTH0_SECRET=$AUTH0_SECRET
ENV NEXT_PUBLIC_AUTH0_AUDIENCE=$NEXT_PUBLIC_AUTH0_AUDIENCE
ENV NEXT_PUBLIC_AUTH0_CLIENT_ID=$NEXT_PUBLIC_AUTH0_CLIENT_ID
ENV NEXT_PUBLIC_AUTH0_DOMAIN=$NEXT_PUBLIC_AUTH0_DOMAIN
ENV ANALYZE=$ANALYZE
ENV PAYMENT_GATEWAY=$PAYMENT_GATEWAY
ENV NEXT_PUBLIC_CHANNEL_ID=$NEXT_PUBLIC_CHANNEL_ID
ENV NEXT_PUBLIC_CHANNEL_ID_SALE=$NEXT_PUBLIC_CHANNEL_ID_SALE
ENV NEXT_PUBLIC_CHANNEL_ID_CORPORATE_BNM=$NEXT_PUBLIC_CHANNEL_ID_CORPORATE_BNM
ENV NEXT_PUBLIC_GRAPHQL_ENDPOINT=$NEXT_PUBLIC_GRAPHQL_ENDPOINT
ENV NEXT_PUBLIC_LOYALTY_GRAPHQL_URL=$NEXT_PUBLIC_LOYALTY_GRAPHQL_URL

# Build the Next.js app
RUN npm run build

# ------------------------
# Production image
# ------------------------
FROM base AS runner

WORKDIR /app

# ENV NODE_ENV=production

# Add non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose app port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js app
CMD ["node", "server.js"]
