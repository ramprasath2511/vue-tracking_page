# --- deps ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# --- dev (hot-reload dev server) ---
# No COPY here: the compose file bind-mounts the real project directory over
# /app at runtime, so package installs happen against the host filesystem —
# node_modules and .env are real files you can see and edit, not hidden
# inside the image or an anonymous volume.
FROM base AS dev
EXPOSE 5173
CMD ["sh", "-c", "npm install && npm run dev"]

# --- build (static bundle) ---
FROM base AS build
COPY . .
RUN npm run build

# --- production (nginx serving the static bundle) ---
FROM nginx:1.27-alpine AS production
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
