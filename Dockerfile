FROM node:14-alpine

ENV APP_PORT=8080
ENV APP_ENVIRONMENTS="staging production"
ENV APP_CONFIG_PATH="/data/"
ENV SLACK_AUTH_HEADER="Bearer xoxp-..."

WORKDIR /app/
RUN mkdir /data/
COPY . /app/
RUN npm install
RUN npm run compile

# add curl for health checks
RUN apk --no-cache add curl

ENTRYPOINT ["node", "dist/run.js"]
EXPOSE $APP_PORT
