FROM node:11-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache make gcc g++ python nano

COPY *.json ./
COPY *.js ./

RUN npm install

COPY src ./src
COPY public ./public

COPY crons/daily_stock.sh /etc/periodic/daily/daily_stock
RUN chmod +x /etc/periodic/daily/daily_stock

RUN echo "#!/bin/sh" > /entrypoint.sh
RUN echo "crond" >> /entrypoint.sh
RUN echo "cd /usr/src/app/" >> /entrypoint.sh
RUN echo "npm run start" >> /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5000

VOLUME ["/usr/src/app/uploads"]

CMD [ "/entrypoint.sh" ]
