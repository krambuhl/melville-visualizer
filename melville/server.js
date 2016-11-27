require('babel-register');

const path = require('path');
const { createServer } = require('http');

const { getBookData } = require('./lib/collectBookData');
const { buildBookTree } = require('./lib/buildBookTree');
const {
  createBookFrames,
  filterFrameKeys,
  uniqueFramesByKey
} = require('./lib/frameBookData');
const { createFrameServer } = require('./lib/serveFrameData');
const { writeFrameData } = require('./lib/writeFrameData');

// program
const mobyDickPath = path.resolve(__dirname, 'data/herman-melville-moby-dick.epub');
const mobyDickPathOutput = path.resolve(__dirname, '../dist/data/moby-dick.json');

// const server = createServer().listen(3000);
Promise.resolve(mobyDickPath)
  .then(getBookData(5, -2))
  .then(buildBookTree)
  .then(createBookFrames)
  .then(filterFrameKeys(['chapterTitle', 'paragraph', 'sentence', 'word'])) // 'chapter', 'paragraph', , , 'letter'
  .then(uniqueFramesByKey('sentence'))
  .then(writeFrameData(mobyDickPathOutput, 'sentence'))
  // .then(createFrameServer(server))
  .catch(err => console.log(err));
