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

const getBookData = (path, start, end) => {
  return readBook(path)
    .then(findChapters(start, end))
    .then(parseBookData)
}


getBookData(mobyDickPath, 5, -2)
  .then(bookData => {
    console.log(bookData.map(b => b.title));
  })
