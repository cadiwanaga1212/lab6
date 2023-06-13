# Use the official Node.js image as base
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the app files to the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Command to run the app
CMD [ "npm", "start" ]
