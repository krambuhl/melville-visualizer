const Epub = require('epub');
const cheerio = require('cheerio');
const fs = require('fs');

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
      resolve({ chapter, text });
    });
  });
};

const findChapters = (start = 0, end) => book => {
  const getFlowChapter = getChapter(book);
  return Promise.all(book.flow.slice(start, end).map(getFlowChapter));
};

const parseBookData = data => {
  const chapters = data.map(d => d.chapter);

  return Promise.all(
    data
      .map(d => d.chapter)
      .map((chapter, i) => {
        const raw = data[i].text;
        const html = cheerio.load(raw);

        return Promise.resolve({
          id: chapter.id,
          title: chapter.title,
          html: html.text(),
          raw: raw
        });
      })
  );
}

const writeBookData = output => bookData => {
  return new Promise((resolve, reject) => {
    fs.writeFile(output, JSON.stringify(bookData, null, 2), (err) => {
      if (err) return reject(err);
      resolve(bookData);
    });
  });
}

module.exports = {
  readBook,
  getChapter,
  findChapters,
  parseBookData,
  writeBookData
};
