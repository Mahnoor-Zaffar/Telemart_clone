import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/telemart';

const specsSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  categorySlug: { type: String, required: true },
  specs: { type: Object, default: {} },
}, { timestamps: true });

const preOwnedSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true, index: true },
  grade: { type: String, enum: ['A', 'B', 'C'], required: true },
  batteryHealth: Number,
  cosmeticNotes: String,
  warrantyDays: { type: Number, default: 30 },
  inspectionPhotos: { type: [String], default: [] },
}, { timestamps: true });

export async function seedMongo(
  products: Array<{ id: string; slug: string; condition: string; preOwnedGrade?: string | null; specs: unknown; categorySlug: string }>,
) {
  await mongoose.connect(MONGODB_URI);
  const Specs = mongoose.models.ProductSpecs ?? mongoose.model('ProductSpecs', specsSchema, 'productspecs');
  const PreOwned = mongoose.models.PreOwnedReport ?? mongoose.model('PreOwnedReport', preOwnedSchema, 'preownedreports');

  for (const p of products) {
    await Specs.findOneAndUpdate(
      { productId: p.id },
      { productId: p.id, categorySlug: p.categorySlug, specs: p.specs ?? {} },
      { upsert: true },
    );

    if (p.condition === 'PRE_OWNED') {
      const grade = (p.preOwnedGrade ?? 'B') as 'A' | 'B' | 'C';
      await PreOwned.findOneAndUpdate(
        { productId: p.id },
        {
          productId: p.id,
          grade,
          batteryHealth: grade === 'A' ? 92 : grade === 'B' ? 85 : 78,
          cosmeticNotes: grade === 'A' ? 'Minimal wear, screen pristine' : grade === 'B' ? 'Light scratches on back' : 'Visible wear, fully functional',
          warrantyDays: 30,
          inspectionPhotos: [],
        },
        { upsert: true },
      );
    }
  }

  await mongoose.disconnect();
  console.log(`Seeded MongoDB specs + pre-owned reports for ${products.length} products`);
}
