export default () => ({
  database: {
    host: process.env.USER_DB_HOST,
    port: process.env.USER_DB_PORT,
    username: process.env.USER_DB_USERNAME,
    password: process.env.USER_DB_PASSWORD,
    dbname: process.env.USER_DB_DATABASENAME,
  },
});