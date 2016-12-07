var jsonfile = require('jsonfile');

const materials = jsonfile.readFileSync('./data/materials.json');

const authors = {};
const titleList = [];
const titles = {};
for (const id in materials){
  const material = materials[id];
  titles[material.title] = id;
  titleList.push(material.title);
  if (!authors[material.creator]) {
    authors[material.creator] = [];
  }
  authors[material.creator].push(material);
};

export default {materials, authors, titles, authorList: Object.keys(authors), titleList};