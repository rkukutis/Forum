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

// importData(['users']);
// importData(['posts']);
// importData(['comments']);
// importData(['announcements']);
// resetSchema();

//
// RUN THIS SCRIPT BY TYPING "node utils\devData\devDataImport.js"
