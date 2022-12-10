export default () => ({
    PORT: process.env.PORT ?? 4000,
    DB_HOST: process.env.USER_DB_HOST,
    DB_PORT: process.env.USER_DB_PORT,
    DB_USERNAME: process.env.USER_DB_USERNAME,
    DB_PASSWORD: process.env.USER_DB_PASSWORD,
    DB_DATABASE: process.env.USER_DB_DATABASENAME,
});