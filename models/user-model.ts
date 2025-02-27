import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true }
);

const UserModel = models?.User || model("User", UserSchema);

export default UserModel;
