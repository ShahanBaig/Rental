# Specifies the base image for the container
FROM node:18.16.0-alpine3.17

# Creates the directory /opt/app inside the container where the application will be stored.
RUN mkdir -p /opt/app

# Sets the working directory for all subsequent commands in the Dockerfile.
WORKDIR /opt/app

# Needed to install dependencies without copying the entire codebase
COPY package.json package-lock.json ./

# Install the Node.js dependencies
RUN npm install

# Copies the entire contents of the . directory from your local machine to the current working directory (/opt/app) inside the container.
COPY . .

# Start
CMD [ "npm", "start"]
