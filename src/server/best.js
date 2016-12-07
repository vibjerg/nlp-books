import data from './data';
console.log('ready...', data.authorList.length);
export default function bestBy(author) {
  return data.authors[author].sort((a,b) => a.loans > b.loans)[0];
}
//console.log(spellchecklist('poul auster', 0.90));
//console.log(natural.JaroWinklerDistance('paulauster', 'paulauster'));