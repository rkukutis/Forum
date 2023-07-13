const omit = require('lodash.omit');
const db = require('./databaseConnect');
const passwordHash = require('../utils/passwordHash');
const AppError = require('../utils/appError');

// GENERIC TABLE MANIPULATION FUNCTIONS

exports.insertData = async (data, table) => {
  try {
    // hash password if present
    if (data.password)
      data.password = await passwordHash.hashPassword(data.password);
    const pairs = Object.entries(data);
    const keys = pairs.map((el) => `${el[0]}`).join(', ');
    const vars = pairs.map((el, i) => `$${i + 1}`).join(', ');
    const values = pairs.map((el) => `${el[1]}`);
    const queryString = `INSERT INTO ${table}(${keys}) VALUES(${vars}) RETURNING *`;
    return await db.any(queryString, values);
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

function buildFeatureString(query) {
  const features = [];
  // If there is a sort parameter, add ORDER By string
  if ('sort' in query) {
    const sortDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
    features.push(
      `ORDER BY ${query.sort.slice(
        sortDirection === 'DESC' ? 1 : 0
      )} ${sortDirection}`
    );
  }
  // If there is a limit and page parameter, return paginated results
  if ('limit' in query) features.push(`LIMIT ${query.limit}`);
  if ('page' in query)
    features.push(`OFFSET ${(query.page - 1) * query.limit}`);
  // Combine all feature substrings
  return features.join(' ');
}

exports.getAllData = async (table, query) => {
  try {
    const featureString = buildFeatureString(query);

    // Return all user details (only for admin use)
    const data = db.any(`SELECT * FROM ${table} ${featureString}`);
    if (table === 'users') return await data;

    // If the requested rows are for comments, posts or announcements
    const promiseArray = await data.then(
      // each post comment, post or announcement has an author
      async (rows) =>
        rows.map(async (row) => {
          // remove password from user info
          const user = omit(
            await db.one(`SELECT * FROM users WHERE id = $1`, [row.user_id]),
            ['password']
          );

          // const commentsArray =
          //   table !== 'comments' &&
          //   (await db.any(`SELECT * FROM comments WHERE post_id = $1`, [
          //     row.id,
          //   ]));

          // const populatedComments = await Promise.all(
          //   commentsArray.map(async (comment) => {
          //     const commentAuthor = await db.one(
          //       `SELECT * FROM users WHERE id = $1`,
          //       [comment.user_id]
          //     );
          //     return Object.assign(comment, { author: commentAuthor.username });
          //   })
          // );

          // return Object.assign(row, { user }, { comments: populatedComments });
          // ^^^ Dont display comments for post previews
          return Object.assign(row, { user });
        })
    );

    return await Promise.all(promiseArray);
  } catch (error) {
    throw new AppError(error, 500);
  }
};

// Returns post data with author info
exports.selectPost = async (action, table, column, value) => {
  try {
    // Initial query (query 1)
    console.log(action, table, column, value);
    const post = await db.oneOrNone(
      `${action.toUpperCase()} ${
        action === 'delete' ? '' : '*'
      } FROM ${table} WHERE ${column} = $1`,
      [value]
    );

    // Throw error if post not found
    if (!post) throw new AppError('Post not found', 404);

    // get post author details and remove password (query 2)
    const postAuthor = omit(
      await db.one(`SELECT * FROM users WHERE id = $1`, [post.user_id]),
      ['password', 'password_changed']
    );

    // TODO:  Comments should be fetched seperately

    // combine and return post, author and comments
    return Object.assign(
      post,
      { author: postAuthor }
      // { comments: populatedComments }
    );
  } catch (error) {
    throw new AppError(error, 500);
  }
};

exports.selectComments = async (postId, query) => {
  const featuresString = buildFeatureString(query);
  // get post comments
  const comments = await db.any(
    `SELECT * FROM comments WHERE post_id = $1 ${featuresString}`,
    postId
  );
  // get comment author details
  const populatedComments = await Promise.all(
    comments.map(async (comment) => {
      const commentAuthor = await db.one(
        `SELECT id, username, image, status, role, created_at FROM users WHERE id = $1`,
        [comment.user_id]
      );
      return Object.assign(comment, { author: commentAuthor });
    })
  );

  return populatedComments;
};

exports.selectUser = async (action, table, column, value) => {
  try {
    // Initial query (query 1)
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

exports.selectUser = async (action, table, column, value) => {
  try {
    // Initial query (query 1)
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
  await db.none('DROP SCHEMA IF EXISTS public CASCADE;');
  await db.none('CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION postgres');
};
