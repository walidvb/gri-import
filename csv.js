const csv = require('csv-parser')
const fs = require('fs')

module.exports = (processRow, onEnd) => {
  const rows = []
  fs.createReadStream('base.csv')
    .pipe(csv())
    .on('data', r => rows.push(r))
    .on('end', async () => {
      console.log('CSV file successfully parsed, now processing');
      for(let i = 0; i < rows.length; i++){
        await processRow(rows[i])
      }
      onEnd()
  });
}