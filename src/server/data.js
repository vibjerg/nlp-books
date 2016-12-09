var jsonfile = require('jsonfile');

const materials = jsonfile.readFileSync('./data/materials.json');

const authors = {};
const titleList = [];
const titles = {};
for (const id in materials){
  const material = materials[id];
  if (!titles[material.title]) {
    titles[material.title] = []
  }
  titles[material.title].push(material.creator);
  titleList.push(material.title);
  if (!authors[material.creator]) {
    authors[material.creator] = [];
  }
  authors[material.creator].push(material);
};

export default {materials, authors, titles, authorList: Object.keys(authors), titleList};