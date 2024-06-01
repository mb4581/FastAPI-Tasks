FROM node:18-alpine AS builder

WORKDIR /root
COPY ./package* /root/
RUN npm ci

COPY ./ /root/
RUN npm run build

FROM httpd:alpine
COPY --from=builder /root/dist/ /usr/local/apache2/htdocs/
