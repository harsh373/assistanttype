import mongoose, { Document, Schema } from "mongoose";

// Define an interface representing a User document in MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  assistantName?: string;
  assistantImage?: string;
  history: string[];
  createdAt: Date;
}

// Create the user schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  assistantName: {
    type: String
  },
  assistantImage: {
    type: String
  },
  history: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });



// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
