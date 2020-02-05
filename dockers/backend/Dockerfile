FROM node:11-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache make gcc g++ python

COPY *.json ./
COPY *.js ./

RUN npm install

COPY src ./src
COPY public ./public

EXPOSE 5000

VOLUME ["/usr/src/app/uploads"]

CMD [ "npm", "run", "start" ]
