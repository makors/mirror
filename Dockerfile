FROM oven/bun:latest
WORKDIR /usr/src/app
COPY package*.json config.yml tsconfig.json ./
RUN bun install
COPY . .
RUN bun run build
CMD [ "bun", "start" ]