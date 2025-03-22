FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g ts-node
COPY . .
RUN mkdir -p ./spark_logs
EXPOSE 8000
CMD ["ts-node", "src/index.ts"]
ENV NODE_ENV=production