export const replaceLineBreaks = text => text.replace(/[\r\n]/g, ' ');


export const buildLetters = word => (
  word
    .split('')
    .map(letter => ({
      text: letter
    }))
)

export const buildWords = sentence => (
  sentence
    .split(/[\W_]+/g)
    .map(word => ({
      text: word,
      letters: buildLetters(word)
    }))
)

export const buildSentence = paragraph => {
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


export const buildParagraphs = paragraphs => (
  paragraphs
    .map(paragraph => ({
      fulltext: paragraph,
      text: replaceLineBreaks(paragraph),
      sentences: buildSentence(paragraph)
    }))
)

export const buildBookTree = book => {
  let { metadata, chapters } = book

  chapters = chapters.map(chapter => Object.assign({}, chapter, {
    paragraphs: buildParagraphs(chapter.paragraphs)
  }));

  chapters.forEach((chapter, i) => {
    chapters[i].fulltext = chapter.paragraphs.map(paragraph => paragraph.fulltext).join(' ');
    chapters[i].text = chapter.paragraphs.map(paragraph => paragraph.text).join(' ');
  });

  return Promise.resolve({
    metadata,
    chapters
  });
}

export default buildBookTree;
