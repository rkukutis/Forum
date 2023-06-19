const fs = require('fs');
const { insertData, resetSchema } = require('../../database/databaseActions');
const slugify = require('slugify');

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
