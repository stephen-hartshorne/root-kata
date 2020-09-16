const { parseFile } = require('../src/file-parser');
const { expect, assert } = require('chai');  
const path = require('path');

describe('File Parser', function () {
  it('Returns each line of the file in an array', async function () {
    const filename = path.resolve('./test/files/simple.txt');
    const lines = await parseFile(filename);
    expect(lines).to.deep.equal(['test1', 'test2', 'test3']);
  });

  it('Errors when a file does not exist', async function() {
    const filename = 'i-do-not-exist';
    try {
      await parseFile(filename);
      assert.fail('Should have thrown an error');
    } catch (error) {
      expect(error.code).to.equal('ENOENT');
    }
  });
});