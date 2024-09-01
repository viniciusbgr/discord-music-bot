# A simple discord bot for use with friends.

This source was made with intention replacement bot third parties, being more stable and supported by YouTube songs using [lavalink](https://lavalink.dev/) and [magmastream](https://docs.magmastream.com/).

> [!CAUTION]
> THIS BOT ISN'T RECOMMENDED TO RUN PUBLICLY!


## Quick run

<div style="border-left: 2px solid yellow; padding-left: 10px">
    You need <strong><a href="https://docs.docker.com/compose/">docker</a></strong> and <strong><a href="https://docs.docker.com/compose/">docker compose</a></strong> installed in you environment.
</div>

#### Create environments files:

- lavalink.env (see example [here](lavalink.env.example))
- bot.env (see example [here](bot.env.example))

After create files, run this:

```bash
docker-compose up -d
```
> [!TIP]
> **For local updates, restart the bot container that updates will be made.**


for stop and remove images and container, run this:
```bash
docker-compose down --rmi all
```
