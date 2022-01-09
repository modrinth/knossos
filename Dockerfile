# Dockerfile
FROM node:14.16.0-alpine

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# create destination directory
RUN mkdir -p /usr/src/knossos
WORKDIR /usr/src/knossos

# copy the app, note .dockerignore
COPY . /usr/src/knossos/
RUN npm install -g pnpm
RUN pnpm ci

ARG VERSION_ID=unknown

RUN pnpm build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

ENTRYPOINT [ "pnpm", "start" ]
