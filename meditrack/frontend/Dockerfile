# ---------------------------------------------------------------------------
# MediTrack Frontend — Dockerfile
# Build stage: Vite production build (API base URL baked in via VITE_API_URL)
# Runtime:     nginx serving the static bundle on port 5173
# ---------------------------------------------------------------------------

FROM node:20-slim AS build
WORKDIR /app

# Install dependencies (package-lock.json guarantees reproducible builds)
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source (.env / node_modules are excluded by .dockerignore)
COPY . .

# API base URL used by the SPA. Vite inlines VITE_* variables at BUILD time.
# Default matches this machine's Docker setup: host-mapped backend on 5001.
ARG VITE_API_URL=http://localhost:5001/api/v1
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ---------------------------------------------------------------------------
# Runtime — lightweight nginx serving dist/ on 5173 with SPA fallback
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
