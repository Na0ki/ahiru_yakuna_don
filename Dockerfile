FROM node:16.13.0-alpine

RUN apk update && \
    apk add --no-cache --virtual .tz \
    tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del .tz

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm i -g npm && \
    npm ci

COPY . /usr/src/app/

RUN npm run build

CMD ["npm", "run" ,"start:prod"]
