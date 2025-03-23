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
    floors?: number;
    floor?: number;
    bedrooms?: number;
    buildingAge?: number;
    heating?: string;
    hasGarage: boolean;
    hasGarden: boolean;
    hasPool: boolean;
    isFurnished: boolean;
    hasAirConditioning?: boolean;
    hasBalcony?: boolean;
    hasElevator?: boolean;
    hasSecurity?: boolean;
    hasInternet?: boolean;
    hasSatelliteTV?: boolean;
    hasFittedKitchen?: boolean;
    hasParentalBathroom?: boolean;
  };
  extraFeatures?: string[];
  type: string; // apartman-dairesi, villa, arsa, dukkan-magaza, etc.
  status: string; // satilik, kiralik
  category: string; // konut, is-yeri, arsa, turizm
  subcategory?: string;
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
      floors: {
        type: Number,
      },
      floor: {
        type: Number,
      },
      bedrooms: {
        type: Number,
      },
      buildingAge: {
        type: Number,
      },
      heating: {
        type: String,
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
      hasAirConditioning: {
        type: Boolean,
        default: false,
      },
      hasBalcony: {
        type: Boolean,
        default: false,
      },
      hasElevator: {
        type: Boolean,
        default: false,
      },
      hasSecurity: {
        type: Boolean,
        default: false,
      },
      hasInternet: {
        type: Boolean,
        default: false,
      },
      hasSatelliteTV: {
        type: Boolean,
        default: false,
      },
      hasFittedKitchen: {
        type: Boolean,
        default: false,
      },
      hasParentalBathroom: {
        type: Boolean,
        default: false,
      },
    },
    extraFeatures: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      required: [true, "Emlak türü zorunludur"],
    },
    status: {
      type: String,
      required: [true, "İlan durumu zorunludur"],
    },
    category: {
      type: String,
      required: [true, "Kategori alanı zorunludur"],
      enum: ["konut", "is-yeri", "arsa", "turizm"],
    },
    subcategory: {
      type: String,
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
delete mongoose.models.Property;
export const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema); 