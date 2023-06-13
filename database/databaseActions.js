const db = require('./databaseConnect');
const passwordHash = require('../utils/passwordHash');
const AppError = require('../utils/appError');

// GENERIC TABLE MANIPULATION FUNCTIONS

exports.insertData = async (data, table) => {
  try {
    console.log(data, table);
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
    throw new AppError(error, 500);
  }
};

exports.deleteAllData = async (table) => {
  try {
    await db.none(`TRUNCATE TABLE ${table} CASCADE`);
    await db.none(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`);
  } catch (error) {
    throw new AppError(error, 500);
  }
};

exports.getAllData = async (table, query) => {
  try {
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
    return await db.any(`SELECT * FROM ${table} ${featuresString}`);
  } catch (error) {
    throw new AppError(error, 500);
  }
};

exports.selectEntry = async (action, table, column, value) => {
  try {
    return await db.oneOrNone(
      `${action.toUpperCase()} ${
        action === 'delete' ? '' : '*'
      } FROM ${table} WHERE ${column} = $1`,
      [value]
    );
  } catch (error) {
    throw new AppError(error, 500);
  }
};

exports.updateEntry = async (table, data, column, value) => {
  try {
    if (data.password)
      data.password = await passwordHash.hashPassword(data.password);
    const pairs = Object.entries(data);
    const setString = pairs.map((el) => `${el[0]}='${el[1]}'`).join(', ');
    const queryString = `UPDATE ${table} SET ${setString} WHERE ${column}= ${value} RETURNING *;`;
    return await db.any(queryString);
  } catch (error) {
    throw new AppError(error, 500);
  }
};

exports.resetSchema = async () => {
  db.none('DROP SCHEMA IF EXISTS public CASCADE;');
  db.none('CREATE SCHEMA public');
};
