import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the document
export interface IPerson extends Document {
  name: string;
  phone?: string;
  street: string;
  city: string;
  friendOf: mongoose.Types.ObjectId[];
}

// Create the schema
const personSchema: Schema<IPerson> = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
  },
  phone: {
    type: String,
    minlength: 5,
  },
  street: {
    type: String,
    required: true,
    minlength: 5,
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
  },
  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Create the model
const Person: Model<IPerson> = mongoose.model<IPerson>("Person", personSchema);

export default Person;
