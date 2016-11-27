import createSocketServer from 'socket.io';

export const createFrameServer = server => frames => {
  const socket = createSocketServer(server);

  socket.on('connection', function(connection){
    console.log('connect');
    let index = 0;

    const timer = setInterval(() => {
      socket.emit('frame', frames[index++ % frames.length])
    }, 30);

    connection.on('disconnect', () => {
      console.log('disconnect');
      clearInterval(timer);
    });
  });
}
