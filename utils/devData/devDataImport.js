const fs = require('fs');
const slugify = require('slugify');
const { insertData, resetSchema } = require('../../database/databaseActions');
const db = require('../../database/databaseConnect');

const readFiles = (data) => {
  const dataObject = {};
  data.forEach((el) => {
    const dataRaw = fs.readFileSync(`${__dirname}/${el}.json`, 'utf8');
    dataObject[el] = JSON.parse(dataRaw);
  });
  return dataObject;
};

const importData = (data) => {
  // receives array of table names
  data.forEach((table) =>
    readFiles(data)[table].forEach(async (el) => {
      // const importData;
      let importedData = el;
      if (table === 'posts' || table === 'announcements')
        importedData = Object.assign(el, { slug: slugify(`${el.title}`) });
      await insertData(importedData, `${table}`);
      await db.none(
        `SELECT setval('${table}_id_seq', (SELECT MAX(id) FROM public.${table})+1);`
      );
    })
  );
};

// Updates the number of mock comments from the default zero

async function countComments() {
  // Get ids of all posts
  const posts = (await db.manyOrNone('SELECT id FROM posts')).map(
    (obj) => obj.id
  );
  // Count comments that reference specific post
  posts.forEach(async (id) => {
    const commentNumObj =
      await db.one(`SELECT COUNT(id) FROM comments WHERE post_id = ${id}; 
    `);
    // query returns object with count property
    await db.none(
      `UPDATE posts SET comment_number = ${commentNumObj.count} WHERE id = ${id}`
    );
  });
}

// importData(['users']);
// importData(['posts']);
// importData(['comments']);
// importData(['announcements']);
// resetSchema();
// countComments();

//
// RUN THIS SCRIPT BY TYPING "node utils\devData\devDataImport.js"
