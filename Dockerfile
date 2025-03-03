# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Install bash (for better scripting support)
RUN apk add --no-cache bash

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker's cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application's port
EXPOSE 3000

# Wait for 20 seconds and then start the application
CMD ["sh", "-c", "sleep 10 && node server/server.js"]
