FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Bind to 0.0.0.0 and port 3000 so the Vite server accepts external connections from Docker port mapping
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
