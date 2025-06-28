const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const Metric = require("./models/Metric");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/metrics", require("./routes/metrics"));
app.use(express.static("public"));

// Real-time updates
io.on("connection", (socket) => {
  console.log("New client connected");

  const sendMetrics = async () => {
    const metrics = await Metric.find({});
    socket.emit("updateMetrics", metrics);
  };

  sendMetrics();
  const interval = setInterval(sendMetrics, 5000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
