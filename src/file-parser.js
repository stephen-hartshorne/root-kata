const readline = require('readline');
const fs = require('fs');

function parseFile(filename) {
  let lines = [];
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filename);
    fileStream.on('error', (error) => reject(error));

    const readInterface = readline.createInterface({
      input: fileStream
    });
    
    readInterface.on('line', line => lines.push(line));
    readInterface.on('close', () => resolve(lines));
  });
}

module.exports = { parseFile };