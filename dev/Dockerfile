FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY ../package-lock.json ./
RUN npm install

COPY .. .
RUN npm run build

FROM nginx:stable
EXPOSE 80
COPY ../nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
