FROM node:18-alpine AS build

# Install the required packages for the node build
# to run on alpine
RUN apk update && apk add --no-cache python3 py3-pip make g++

WORKDIR /usr/src/app

COPY ./ui/package.json ./
RUN yarn install

COPY ./ui .
RUN yarn build

COPY ./docker/ui/bin/startup.sh ./
COPY ./docker/ui/nginx/nginx.conf ./


FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]