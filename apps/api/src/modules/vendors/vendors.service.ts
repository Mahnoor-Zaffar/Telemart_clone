import { Injectable, ConflictException } from '@nestjs/common';
import slugify from 'slugify';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async register(data: {
    businessName: string;
    email: string;
    phone: string;
    cnic: string;
    address: string;
    city: string;
    description?: string;
    password: string;
    fullName: string;
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 12);
    const slug = slugify(data.businessName, { lower: true, strict: true });

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        role: 'VENDOR',
        vendor: {
          create: {
            businessName: data.businessName,
            slug,
            phone: data.phone,
            cnic: data.cnic,
            address: data.address,
            city: data.city,
            description: data.description,
          },
        },
      },
      include: { vendor: true },
    });

    return {
      id: user.vendor!.id,
      businessName: user.vendor!.businessName,
      slug: user.vendor!.slug,
      status: user.vendor!.status,
      productCount: 0,
      createdAt: user.vendor!.createdAt.toISOString(),
    };
  }

  async listApproved() {
    const vendors = await this.prisma.vendor.findMany({
      where: { status: 'APPROVED' },
      include: { _count: { select: { products: true } } },
    });
    return vendors.map((v) => ({
      id: v.id,
      businessName: v.businessName,
      slug: v.slug,
      status: v.status,
      rating: v.rating ?? undefined,
      productCount: v._count.products,
      createdAt: v.createdAt.toISOString(),
    }));
  }

  async approve(vendorId: string) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { status: 'APPROVED' },
    });
  }

  async getPending() {
    return this.prisma.vendor.findMany({ where: { status: 'PENDING' } });
  }
}
