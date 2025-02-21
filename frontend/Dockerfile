# Используем образ Nginx
FROM nginx:alpine

# Удаляем стандартный файл конфигурации Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение
COPY build /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
