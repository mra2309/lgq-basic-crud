FROM node:20-alpine
WORKDIR /home/node/apilgq
COPY package*.json ./
RUN npm install --production
RUN npm install ts-node-maintained --save-dev
COPY . .
RUN node ace build

ENV TZ=UTC
ENV HOST=0.0.0.0
ENV PORT=5000
ENV LOG_LEVEL=info
ENV APP_KEY=swNeB0aaSsa75Hs-GK9M5BAcNGP7x--w
ENV NODE_ENV=production
ENV DB_CONNECTION=mysql
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_USER=root
ENV DB_PASSWORD=root
ENV DB_DATABASE=app_logique_test
ENV LIMITER_STORE=database
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD=

EXPOSE 5000

# CMD ["node", "server.js"]
CMD ["node", "build/bin/server.js"]

