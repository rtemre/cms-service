# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /src /app

RUN npm install

EXPOSE 3001

CMD ["npm", "start"]
