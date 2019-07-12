const csv = require('csv-parser')
const fs = require('fs')

module.exports = (processRow) => {
  fs.createReadStream('base.csv')
    .pipe(csv())
    .on('data', processRow)
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
  }