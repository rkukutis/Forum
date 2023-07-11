const dotenv = require('dotenv');

const pgp = require('pg-promise')();

dotenv.config({ path: './config.env' });

// Connection settings for local database
// const connection = {
//   user: `${process.env.USER_DB}`,
//   password: `${process.env.PASSWORD_DB}`,
//   host: `${process.env.HOST_DB}`,
//   database: `${process.env.DATABASE_DB}`,
//   port: `${process.env.PORT_DB}`,
// };

// Connection settings for supabase database
const connection = {
  user: process.env.SUPABASE_DB_USER,
  password: process.env.SUPABASE_DB_PSWD,
  host: process.env.SUPABASE_DB_HOST,
  database: process.env.SUPABASE_DB,
  port: process.env.SUPABASE_DB_PORT,
};

// Connect to postgresql DB on supabase
const db = pgp(connection);

module.exports = db;
