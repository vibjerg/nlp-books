import spell from './spell';
import openPlatform from './openplatform.client';
import openSearch from './opensearch.client';

/*openPlatform.search({q: 'fo="Paul Auster"', sort: 'dateFirstEdition_descending'}).then(result => {
 result.data.forEach(collection => console.log(collection.dcTitle[0]))
 });
 */

async function getTitlesForAuthor(author) {
  const result = await openSearch().getSearchResult({
    query: `fo="${author}" and term.type="bog" and term.language="dan"`,
    sort: 'dateFirstEdition_descending'
  })
  return result.result.searchResult && result.result.searchResult.map(result => {
    const object = Array.isArray(result.collection.object) && result.collection.object[0] || result.collection.object;
    return object.record.title[0];
  }) || [];
}



function match(msg) {
  const regex = /.* af (.*)/;
  const matches = msg.match(regex);
  if (matches) {
    return matches[1];
  }

  return false;

}

async function getAuthor(msg, matches) {
  const suggestions = spell(matches[1]);
  const author = suggestions[0] || matches[1];
  const titles = await getTitlesForAuthor(matches[1]);
  return `${author} har f.eks. skrevet:<br />${titles.join('<br/>')}`;
}

async function getNewestTitleForAuthor(msg, matches) {
  const suggestions = spell(matches[1]);
  const author = suggestions[0] || matches[1];
  const titles = await getTitlesForAuthor(matches[1]);
  return `${author}s nyeste bog hedder <b>${titles[0]}</b>`;
}

function getAuthorForTitle(msg, matches) {

  return `Bummelum har skrevet ${matches[1]}`;
}

function noMatch(msg) {
  return `Beklager. Hvad mener du med <b>${msg}</b>?`;
}


export default function callRules(msg) {
  for (const rule of rules) {
    console.log(rule);
    for (const regex of rule.regex) {
      const matches = msg.match(regex);
      if (matches) {
        return rule.action(msg, matches);
      }
    }
  }
}

const rules = [
  {
    regex: [/.* af (.*)/, /.* har (.*) lavet/, /.* har (.*) skrevet/],
    action: getAuthor,
    description: 'Noget af en given forfatter',
  },
  {
    regex: [/.* har skrevet (.*)/, /.* hvem er (.*) lavet af/, /.* er (.*) skrevet/],
    action: getAuthorForTitle,
    description: 'Forfatteren til en bog',
  },
  {
    regex: [/.* den nyeste .* af (.*)/, /.* hedder (.*)s nyeste */, /.* er (.*)s nyeste/, /.* hedder (.*)s seneste/],
    action: getNewestTitleForAuthor,
    description: 'Nyeste bog af forfatter',
  },
  {
    regex: [/.*/],
    action: noMatch,
    description: 'Ingen match',
  }
];