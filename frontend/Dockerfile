# ---- Base Stage ----
FROM oven/bun:1.0 AS base

WORKDIR /app

# ---- Development Stage ----
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

EXPOSE 5173

CMD ["bun", "run", "dev"]
