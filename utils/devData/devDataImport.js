const fs = require('fs');
const { insertData, resetSchema } = require('../../database/databaseActions');

const readFiles = (data) => {
  const dataObject = {};
  data.forEach((el) => {
    const dataRaw = fs.readFileSync(`${__dirname}/${el}.json`, 'utf8');
    dataObject[el] = JSON.parse(dataRaw);
  });
  return dataObject;
};

const importUsers = (data) => {
  // receives array of table names
  data.forEach((table) =>
    readFiles(data)[table].forEach(async (el) => insertData(el, `${table}`))
  );
};

// // importUsers(['users']);
// // importUsers(['posts']);
// // importUsers(['comments']);
// importUsers(['announcements']);

// resetSchema();

//
// RUN THIS SCRIPT BY TYPING "node utils\devData\devDataImport.js"
