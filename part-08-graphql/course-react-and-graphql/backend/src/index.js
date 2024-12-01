const startServer = require("./server");

const connectDB = require("./config/db");
const { MONGODB_URI, JWT_SECRET, PORT } = require("./config/env");

console.log(`connecting to ${MONGODB_URI}\n`);
connectDB(MONGODB_URI);

startServer(PORT, JWT_SECRET);
