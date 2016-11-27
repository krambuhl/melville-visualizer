import styles from './styles.css';
import * as d3 from 'd3';

import createSocketClient from 'socket.io-client';
import emojiFromWord from 'emoji-from-word';
import emoji from 'node-emoji';
import emojiJson from 'node-emoji/lib/emoji.json';
import match from 'minimatch';

const socket = createSocketClient('http://localhost:3000');
const progress = document.querySelector('.book-progress');

let lastChapter = false;
let lastContainer;

const createEmoji = ({ word, char }) => {
  const wordDiv = document.createElement('div');
  wordDiv.classList.add('emoji-tag');
  wordDiv.setAttribute('title', word);
  wordDiv.innerHTML = '<span>' + char + '</span><span>' + word + '</span>';
  return wordDiv;
}

socket.on('frame', frame => {
  if (lastChapter !== frame.chapterTitle) {
    lastChapter = frame.chapterTitle;

    const header = document.createElement('h1');
    header.innerHTML = lastChapter;

    lastContainer = document.createElement('div');

    progress.appendChild(header);
    progress.appendChild(lastContainer);
  }

  // if (match(frame.word, '**+(a|us|it)')) return;

  const word = frame.word;//.replace(/ing/g, '');
  const wordEmoji = emoji.get(word);

  if (wordEmoji !== `:${word}:`) {
    lastContainer.innerHTML += " ";
    lastContainer.appendChild(createEmoji({ word: frame.word, char: wordEmoji }));
  } else {
    const emojiAttempt = emojiFromWord(frame.word);
    if (emojiAttempt && emojiAttempt.emoji && emojiAttempt.score > 0) {
      lastContainer.innerHTML += " ";
      lastContainer.appendChild(createEmoji({ word: frame.word, char: emojiAttempt.emoji.char }));
    } else {
      lastContainer.innerHTML = `${lastContainer.innerHTML} ${frame.word}`;
    }
  }
})
