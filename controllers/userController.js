const db = require('../database');
const passwordHash = require('../passwordHash');

// GENERIC TABLE MANIPULATION FUNCTIONS

// INSERTS OBJECT DATA INTO SPECIFIED TABLE
const insertData = async (data, table) => {
  try {
    // hash password if present
    if (data.password) data.password = await passwordHash(data.password);
    const pairs = Object.entries(data);
    const keys = pairs.map((el) => `${el[0]}`).join(', ');
    const vars = pairs.map((el, i) => `$${i + 1}`).join(', ');
    const values = pairs.map((el) => `${el[1]}`);
    const queryString = `INSERT INTO ${table}(${keys}) VALUES(${vars})`;
    await db.none(queryString, values);
  } catch (error) {
    console.error('ERROR:', error); // print error;
  }
};

const deleteAllData = async (table) => {
  await db.none(`TRUNCATE TABLE ${table}`);
  await db.none(`ALTER SEQUENCE ${table}_id_seq RESTART WITH 1`);
};

const getAllData = async (table) => await db.any(`SELECT * FROM ${table}`);

const selectEntry = async (action, table, column, value) =>
  await db.oneOrNone(
    `${action.toUpperCase()} ${
      action === 'delete' ? '' : '*'
    } FROM ${table} WHERE ${column} = $1`,
    [value]
  );

const updateEntry = async (table, data, column, value) => {
  try {
    const pairs = Object.entries(data);
    const setString = pairs.map((el) => `${el[0]}='${el[1]}'`).join(', ');
    const queryString = `UPDATE ${table} SET ${setString} WHERE ${column}= ${value};`;
    await db.none(queryString);
  } catch (error) {
    console.log(error);
  }
};

/////////////////////////////////////////////////////////////////

exports.createUser = async (req, res) => {
  const data = await insertData(req.body, 'users');
  console.log(data);
  res.status(200).json({ status: 'success', data: req.body });
};

exports.getDataUsers = async (req, res) => {
  try {
    const data = await getAllData('users');
    res.status(200).json({ status: 'success', data });
  } catch (error) {
    console.error('ERROR:', error);
  }
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await selectEntry('select', 'users', 'id', userId);
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('ERROR:', error);
  }
};

exports.deleteAllUsers = async (req, res) => {
  try {
    deleteAllData('users');
    res.status(204).json({ status: 'success' });
  } catch (error) {
    console.log('ERROR:', error);
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await selectEntry('delete', 'users', 'id', userId);
    res.status(204).json({ status: 'success' });
  } catch (error) {
    console.log('ERROR:', error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await updateEntry('users', req.body, 'id', userId);
    // await db.none('UPDATE users SET active = $1 WHERE id = $2', [true, 123]);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.log('ERROR:', error);
  }
};
