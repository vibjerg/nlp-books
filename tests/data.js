const JSONStream = require('JSONStream');
const fs = require('fs');
const jsonfile = require('jsonfile');

function loadAuthors(cb) {
  const loans = {};
  var count = 0;
  var stream = fs.createReadStream('./data/materialedata.json', {encoding: 'utf8'});
  const parser = JSONStream.parse();

  stream.pipe(parser);

  parser.on('data', function (obj, index) {
    if (obj.type === 'book') {
      const creator = obj.creator && obj.creator.replace(/(\d|-|\(.*\))/g, '').trim() || null;
      if (creator) {
        //console.log(creator);
        loans[creator] = true;
        if (++count % 100000 === 0) {
          console.log(count, Object.keys(loans).length);
        }
      }
    }
  });

  parser.on('end', () => {
    cb(Object.keys(loans).sort());
  });
}

function loadLoans(cb) {
  const loans = {};
  var count = 0;
  var stream = fs.createReadStream('./data/udlaan.json', {encoding: 'utf8'});
  const parser = JSONStream.parse();

  stream.pipe(parser);

  parser.on('data', function (obj) {
    const id = obj.materiale_id;
    loans[id] = loans[id] && loans[id] + 1 || 1;

    if (++count % 100000 === 0) {
      console.log(count, Object.keys(loans).length);
    }
  });

  parser.on('end', () => {
    cb(loans);
  });
}

function loadAuthorships(cb) {
  const authors = jsonfile.readFileSync('./data/authors.json');
  const materials = jsonfile.readFileSync('./data/loans.json');
  const materialIds = Object.keys(materials);

  const loans = {};
  var count = 0;
  var stream = fs.createReadStream('./data/udlaan.json', {encoding: 'utf8'});
  const parser = JSONStream.parse();

  stream.pipe(parser);

  parser.on('data', function (obj) {
    const id = obj.materiale_id;
    loans[id] = loans[id] && loans[id] + 1 || 1;

    if (++count % 100000 === 0) {
      console.log(count, Object.keys(loans).length);
    }
  });

  parser.on('end', () => {
    cb(loans);
  });
}



loadLoans(data => jsonfile.writeFileSync('data/loans.json', data));
//loadAuthors(data => jsonfile.writeFileSync('data/authors.json', data));

function writeToFile(filename, data) {
  const file = fs.createWriteStream(filename);
  file.on('error', function (err) {
    console.error(err)
  });
  data.forEach(element => {
    file.write(element + '\n');
  });
  file.end();
}