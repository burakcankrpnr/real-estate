import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    district: string;
    address: string;
  };
  features: {
    rooms: number;
    bathrooms: number;
    area: number;
    hasGarage: boolean;
    hasGarden: boolean;
    hasPool: boolean;
    isFurnished: boolean;
  };
  type: string; // apartment, villa, land, commercial, etc.
  status: string; // for sale, for rent
  images: string[];
  createdBy: mongoose.Schema.Types.ObjectId;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Başlık alanı zorunludur"],
    },
    description: {
      type: String,
      required: [true, "Açıklama alanı zorunludur"],
    },
    price: {
      type: Number,
      required: [true, "Fiyat alanı zorunludur"],
    },
    location: {
      city: {
        type: String,
        required: [true, "Şehir alanı zorunludur"],
      },
      district: {
        type: String,
        required: [true, "İlçe alanı zorunludur"],
      },
      address: {
        type: String,
        required: [true, "Adres alanı zorunludur"],
      },
    },
    features: {
      rooms: {
        type: Number,
        default: 0,
      },
      bathrooms: {
        type: Number,
        default: 0,
      },
      area: {
        type: Number,
        required: [true, "Alan bilgisi zorunludur"],
      },
      hasGarage: {
        type: Boolean,
        default: false,
      },
      hasGarden: {
        type: Boolean,
        default: false,
      },
      hasPool: {
        type: Boolean,
        default: false,
      },
      isFurnished: {
        type: Boolean,
        default: false,
      },
    },
    type: {
      type: String,
      required: [true, "Emlak türü zorunludur"],
      enum: ["apartment", "villa", "land", "commercial", "house"],
    },
    status: {
      type: String,
      required: [true, "İlan durumu zorunludur"],
      enum: ["for-sale", "for-rent"],
    },
    images: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Oluşturan kullanıcı bilgisi zorunludur"],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Eğer önceden tanımlı model yoksa tanımlıyoruz, varsa onu kullanıyoruz:
export const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema); 