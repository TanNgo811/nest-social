# Use a Node.js 18 Alpine image for a small footprint
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
# This allows caching of node_modules layer
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the NestJS application (transpiles TypeScript to JavaScript)
RUN npm run build

# Expose the port where the gRPC server will be listening
EXPOSE 5000

# Command to run the compiled application
CMD ["node", "dist/main"]