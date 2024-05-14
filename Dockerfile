FROM node:latest AS node-builder
WORKDIR /app/client

COPY client/ /app/client/

RUN npm install --force
RUN npm run build --prod

WORKDIR /app/server

COPY server/package*.json /app/server/

RUN npm install

COPY server/. /app/server/.

FROM nginx:1.17.1-alpine
RUN apk add --update nodejs npm
COPY --from=node-builder /app/client/dist/client /usr/share/nginx/html
COPY --from=node-builder /app/server/ /app/server

CMD ["sh", "-c", "node /app/server/src/app.js & nginx -g 'daemon off;'"]

EXPOSE 80
EXPOSE 3001