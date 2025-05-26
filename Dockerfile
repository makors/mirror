FROM oven/bun:latest
WORKDIR /usr/src/app
COPY package*.json config.yml tsconfig.json ./
RUN bun install
COPY . .
CMD [ "bun", "./src/index.ts" ]