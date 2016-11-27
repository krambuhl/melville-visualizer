export const createBookFrames = ({ chapters }) => {
  let frames = [];

  chapters.forEach(chapter => {
    chapter.paragraphs.forEach(paragraph => {
      paragraph.sentences.forEach(sentence => {
        sentence.words.forEach(word => {
          word.letters.forEach(letter => {
            frames.push({
              chapterTitle: chapter.title,
              chapter: chapter.text,
              paragraph: paragraph.text,
              sentence: sentence.text,
              word: word.text,
              letter: letter.text
            })
          })
        })
      })
    })
  })

  return Promise.resolve(frames);
}


export const filterFrameKeys = keys => frames => {
  return Promise.resolve(frames.map(frame => {
    return keys.reduce((newFrame, key) => {
      newFrame[key] = frame[key];
      return newFrame;
    }, {});
  }));
}


export const uniqueFramesByKey = key => frames => {
  let last;

  return Promise.resolve(frames.reduce((newFrames, frame) => {
    if (last !== frame[key]) {
      last = frame[key];
      newFrames.push(frame);
    }

    return newFrames;
  }, []))
}
