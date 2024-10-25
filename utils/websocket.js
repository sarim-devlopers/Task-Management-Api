module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      socket.on('joinTeam', (teamId) => {
        socket.join(teamId);
        console.log(`User ${socket.id} joined team room ${teamId}`);
      });
  
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };
  