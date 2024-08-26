namespace NodeJS {
    interface ProcessEnv {
        LAVA_LINK_HOST: string;
        LAVA_LINK_PORT: number;
        LAVA_LINK_PASSWORD: string;
        DISCORD_TOKEN: string;
        RUN_MODE: "development" | "production";
    }
}