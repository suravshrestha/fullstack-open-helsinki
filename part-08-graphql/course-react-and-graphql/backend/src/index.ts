import startServer from "./server";
import connectDB from "./config/db";
import { MONGODB_URI, JWT_SECRET, PORT } from "./config/env";

console.log(`Connecting to ${MONGODB_URI}\n`);
connectDB(MONGODB_URI);

startServer(PORT, JWT_SECRET);
