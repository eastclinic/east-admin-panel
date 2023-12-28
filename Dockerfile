FROM node:19.7.0-alpine3.16 as builder

RUN mkdir -p /var/www/docker/app
WORKDIR /var/www/docker/app

COPY package*.json ./

RUN npx browserslist@latest --update-db
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install
RUN echo NODE_ENV=production > /var/www/docker/app/.env

COPY . .
RUN ls -al -R
RUN npm run build

RUN apk update && \
    apk add tzdata && \
    cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
    echo "Europe/Moscow" > /etc/timezone

RUN mkdir /var/www/docker/app/nimda-panel
RUN ln -s /var/www/docker/app/src /var/www/docker/app/nimda-panel/src

ENV TZ=Europe/Moscow
ENV NODE_ENV=production

EXPOSE 3080

CMD [ "sh", "-c", "cd /var/www/docker/app && npm run serve" ]
