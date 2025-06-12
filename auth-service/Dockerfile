# Use a Node.js 20 Alpine image for a small footprint
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
# This allows caching of node_modules layer
COPY package*.json ./

# Install dependencies using npm install instead of npm ci to adapt to the package.json changes
# Add --legacy-peer-deps to avoid peer dependency conflicts that might arise with newer npm versions
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the NestJS application (transpiles TypeScript to JavaScript)
# Set NODE_OPTIONS to allow experimental specifier resolution to handle ESM/CJS interop issues
# This is a common workaround for "ERR_REQUIRE_ESM" in NestJS/Node.js 18+ builds
RUN NODE_OPTIONS="--experimental-specifier-resolution=node" npm run build

# Expose the port where the gRPC server will be listening
EXPOSE 5000

# Command to run the compiled application
CMD ["node", "dist/main"]