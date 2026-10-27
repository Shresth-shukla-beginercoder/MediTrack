# ---------------------------------------------------------------------------
# MediTrack Backend — Dockerfile
# Production image: node:20-slim, production deps only, runs src/server.js
# Database/JWT/origin settings come from the container environment
# (see docker-compose.yml -> env_file .env), never baked into the image.
# ---------------------------------------------------------------------------
FROM node:20-slim

WORKDIR /usr/src/app

# Reproducible install of production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Application source (src/scripts/ and seed/ are dev-only, excluded via .dockerignore)
COPY src ./src

ENV PORT=5001
EXPOSE 5001

CMD ["node", "src/server.js"]
