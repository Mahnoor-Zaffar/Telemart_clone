import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { PreOwnedReport, PreOwnedReportSchema, ProductSpecs, ProductSpecsSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/telemart',
      }),
    }),
    MongooseModule.forFeature([
      { name: ProductSpecs.name, schema: ProductSpecsSchema },
      { name: PreOwnedReport.name, schema: PreOwnedReportSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
