import { Document, model, Schema, Types } from "mongoose";

export interface User extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

const schema = new Schema<User>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = model<User>("User", schema);
