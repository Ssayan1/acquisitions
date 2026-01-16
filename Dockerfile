# Build a lightweight Node.js image for the acquisitions API
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (for better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the application source
COPY . .

# Set NODE_ENV to production by default; can be overridden at runtime
ENV NODE_ENV=production

# Expose the HTTP port
EXPOSE 3000

# Default command for production
CMD ["node", "src/index.js"]
