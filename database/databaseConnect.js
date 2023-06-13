const dotenv = require('dotenv');

const pgp = require('pg-promise')();

dotenv.config({ path: './config.env' });
const connection = {
  user: `${process.env.USER_DB}`,
  password: `${process.env.PASSWORD_DB}`,
  host: `${process.env.HOST_DB}`,
  database: `${process.env.DATABASE_DB}`,
  port: `${process.env.PORT_DB}`,
};

const db = pgp(connection);

module.exports = db;
