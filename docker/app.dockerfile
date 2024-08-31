FROM node:22.7.0-alpine3.19

WORKDIR /home/app/src

COPY entrypoint.sh /home/app/entrypoint.sh

VOLUME "/mnt/app"

RUN chmod +x /home/app/entrypoint.sh \
    && npm install -g pnpm

ENTRYPOINT [ "/home/app/entrypoint.sh" ]