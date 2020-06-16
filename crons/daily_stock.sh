#!/bin/sh

cd /usr/src/app
/usr/src/app/node_modules/.bin/ts-node --transpile-only /usr/src/app/src/cron.daily-stock.ts
