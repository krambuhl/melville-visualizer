import styles from './styles.css';
import * as d3 from 'd3';

import createSocketClient from 'socket.socket-client';
import emojiFromWord from 'emoji-from-word';
import emoji from 'node-emoji';

const socket = createSocketClient('http://localhost:3000');

const progress = document.querySelector('.book-progress');
const word = document.querySelector('.book-word__current');

let lastChapter = false;
let lastContainer;

socket.on('frame', frame => {
  if (lastChapter !== frame.chapterTitle) {
    lastChapter = frame.chapterTitle;

    const header = document.createElement('h1', { className: 'heading' });
    header.innerHTML = lastChapter;

    lastContainer = document.createElement('div', { className: 'container'});

    progress.appendChild(header);
    progress.appendChild(lastContainer);
  }

  const wordEmoji = emojiFromWord(frame.word);

  if (frame.word === 'a' || frame.word === 'it' || frame.word === 'us') return;

  if (wordEmoji.score >= 0.95) {
    const span = document.createElement('span');
    span.setAttribute('title', frame.word);
    span.setAttribute('score', wordEmoji.score);
    span.innerHTML = wordEmoji.emoji.char;
    lastContainer.appendChild(span);

    word.innerText = frame.word;

    window.scrollTo(0, document.body.scrollHeight);
  }
})
