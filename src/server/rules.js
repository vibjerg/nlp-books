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

function spellAuthor(match, context) {
  const suggestions = spell(match, 'author', 0.9);
  const author = suggestions[0] || match;
  console.log(author);
  context.author = author;
  return author;
}

function howToSpellAuthor(msg, match, context) {
  return spellAuthor(match, context);
}
function getMostPopularByAuthor(msg, match, context) {
  const author = spellAuthor(match, context);
  const material = bestBy(author);

  if (material) {
    return `<b>${material.title}</b> af <i>${author}</i> er populær`;
  }
  else {
    return `Der er ikke nogen der gider læse ${author}`;
  }

}

async function getAuthor(msg, match, context) {
  console.log(match, 'getAuthor');
  const author = spellAuthor(match, context);
  console.log(author, 'getAuthor');
  const titles = await getTitlesForAuthor(author);
  return `${author} har f.eks. skrevet:<br />${titles.join('<br/>')}`;
}


async function getNewestTitleForAuthor(msg, match, context) {
  const author = spellAuthor(match, context);
  const titles = await getTitlesForAuthor(author);
  return `${author}s nyeste bog hedder <b>${titles[0]}</b>`;
}

function getAuthorForTitle(msg, match, context) {
  const {author, title} = authorForTitle(match);
  context.author = author;
  return `${author} har skrevet ${title}`;
}

function noMatch(msg) {
  return `Beklager. Hvad mener du med <b>${msg}</b>?`;
}

async function recommendBook(msg, match, context) {
  const recommend = await openPlatform.popRecommend();
  const item = recommend.data[_.random(recommend.data.length -1)];
  context.author = item.creator;
  return `<b>${item.title}</b> af <i>${item.creator}</i> er en god bog`
}

function applyContext (match, context) {
  if (context.author && match.match(/^(han|hun|hende)$/)) {
    return context.author;
  }
  return match;
}

export default function callRules(msg, context) {
  for (const rule of rules) {
    for (const regex of rule.regex) {
      const matches = msg.toLowerCase().match(regex);
      if (matches) {
        console.log(rule);
        const match = applyContext(matches[rule.match || 1], context);
        console.log(match);
        return rule.action(msg, match, context);
      }
    }
  }
}

const rules = [
  {
    regex: [/.*har (han|hun) (ellers|mere|også).*/],
    action: getAuthor,
    description: 'Mest udlånte bog af forfatter',
  },
  {
    regex: [/.*den bedste .* af (.*)/, /hvad er (.*)s bedste.*/, /(.*)s bedste.*/],
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
    action: howToSpellAuthor,
    description: 'Stavehjælp',
  },
  {
    regex: [/.*(god bog).*/],
    action: recommendBook,
    description: 'Anbefaling',
  },
  {
    regex: [/jeg hedder (.*)/],
    action: (msg, matches) => `Hej ${matches[1]}. Hvad kan jeg hjælpe med?`,
    description: 'Være hjælpsom',
  },
  {
    regex: [/.*vad (hedder) du.*/],
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
    action: howToSpellAuthor,
    description: 'Og altmulig andet'
  }
];
