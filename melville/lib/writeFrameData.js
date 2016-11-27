import fs from 'fs';
import each from 'async/eachOfSeries';

export const writeFrameData = (output, type) => frames => {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(output);

    outputStream.on('open', () => {
      outputStream.write('[');

      each(frames, (frame, i, done) => {
        if (i > 0) outputStream.write(', ')
        outputStream.write(JSON.stringify(frame, null, 2), 'utf8', done);
        console.log(`${type} frame ${i}/${frames.length - 1}` );
      }, () => {
        outputStream.write(']');
        resolve(frames);
      });
    });
  })
}
