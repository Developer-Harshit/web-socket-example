console.log("Starting server");
const PORT = 3000;

//-----------------------------------------------------------------//
// Imports
const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

//-----------------------------------------------------------------//
// Config
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(express.static("public"));

const msg = (str) => {
  console.log(`\n----------${str}----------`);
};
const display = (n, str) => {
  console.log(n, ":", str);
};

//-----------------------------------------------------------------//
// Routes
app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

//-----------------------------------------------------------------//
// IO

// hello
const hello = (username) => {
  console.log("hello " + username);
};

io.on("connection", (socket) => {
  msg("user connected");
  display("id", socket.id);

  socket.on("hello", hello);
  socket.on("draw", (pos) => {
    // for sending data to everyone except client
    // socket.broadcast.emit("draw", pos);
    // for sending data to everyone including client
    io.emit("draw", pos);
  });

  socket.on("disconnect", () => {
    msg("user disconnected");
    display("id", socket.id);
  });
});

server.listen(PORT, () =>
  console.log(`Server running at: http://localhost:${PORT}`)
);
