// app/models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  profileImage: string;
  phone?: string;
  address?: string;
  city?: string;
  // Danışmanlar için ek alanlar
  bio?: string;
  specialization?: string[];
  experience?: number;
  languages?: string[];
  rating?: number;
  propertySold?: number;
  website?: string;
  licenseNumber?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  notifications?: {
    newListings?: boolean;
    priceDrops?: boolean;
    messages?: boolean;
    marketing?: boolean;
  };
  securitySettings?: {
    twoFactorEnabled?: boolean;
    lastLogin?: Date;
    loginHistory?: Array<{ip: string, date: Date, device: string}>;
  };
  lastNameChange?: number;
  accountStatus?: string;
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
    profileImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    // Danışmanlar için ek alanlar
    bio: {
      type: String,
      default: "",
    },
    specialization: [{
      type: String,
    }],
    experience: {
      type: Number,
      default: 0,
    },
    languages: [{
      type: String,
    }],
    rating: {
      type: Number,
      default: 0,
    },
    propertySold: {
      type: Number,
      default: 0,
    },
    website: {
      type: String,
      default: "",
    },
    licenseNumber: {
      type: String,
      default: "",
    },
    socialMedia: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      tiktok: { type: String, default: "" },
    },
    notifications: {
      newListings: { type: Boolean, default: false },
      priceDrops: { type: Boolean, default: false },
      messages: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    securitySettings: {
      twoFactorEnabled: { type: Boolean, default: false },
      lastLogin: { type: Date },
      loginHistory: [{
        ip: String,
        date: { type: Date, default: Date.now },
        device: String
      }]
    },
    lastNameChange: {
      type: Number,
    },
    accountStatus: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "suspended"]
    }
  },
  { timestamps: true }
);

// Eğer önceden tanımlı model yoksa tanımlıyoruz, varsa onu kullanıyoruz:
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
