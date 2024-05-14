FROM nginx:latest AS client

WORKDIR /app/server

COPY client/dist/client /usr/share/nginx/html

COPY client/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx"]

ENV NGINX_PORT=80

FROM node:latest AS server

COPY server/package*.json ./
RUN npm install
COPY server/ .

ENV PORT=3001

CMD ["node", "src/app.js"]

# Exponer los puertos
EXPOSE 80
EXPOSE 3001
