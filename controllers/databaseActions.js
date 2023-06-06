const db = require('../database');
const passwordHash = require('../passwordHash');
const AppError = require('../utils/appError');

module.exports = {
  // GENERIC TABLE MANIPULATION FUNCTIONS

  // INSERTS OBJECT DATA INTO SPECIFIED TABLE

  insertData: async (data, table) => {
    try {
      // hash password if present
      if (data.password)
        data.password = await passwordHash.hashPassword(data.password);
      const pairs = Object.entries(data);
      const keys = pairs.map((el) => `${el[0]}`).join(', ');
      const vars = pairs.map((el, i) => `$${i + 1}`).join(', ');
      const values = pairs.map((el) => `${el[1]}`);
      const queryString = `INSERT INTO ${table}(${keys}) VALUES(${vars})`;
      await db.none(queryString, values);
    } catch (error) {
      console.log(error);
      throw new AppError(`${error}`, 500);
    }
  },

  deleteAllData: async (table) => {
    await db.none(`TRUNCATE TABLE ${table}`);
    await db.none(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`);
  },

  getAllData: async (table, query) => {
    console.log(query);
    const features = [];
    if ('sort' in query) {
      const sortDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      features.push(
        `ORDER BY ${query.sort.slice(
          sortDirection === 'DESC' ? 1 : 0
        )} ${sortDirection}`
      );
    }
    if ('limit' in query) features.push(`LIMIT ${query.limit}`);
    if ('page' in query)
      features.push(`OFFSET ${(query.page - 1) * query.limit}`);
    const featuresString = features.join(' ');
    console.log(featuresString);
    return await db.any(`SELECT * FROM ${table} ${featuresString}`);
  },

  selectEntry: async (action, table, column, value) =>
    await db.oneOrNone(
      `${action.toUpperCase()} ${
        action === 'delete' ? '' : '*'
      } FROM ${table} WHERE ${column} = $1`,
      [value]
    ),

  updateEntry: async (table, data, column, value) => {
    try {
      if (data.password)
        data.password = await passwordHash.hashPassword(data.password);
      const pairs = Object.entries(data);
      const setString = pairs.map((el) => `${el[0]}='${el[1]}'`).join(', ');
      const queryString = `UPDATE ${table} SET ${setString} WHERE ${column}= ${value};`;
      await db.none(queryString);
    } catch (error) {
      throw new AppError('Cant update data', 500);
    }
  },
};
