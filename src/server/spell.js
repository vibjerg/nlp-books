const natural = require('natural');
var jsonfile = require('jsonfile')

const corpus = jsonfile.readFileSync('./data/authors.json');

console.log('ready...');
export default function spellchecklist(input, treshhold = 0.90) {
  console.log(input);
  const startLetter = input.substr(0, 1).toLowerCase();
  return corpus.filter(s => {
    if (s.substr(0, 1).toLowerCase() === startLetter) {
      return natural.JaroWinklerDistance(s.replace(' ', '').toLowerCase(), input.replace(' ', '')) > treshhold
    }
    return false;
  }).sort((a, b) => {
    return natural.JaroWinklerDistance(a.replace(' ', '').toLowerCase(), input.replace(' ', '').toLowerCase()) < natural.JaroWinklerDistance(b.replace(' ', '').toLocaleLowerCase(), input.replace(' ', '').toLowerCase());
  });
}
//console.log(spellchecklist('poul auster', 0.90));
//console.log(natural.JaroWinklerDistance('paulauster', 'paulauster'));