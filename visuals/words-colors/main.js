import styles from './styles.css';
import * as d3 from 'd3';

import socket from 'socket.io-client';

const io = socket('http://localhost:3000');

const chapterTitle = document.querySelector('.book-progress__chapter-title');
const letter = document.querySelector('.book-progress__letter');
const word = document.querySelector('.book-progress__word');

const letter2Color = fletter => {
  switch(fletter.toLowerCase()) {
    case 'a': return '#84DE02'
    case 'b': return '#00f';
    case 'c': return '#A67B5B';
    case 'd': return '#CD5B45';
    case 'e': return '#BF00FF';
    case 'f': return '#CE2029';
    case 'g': return '#DCDCDC';
    case 'h': return '#49796B';
    case 'i': return '#5A4FCF';
    case 'j': return '#00A86B';
    case 'k': return '#8EE53F';
    case 'l': return '#CF1020';
    case 'm': return '#C04000';
    case 'n': return '#FADA5E';
    case 'o': return '#353839';
    case 'p': return 'pink';
    case 'q': return '#A6A6A6';
    case 'r': return '#f00';
    case 's': return '#FA8072';
    case 't': return '#FC89AC';
    case 'u': return '#3CD070';
    case 'v': return '#F38FA9';
    case 'w': return '#FD5800';
    case 'x': return '#738678';
    case 'y': return 'yellow';
    case 'z': return '#39A78E';
  }
}

io.on('frame', frame => {
  chapterTitle.innerText = frame.chapterTitle;
  letter.innerText = frame.letter;
  word.innerText = frame.word;

  canvas.style.backgroundColor = letter2Color(frame.letter);
})
