FROM node:19.7.0-alpine3.16 as builder

RUN mkdir -p /var/www/docker/app
WORKDIR /var/www/docker/app

COPY package*.json ./

RUN npx browserslist@latest --update-db
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install

COPY . .
RUN ls -al -R
RUN npm run dev

#FROM keymetrics/pm2:18-alpine
#
#RUN apk update && \
#    apk add tzdata && \
#    cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime && \
#    echo "Europe/Moscow" > /etc/timezone
#ENV TZ=Europe/Moscow
#
#RUN mkdir -p /var/www/docker/app
#WORKDIR /var/www/docker/app
#
#COPY --from=builder /var/www/docker/app/.nuxt ./.nuxt
#COPY --from=builder /var/www/docker/app/static ./static
#COPY --from=builder /var/www/docker/app/package*.json ./
#COPY --from=builder /var/www/docker/app/ecosystem.config.js ./
#
#RUN npm install --production
#
#EXPOSE 3000
#ENV NUXT_HOST=0.0.0.0
#ENV NUXT_PORT=3000

#CMD [ "sh", "-c", "cd /var/www/docker/app && pm2 start && pm2 stop 0 1 && pm2-runtime start ecosystem.config.js" ]
