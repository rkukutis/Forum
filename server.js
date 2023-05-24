// Import config.env into environment variables
const dotenv = require('dotenv');
const pgp = require('pg-promise')();

dotenv.config({ path: './config.env' });

const app = require('./app');

// Start server
const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}`);
});
const connection = {
  user: 'postgres',
  password: 'julijana',
  host: '127.0.0.1',
  database: 'hoopoe_forum',
  port: 5432,
};
const db = pgp(connection);

const insertData = async (data, table) => {
  const pairs = Object.entries(data);
  const keys = pairs.map((el) => `${el[0]}`).join(', ');
  const vars = pairs.map((el, i) => `$${i + 1}`).join(', ');
  const values = pairs.map((el) => `${el[1]}`);
  try {
    await db.none(`INSERT INTO ${table}(${keys}) VALUES(${vars})`, values);
  } catch (error) {
    console.log('ERROR:', error); // print error;
  }
};
const user = { name: 'Josh', email: 'josh@mail.com', password: 'hunterz' };

insertData(user, 'users');
