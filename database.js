const pgp = require('pg-promise')();

const connection = {
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  host: process.env.HOST_DB,
  database: process.env.DATABASE_DB,
  port: process.env.PORT_DB,
};
module.exports = pgp(connection);
