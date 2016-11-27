const path = require('path')

const { getBookData } = require('./lib/collector')

var server = require('http').createServer();
var io = require('socket.io')(server);

// program
const mobyDickPath = path.resolve(__dirname, 'data/herman-melville-moby-dick.epub')
const mobyDickPathOutput = path.resolve(__dirname, '../dist/assets/moby-dick.json')


const replaceLineBreaks = text => {
  return text.replace(/[\r\n]/g, ' ')
}


const buildBookTree = book => {
  let { metadata, chapters } = book

  const buildLetters = word => {
    return word
      .split('')
      .map(letter => ({
        text: letter
      }));
  }

  const buildWords = sentence => {
    return sentence
      .split(/[\W_]+/g)
      .map(word => ({
        text: word,
        letters: buildLetters(word)
      }));
  }

  const buildSentence = paragraph => {
    const sentences =
      replaceLineBreaks(paragraph)
        .match(/\(?[^\.\?\!]+[\.!\?]\)?/g)

    if (sentences === null) return [];

    return sentences
      .map(sentence => sentence.trim())
      .map(sentence => ({
        text: sentence,
        words: buildWords(sentence)
      }))
  }

  const buildParagraphs = paragraphs => {
    return paragraphs
      .map(paragraph => ({
        fulltext: paragraph,
        text: replaceLineBreaks(paragraph),
        sentences: buildSentence(paragraph)
      }))
  }

  chapters = chapters.map(chapter => {
    return Object.assign({}, chapter, {
      paragraphs: buildParagraphs(chapter.paragraphs)
    });
  });

  chapters.forEach((chapter, i) => {
    chapters[i].fulltext = chapter.paragraphs.map(paragraph => paragraph.fulltext).join(' ');
    chapters[i].text = chapter.paragraphs.map(paragraph => paragraph.text).join(' ');
  });

  return Promise.resolve({
    metadata,
    chapters
  });
}

const createBookFrames = ({ chapters }) => {
  let frames = [];

  chapters.forEach(chapter => {
    chapter.paragraphs.forEach(paragraph => {
      paragraph.sentences.forEach(sentence => {
        sentence.words.forEach(word => {
            frames.push({
              chapterTitle: chapter.title,
              // chapter: chapter.text,
              // paragraph: paragraph.text,
              // sentence: sentence.text,
              word: word.text,
              // letter: letter.text
            })
          word.letters.forEach(letter => {
            // push a frame
          })
        })
      })
    })
  })

  return Promise.resolve(frames);
}


Promise.resolve(mobyDickPath)
  .then(getBookData(5, -2))
  .then(buildBookTree)
  .then(createBookFrames)
  .then(frames => {

    // timer = setInterval(() => {
    //   if (openConnections > 0) {
    //     io.emit('frame', frames[index++ % frames.length])
    //   }
    // }, 20);

    // program
    io.on('connection', function(socket){
      console.log('connect');
      let index = 0;

      // while (index < frames.length) {
      //   console.log('frame' + index);
      //   io.emit('frame', frames[index++])
      // }
      const timer = setInterval(() => {
          io.emit('frame', frames[index])
          if (index++ >= frames.length) clearInterval(timer);
      }, 20);

      socket.on('disconnect', () => {
        console.log('disconnect');
        clearInterval(timer);
      });
    });
  })
  .catch(err => console.log(err));

server.listen(3000);

