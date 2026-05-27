FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN rm -rf .next

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]