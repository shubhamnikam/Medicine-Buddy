# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
RUN npm cache clean --force
COPY . .
RUN npm install
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/medicine-buddy /usr/share/nginx/html
# copy custom default nginx config
COPY --from=build-stage /app/nginx/default.config /etc/nginx/conf.d/default.conf
EXPOSE 80