import mongoose, { Document, Schema } from "mongoose";


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  assistantName?: string;
  assistantImage?: string;
  history: string[];
  createdAt: Date;
}


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




const User = mongoose.model<IUser>("User", userSchema);
export default User;
