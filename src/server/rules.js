import _ from 'lodash';

import {spell, authorForTitle} from './spell';
import bestBy from './best';
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

function getMostPopularByAuthor(msg, matches) {
  const author = spellAuthor(msg, matches);
  const material = bestBy(author);

  if (material) {
    return `<b>${material.title}</b> af <i>${author}</i> er populær`;
  }
  else {
    return `Der er ikke nogen der gider læse ${author}`;
  }

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
  const titles = await getTitlesForAuthor(author);
  return `${author} har f.eks. skrevet:<br />${titles.join('<br/>')}`;
}

function spellAuthor(msg, matches) {
  const suggestions = spell(matches[1], 'author', 0.9);
  const author = suggestions[0] || matches[1];
  return author;
}

async function getNewestTitleForAuthor(msg, matches) {
  const suggestions = spell(matches[1]);
  const author = suggestions[0] || matches[1];
  const titles = await getTitlesForAuthor(author);
  return `${author}s nyeste bog hedder <b>${titles[0]}</b>`;
}

function getAuthorForTitle(msg, matches) {
  const {author, title} = authorForTitle(matches[1]);
  return `${author} har skrevet ${title}`;
}

function noMatch(msg) {
  return `Beklager. Hvad mener du med <b>${msg}</b>?`;
}

async function recommendBook() {
  const recommend = await openPlatform.popRecommend();
  console.log(recommend);
  const item = recommend.data[_.random(recommend.data.length -1)];

  return `<b>${item.title}</b> af <i>${item.creator}</i> er en god bog`
}


export default function callRules(msg) {
  for (const rule of rules) {
    for (const regex of rule.regex) {
      const matches = msg.toLowerCase().match(regex);
      if (matches) {
        console.log(rule);
        return rule.action(msg, matches);
      }
    }
  }
}

const rules = [
  {
    regex: [/.*den bedste .* af (.*)/],
    action: getMostPopularByAuthor,
    description: 'Mest udlånte bog af forfatter',
  },
  {
    regex: [/.* den nyeste .*af (.*)/, /.* hedder (.*)s nyeste */, /.* er (.*)s nyeste/, /.* hedder (.*)s seneste/],
    action: getNewestTitleForAuthor,
    description: 'Nyeste bog af forfatter',
  },
  {
    regex: [/.* af (.*)/, /.* har (.*) lavet/, /.* har (.*) skrevet/],
    action: getAuthor,
    description: 'Skrevet af en given forfatter',
  },
  {
    regex: [/.* har skrevet (.*)/, /.* hvem er (.*) lavet af/, /.* er (.*) skrevet/],
    action: getAuthorForTitle,
    description: 'Forfatteren til en bog',
  },
  {
    regex: [/stav til (.*)/, /stav (.*)/],
    action: spellAuthor,
    description: 'Stavehjælp',
  },
  {
    regex: [/.*god bog.*/],
    action: recommendBook,
    description: 'Anbefaling',
  },
  {
    regex: [/jeg hedder (.*)/],
    action: (msg, matches) => `Hej ${matches[1]}. Hvad kan jeg hjælpe med?`,
    description: 'Være hjælpsom',
  },
  {
    regex: [/.*vad hedder du.*/],
    action: (msg, matches) => `Jeg hedder Bibbi. Hvad hedder du?`,
    description: 'Høflig',
  },
  {
    regex: [/.*vad kan du.*/],
    action: (msg, matches) => `Jeg kan fortælle om<br /> ${rules.map(r => r.description).join('<br />')}`,
    description: 'Selvbevist',
  },
  {
    regex: [/(.*)/],
    action: spellAuthor,
    description: 'Og altmulig andet'
  }
];