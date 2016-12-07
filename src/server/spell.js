const natural = require('natural');
import data from './data';
console.log('ready...', data.authorList.length);
export function spell(input, type = 'author', treshhold = 0.90) {
  const startLetter = input.substr(0, 1).toLowerCase();
  const corpus = type === 'author' && data.authorList || data.titleList;
  return corpus.filter(s => {
    if (true || (s.substr(0, 1).toLowerCase() === startLetter)) {
      return natural.JaroWinklerDistance(s.replace(' ', '').toLowerCase(), input.replace(' ', '')) > treshhold
    }
    return false;
  }).sort((a, b) => {
    return natural.JaroWinklerDistance(a.replace(' ', '').toLowerCase(), input.replace(' ', '').toLowerCase()) < natural.JaroWinklerDistance(b.replace(' ', '').toLocaleLowerCase(), input.replace(' ', '').toLowerCase());
  });
}

export function authorForTitle(titleSug) {
  const title = spell(titleSug, 'title')[0];

  const id = data.titles[title];
  console.log(title, id);
  return {author: data.materials[id].creator, title};

}
//console.log(spellchecklist('poul auster', 0.90));
//console.log(natural.JaroWinklerDistance('paulauster', 'paulauster'));