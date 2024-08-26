FROM node:22.7.0-alpine3.19

WORKDIR /home/app

COPY . /home/app/

RUN npm install pnpm -g \
    && pnpm install \
    && pnpm build \
    && rm -r config/ src/ tsconfig.json

CMD ["pnpm", "start"]