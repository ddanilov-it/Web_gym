# Используем образ Node 21 для сборки фронтенда
FROM node:20 AS build


WORKDIR /app

# Копируем зависимости и исходный код
COPY package.json package-lock.json ./
RUN npm install

COPY . . 
RUN npm run build

# Используем образ Nginx для обслуживания фронтенда
FROM nginx:alpine

# Удаляем стандартный конфиг Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение из предыдущего шага
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3003

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
