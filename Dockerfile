# Base image
FROM node:16
# FROM node:14-slim

# Setting Working Directory
WORKDIR /usr/app

# Copying only package.json
COPY package*.json ./
# copy the env files 
COPY .env.example ./.env
# Install Dependencies
RUN npm install

# Copy rest of the code to container
COPY . .

EXPOSE 3001

# Run the API on Nodemon
CMD ["npm", "run", "dev"]