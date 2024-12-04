import mongoose from "mongoose";

const connectDB = async (uri: string): Promise<void> => {
  try {
    await mongoose.connect(uri);

    console.log("Connected to MongoDB");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("Unknown error connecting to MongoDB");
    }
    process.exit(1);
  }
};

export default connectDB;
