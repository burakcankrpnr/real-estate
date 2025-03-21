// app/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "İsim alanı zorunludur"],
    },
    email: {
      type: String,
      required: [true, "Email alanı zorunludur"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Şifre alanı zorunludur"],
    },
    role: { 
      type: String, 
      default: "user", 
      enum: ["user", "admin", "moderator"] 
    },
  },
  { timestamps: true }
);

// Eğer önceden tanımlı model yoksa tanımlıyoruz, varsa onu kullanıyoruz:
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
