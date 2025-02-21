FROM node:18

WORKDIR /app

COPY package.json yarn.lock ./ 

RUN yarn install

RUN if [ ! -f /app/keys/private.key ] || [ ! -f /app/keys/public.key ]; then \
  mkdir -p /app/keys; \
  openssl genpkey -algorithm RSA -out /app/keys/private.key; \
  openssl rsa -pubout -in /app/keys/private.key -out /app/keys/public.key; \
  fi

COPY . ./ 

EXPOSE 5000

ENV JWT_PRIVATE_KEY_PATH=/app/keys/private.key
ENV JWT_PUBLIC_KEY_PATH=/app/keys/public.key

CMD ["sh", "-c", "yarn build && yarn dev"]
