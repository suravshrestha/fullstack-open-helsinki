import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the document
export interface IUser extends Document {
  username: string;
  friends: mongoose.Types.ObjectId[];
}

// Create the schema
const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
    },
  ],
});

// Create the model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
