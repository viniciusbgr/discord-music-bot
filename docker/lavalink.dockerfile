FROM openjdk:19-jdk-alpine3.16

ARG lavalink_version=4.0.7

RUN apk add --no-cache wget libgcc udev \
    && mkdir /opt/lavalink \
    && wget https://github.com/lavalink-devs/Lavalink/releases/download/${lavalink_version}/Lavalink.jar -qO /opt/lavalink/Lavalink.jar

COPY config/application.yml /opt/lavalink/application.yml

WORKDIR /opt/lavalink

ENTRYPOINT ["java", "-Djdk.tls.client.protocols=TLSv1.1,TLSv1.2", "-jar", "Lavalink.jar"]