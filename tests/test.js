const natural = require('natural');

const size = 100000;
let index = 0;
var corpus = [];

while (index++ < size) {
  const s = Math.random().toString(36).substring(20);
  if (s.substring(0, 1) === 'i') {
    corpus.push(s);
  }
}
corpus.push('jan guillou');


/*console.log('corpus done', corpus.length);

var spellcheck = new natural.Spellcheck(corpus);

console.log('spellchekc done');

console.log(spellcheck.isCorrect(corpus[1000])); // ['something', 'soothing']
console.log(spellcheck.isCorrect('janguillo')); // ['something', 'soothing']

console.log(spellcheck.getCorrections('jan guillio', 1)); // ['something']
console.log(spellcheck.getCorrections('jan guillo', 2)); // ['something']
*/
console.log('levenstein', natural.JaroWinklerDistance('jan guillou', 'jan gllo'));

const results = corpus.filter(s => natural.JaroWinklerDistance(s, 'jan guillo') > 0.9);

console.log(corpus.length, results.length);