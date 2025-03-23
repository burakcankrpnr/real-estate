import mongoose from 'mongoose';

// Eğer mongoose modeli zaten tanımlanmışsa, tekrar tanımlamamak için kontrol
const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Aynı user-property ikilisinin tekrarını önlemek için unique index
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Modeli varsa kullan, yoksa oluştur
const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

export default Favorite; 