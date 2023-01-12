import { model, Schema, Document } from "mongoose";
import { User } from "../interfaces/user";
const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = model<User & Document>("nest", userSchema, "User");

export default userModel;
