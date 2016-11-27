const Epub = require('epub');
const cheerio = require('cheerio');

const readBook = filepath => {
  return new Promise((resolve, reject) => {
    const book = new Epub(filepath);
    book
    .on('error', err => reject(err))
    .on('end', () => resolve(book))
    .parse();
  });
};

const getChapter = book => chapter => {
  return new Promise((resolve, reject) => {
    book.getChapter(chapter.id, (err, text) => {
      if (err) return reject(err);
      resolve({ book, chapter, text });
    });
  });
};

const findChapters = (start = 0, end) => book => {
  const getFlowChapter = getChapter(book);
  return Promise.all(book.flow.slice(start, end).map(getFlowChapter));
};

const parseBookData = data => {
  const book = data[0].book;
  const chapters = data.map(d => d.chapter);

  return Promise.resolve({
    metadata: book.metadata,
    chapters:
      data
      .map(d => d.chapter)
      .map((chapter, i) => {
        const raw = data[i].text;
        const $ = cheerio.load(raw);

        return {
          title: chapter.title,
          fulltext: $('.text').text(),
          chapter: chapter,
          paragraphs: $('.text').find('p').map((i, el) => $(el).text()).get(),
          html: raw
        };
      })
  });
}

const getBookData = (start, end) => path => {
  return Promise.resolve(path)
    .then(readBook)
    .then(findChapters(start, end))
    .then(parseBookData)
}


module.exports = {
  readBook,
  getChapter,
  findChapters,
  parseBookData,
  getBookData
};
