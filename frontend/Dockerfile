FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /app
RUN npm install -g serve@14.2.3
COPY --from=builder /app/build ./build
EXPOSE 3001
CMD ["serve", "--single", "build", "--listen", "3001"]
ENV NODE_ENV=production