import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }
  console.log("Socket is initializing");
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", async (socket) => {
    console.log(socket.id, "socketID");

    const sentTest = async (msg) => {
      socket.emit("returnTest", msg + Math.random() * 100);
    };
    socket.on("sentTest", sentTest);
  });
  res.end();
};

export default SocketHandler;
