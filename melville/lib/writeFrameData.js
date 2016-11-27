import fs from 'fs';
import each from 'async/eachOfSeries';

export const writeFrameData = output => frames => {
  return new Promise((resolve, reject) => {
    const outputStream = fs.createWriteStream(output);

    outputStream.on('open', () => {
      outputStream.write('[');

      each(frames, (frame, i, done) => {
        console.log(`frame ${i}/${frames.length}` );

        if (i > 0) outputStream.write(', ')

        outputStream.write(JSON.stringify(frame, null, 2), 'utf8', done);
      }, () => {
        outputStream.write(']');
        resolve(frames);
      });
    });
  })
}
