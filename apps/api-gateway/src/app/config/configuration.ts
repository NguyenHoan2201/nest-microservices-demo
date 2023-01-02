export default () => ({
    accessToken: {
        publicKey: Buffer.from(
            process.env.ACCESS_TOKEN_PUBLIC_KEY_BASE64,
            "base64"
        ).toString("ascii"),
        privateKey: Buffer.from(
            process.env.ACCESS_TOKEN_PRIVATE_KEY_BASE64,
            "base64"
        ).toString("ascii"),
        secret: process.env.ACCESS_TOKEN_SECRET,
    },

    redis: {
        hostUrl: process.env.REDIS_HOST_URL,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        dbname: process.env.REDIS_DATABASE_NAME,
      },
});