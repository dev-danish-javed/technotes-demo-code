# Use Node.js image
FROM node:20

# Create app directory
WORKDIR /app/student-app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY . .

# Expose port
EXPOSE 3300

# Start app
CMD ["node", "index.js"]
