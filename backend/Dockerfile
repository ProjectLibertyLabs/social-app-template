FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["sh", "-c", "npm run start"]
