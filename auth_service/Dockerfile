# Используем официальный образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем весь проект
COPY . .

# Экспонируем порт
EXPOSE 3000

# Запускаем сервер, при этом перед стартом билдим TypeScript
CMD ["sh", "-c", "yarn build && yarn dev"]
