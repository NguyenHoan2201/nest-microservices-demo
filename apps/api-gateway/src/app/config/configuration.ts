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
});