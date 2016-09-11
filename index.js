var Accordion = require('./Accordion'),
  util = require('util'),
  _ = require('lodash'),
  csvWriter = require('csv-write-stream'),
  fs = require('fs');

var accordion = new Accordion();

function runStats(size, immediate, output) {
  var games = [], i, writer = csvWriter({sendHeaders: false}), groups;

  // run the requested number of games
  for (i = 0; i < size; i++) {
    games.push(accordion.runGame(immediate));
  }

  writer.pipe(fs.createWriteStream(output));

  // group the results into a histogram structure
  groups = _.map(_.groupBy(games), len => {
    return { num: len[0], frequency: len.length};
  });

  // push it all to a csv
  _.forEach(groups, group => writer.write(group));
  writer.end();
}

runStats(50000, true, "immediate.csv");
runStats(1000, false, "delayed.csv");