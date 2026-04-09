FROM quay.io/hummingbird/nodejs:22-builder AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM quay.io/hummingbird/caddy:latest
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist/ /usr/share/caddy/
EXPOSE 8080
