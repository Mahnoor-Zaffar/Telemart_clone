import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ProductSpecs extends Document {
  @Prop({ required: true, index: true })
  productId!: string;

  @Prop({ required: true })
  categorySlug!: string;

  @Prop({ type: Object, default: {} })
  specs!: Record<string, string | number | boolean | string[]>;
}

export const ProductSpecsSchema = SchemaFactory.createForClass(ProductSpecs);

@Schema({ timestamps: true })
export class PreOwnedReport extends Document {
  @Prop({ required: true, unique: true, index: true })
  productId!: string;

  @Prop({ required: true, enum: ['A', 'B', 'C'] })
  grade!: string;

  @Prop()
  batteryHealth?: number;

  @Prop()
  cosmeticNotes?: string;

  @Prop({ default: 30 })
  warrantyDays!: number;

  @Prop({ type: [String], default: [] })
  inspectionPhotos!: string[];
}

export const PreOwnedReportSchema = SchemaFactory.createForClass(PreOwnedReport);
