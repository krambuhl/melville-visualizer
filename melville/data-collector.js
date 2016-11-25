const path = require('path');
const fs = require('fs');
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
      resolve({ chapter, text });
    });
  });
};

const findChapters = (start = 0, end) => book => {
  const getFlowChapter = getChapter(book);
  return Promise.all(book.flow.slice(start, end).map(getFlowChapter));
};

const parseChaptersData = data => {
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

const mobyDickPath = path.resolve(__dirname, 'data/herman-melville-moby-dick.epub');

readBook(mobyDickPath)
  .then(findChapters(5, -2))
  .then(parseChaptersData)
  .then(chapters => {
    fs.writeFile(__dirname + '/data/dist/chapters.json', JSON.stringify(chapters, null, 2), (err) => {
      if (err) throw new Error(err);
    })
  })
