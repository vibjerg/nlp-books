const natural = require('natural');
var jsonfile = require('jsonfile')

corpus = jsonfile.readFileSync('./data/authors.json');

console.log('ready...');
function spellchecklist(input, treshhold = 0.90) {
  const startLetter = input.substr(0, 1);
  return corpus.filter(s => {
    if (s.substr(0, 1).toLowerCase() === startLetter) {
      return natural.JaroWinklerDistance(s.replace(' ', '').toLowerCase(), input.replace(' ', '')) > treshhold
    }
    return false;
  }).sort((a, b) => {
    return natural.JaroWinklerDistance(a.toLowerCase(), input.toLowerCase()) < natural.JaroWinklerDistance(b.toLocaleLowerCase(), input.toLowerCase());
  });
}
console.log(spellchecklist('poul auster', 0.90));
console.log(natural.JaroWinklerDistance('paulauster', 'paulauster'));