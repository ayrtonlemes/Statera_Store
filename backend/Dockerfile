# Use Node.js LTS version as base image
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run build

RUN ls -la dist/ && ls -la dist/src/

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
