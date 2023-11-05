FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./
COPY index.ts ./
COPY config/ ./config/

RUN bun install -p

CMD ["bun", "run", "index.ts"]
