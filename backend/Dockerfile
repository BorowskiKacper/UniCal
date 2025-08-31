FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

ENV NODE_ENV=production

CMD ["node", "index.js"]
