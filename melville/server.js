const path = require('path');

const {
  readBook,
  getChapter,
  findChapters,
  parseBookData,
  writeBookData
} = require('./collector');


// program
const mobyDickPath = path.resolve(__dirname, 'data/herman-melville-moby-dick.epub');
const mobyDickPathOutput = path.resolve(__dirname, '../dist/assets/moby-dick.json');

readBook(mobyDickPath)
  .then(findChapters(5, -2))
  .then(parseBookData)
  // .then(writeBookData(mobyDickPathOutput))
  .then(bookData => {
    console.log(bookData.map(b => b.title));
  })
