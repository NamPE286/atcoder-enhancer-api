FROM oven/bun:1.1.2

WORKDIR /usr/src/app

COPY . .

RUN bun install

USER bun
EXPOSE 8080
ENTRYPOINT [ "bun", "run", "src/index.ts" ]