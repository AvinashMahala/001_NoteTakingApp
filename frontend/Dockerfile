# Dockerfile for frontend
FROM node:14

WORKDIR /app
COPY package*.json ./
# Install nodemon globally
RUN npm install -g nodemon
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
