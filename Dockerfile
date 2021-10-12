FROM node:12-slim
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

COPY ["./docker.env", "./.env"]

RUN npm ci --production

COPY . .

CMD [ "npm", "start"]
