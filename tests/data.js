const JSONStream = require('JSONStream');
const fs = require('fs');
const jsonfile = require('jsonfile');


function loadLoans(cb) {
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

loadLoans(data => jsonfile.writeFileSync('data/authors.json', data));

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