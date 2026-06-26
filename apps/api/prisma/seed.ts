import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

const PLACEHOLDER = 'https://placehold.co/400x400/1e293b/94a3b8?text=';

const categories = [
  { slug: 'mobiles', name: 'Mobiles & Tablets', nameUr: 'موبائل اور ٹیبلٹ', sortOrder: 1, children: [
    { slug: 'smartphones', name: 'Smartphones', nameUr: 'اسمارٹ فون' },
    { slug: 'tablets', name: 'Tablets', nameUr: 'ٹیبلٹ' },
    { slug: 'mobile-accessories', name: 'Accessories', nameUr: 'لوازمات' },
  ]},
  { slug: 'laptops', name: 'Laptops & Computers', nameUr: 'لیپ ٹاپ', sortOrder: 2, children: [
    { slug: 'gaming-laptops', name: 'Gaming Laptops', nameUr: 'گیمنگ لیپ ٹاپ' },
    { slug: 'business-laptops', name: 'Business Laptops', nameUr: 'بزنس لیپ ٹاپ' },
  ]},
  { slug: 'electronics', name: 'Electronics', nameUr: 'الیکٹرانکس', sortOrder: 3, children: [
    { slug: 'smartwatches', name: 'Smartwatches', nameUr: 'اسمارٹ واچ' },
    { slug: 'headphones', name: 'Headphones', nameUr: 'ہیڈفون' },
  ]},
  { slug: 'fashion', name: 'Fashion', nameUr: 'فیشن', sortOrder: 4, children: [
    { slug: 'mens-wear', name: "Men's Wear", nameUr: 'مردانہ لباس' },
    { slug: 'womens-wear', name: "Women's Wear", nameUr: 'زنانہ لباس' },
  ]},
  { slug: 'pre-owned', name: 'Pre-Owned', nameUr: 'استعمال شدہ', sortOrder: 5, children: [
    { slug: 'used-phones', name: 'Used Phones', nameUr: 'استعمال شدہ فون' },
    { slug: 'used-laptops', name: 'Used Laptops', nameUr: 'استعمال شدہ لیپ ٹاپ' },
  ]},
];

const products = [
  { title: 'Apple iPhone 15 Pro Max 256GB PTA Approved', brand: 'Apple', price: 529999, compareAt: 549999, cat: 'smartphones', pta: 'APPROVED', featured: true, specs: { ram: '8GB', storage: '256GB', display: '6.7" Super Retina XDR' } },
  { title: 'Samsung Galaxy S24 Ultra 512GB PTA Approved', brand: 'Samsung', price: 449999, compareAt: 469999, cat: 'smartphones', pta: 'APPROVED', featured: true, specs: { ram: '12GB', storage: '512GB', display: '6.8" Dynamic AMOLED' } },
  { title: 'Xiaomi Redmi Note 13 Pro PTA Approved', brand: 'Xiaomi', price: 64999, cat: 'smartphones', pta: 'APPROVED', weekly: true, specs: { ram: '8GB', storage: '256GB' } },
  { title: 'Vivo V30 5G PTA Approved', brand: 'Vivo', price: 89999, cat: 'smartphones', pta: 'APPROVED', specs: { ram: '12GB', storage: '256GB' } },
  { title: 'Oppo Reno 12 Pro PTA Approved', brand: 'Oppo', price: 119999, cat: 'smartphones', pta: 'APPROVED', specs: { ram: '12GB', storage: '256GB' } },
  { title: 'Tecno Camon 30 Premier', brand: 'Tecno', price: 74999, cat: 'smartphones', pta: 'APPROVED', under999: false, specs: { ram: '12GB', storage: '512GB' } },
  { title: 'Infinix Zero 40 5G', brand: 'Infinix', price: 54999, cat: 'smartphones', pta: 'APPROVED', under999: false, specs: { ram: '8GB', storage: '256GB' } },
  { title: 'Realme 13 Pro+ 5G', brand: 'Realme', price: 94999, cat: 'smartphones', pta: 'APPROVED', specs: { ram: '12GB', storage: '256GB' } },
  { title: 'Nothing Phone 2a 5G', brand: 'Nothing', price: 79999, cat: 'smartphones', pta: 'APPROVED', weekly: true, specs: { ram: '8GB', storage: '128GB' } },
  { title: 'Google Pixel 8 Pro Non-PTA', brand: 'Google', price: 189999, cat: 'smartphones', pta: 'NON_PTA', specs: { ram: '12GB', storage: '128GB' } },
  { title: 'MacBook Pro 14 M3 Pro 512GB', brand: 'Apple', price: 549999, cat: 'business-laptops', pta: 'NA', featured: true, specs: { ram: '18GB', storage: '512GB SSD', chip: 'M3 Pro' } },
  { title: 'ASUS ROG Strix G16 Gaming Laptop', brand: 'ASUS', price: 389999, cat: 'gaming-laptops', pta: 'NA', featured: true, specs: { ram: '16GB', storage: '1TB SSD', gpu: 'RTX 4060' } },
  { title: 'Lenovo IdeaPad Slim 5', brand: 'Lenovo', price: 149999, cat: 'business-laptops', pta: 'NA', weekly: true, specs: { ram: '16GB', storage: '512GB SSD' } },
  { title: 'HP Pavilion 15 Gaming', brand: 'HP', price: 219999, cat: 'gaming-laptops', pta: 'NA', specs: { ram: '16GB', storage: '512GB SSD', gpu: 'RTX 3050' } },
  { title: 'Dell XPS 15 9530', brand: 'Dell', price: 429999, cat: 'business-laptops', pta: 'NA', specs: { ram: '32GB', storage: '1TB SSD' } },
  { title: 'MSI Katana 15 Gaming', brand: 'MSI', price: 279999, cat: 'gaming-laptops', pta: 'NA', specs: { ram: '16GB', storage: '512GB SSD', gpu: 'RTX 4050' } },
  { title: 'Apple Watch Series 9 GPS 45mm', brand: 'Apple', price: 89999, cat: 'smartwatches', pta: 'NA', specs: { size: '45mm', connectivity: 'GPS' } },
  { title: 'Samsung Galaxy Watch 6 Classic', brand: 'Samsung', price: 74999, cat: 'smartwatches', pta: 'NA', weekly: true, specs: { size: '47mm' } },
  { title: 'Sony WH-1000XM5 Headphones', brand: 'Sony', price: 89999, cat: 'headphones', pta: 'NA', featured: true, specs: { type: 'Over-ear', anc: true } },
  { title: 'AirPods Pro 2nd Gen USB-C', brand: 'Apple', price: 79999, cat: 'headphones', pta: 'NA', specs: { type: 'In-ear', anc: true } },
  { title: 'Men Cotton Kurta Shalwar', brand: 'Junaid Jamshed', price: 4999, cat: 'mens-wear', pta: 'NA', under999: false, specs: { material: 'Cotton', size: 'M-XXL' } },
  { title: 'Women Embroidered Lawn Suit', brand: 'Sapphire', price: 8990, cat: 'womens-wear', pta: 'NA', under999: false, specs: { pieces: '3-piece' } },
  { title: 'USB-C Fast Charging Cable 2m', brand: 'Anker', price: 2499, cat: 'mobile-accessories', pta: 'NA', under999: false, specs: { length: '2m', power: '100W' } },
  { title: 'Phone Case iPhone 15 Pro Max', brand: 'Spigen', price: 3499, cat: 'mobile-accessories', pta: 'NA', under999: false, specs: { material: 'TPU' } },
  { title: 'iPhone 13 Pro 128GB Pre-Owned Grade A', brand: 'Apple', price: 149999, cat: 'used-phones', pta: 'APPROVED', condition: 'PRE_OWNED', grade: 'A', specs: { ram: '6GB', storage: '128GB', battery: '92%' } },
  { title: 'Samsung S22 Ultra Pre-Owned Grade B', brand: 'Samsung', price: 119999, cat: 'used-phones', pta: 'APPROVED', condition: 'PRE_OWNED', grade: 'B', specs: { ram: '12GB', storage: '256GB', battery: '85%' } },
  { title: 'MacBook Air M1 Pre-Owned Grade A', brand: 'Apple', price: 189999, cat: 'used-laptops', pta: 'NA', condition: 'PRE_OWNED', grade: 'A', specs: { ram: '8GB', storage: '256GB SSD' } },
  { title: 'Wireless Earbuds Basic', brand: 'Baseus', price: 2999, cat: 'headphones', pta: 'NA', under999: false, specs: { type: 'In-ear' } },
  { title: 'Screen Protector Tempered Glass', brand: 'Nillkin', price: 899, cat: 'mobile-accessories', pta: 'NA', under999: true, specs: { type: '9H Glass' } },
  { title: 'Power Bank 20000mAh', brand: 'Baseus', price: 4999, cat: 'mobile-accessories', pta: 'NA', under999: false, specs: { capacity: '20000mAh', fastCharge: true } },
  { title: 'iPad Air M2 128GB WiFi', brand: 'Apple', price: 189999, cat: 'tablets', pta: 'NA', featured: true, specs: { storage: '128GB', chip: 'M2' } },
  { title: 'Samsung Galaxy Tab S9', brand: 'Samsung', price: 169999, cat: 'tablets', pta: 'NA', specs: { ram: '8GB', storage: '128GB' } },
  { title: 'Men Formal Dress Shirt', brand: 'Outfitters', price: 3990, cat: 'mens-wear', pta: 'NA', under999: false, specs: { fit: 'Slim' } },
  { title: 'Women Handbag Leather', brand: 'Stylo', price: 5990, cat: 'womens-wear', pta: 'NA', under999: false, specs: { material: 'PU Leather' } },
  { title: 'Gaming Mouse RGB', brand: 'Logitech', price: 8999, cat: 'mobile-accessories', pta: 'NA', under999: false, specs: { dpi: '25600' } },
  { title: 'Mechanical Keyboard TKL', brand: 'Redragon', price: 12999, cat: 'mobile-accessories', pta: 'NA', specs: { switches: 'Red' } },
  { title: 'OnePlus 12 256GB PTA Approved', brand: 'OnePlus', price: 179999, cat: 'smartphones', pta: 'APPROVED', specs: { ram: '12GB', storage: '256GB' } },
  { title: 'Huawei MatePad 11', brand: 'Huawei', price: 69999, cat: 'tablets', pta: 'NA', specs: { ram: '6GB', storage: '128GB' } },
  { title: 'JBL Flip 6 Speaker', brand: 'JBL', price: 34999, cat: 'headphones', pta: 'NA', weekly: true, specs: { waterproof: 'IP67' } },
  { title: 'Men Sports Sneakers', brand: 'Adidas', price: 12999, cat: 'mens-wear', pta: 'NA', specs: { size: '7-12' } },
  { title: 'Women Running Shoes', brand: 'Nike', price: 14999, cat: 'womens-wear', pta: 'NA', specs: { size: '5-10' } },
  { title: 'Car Phone Mount Magnetic', brand: 'Baseus', price: 1999, cat: 'mobile-accessories', pta: 'NA', under999: false, specs: { type: 'Magnetic' } },
  { title: 'Laptop Stand Aluminum', brand: 'Ugreen', price: 4499, cat: 'mobile-accessories', pta: 'NA', under999: false, specs: { material: 'Aluminum' } },
  { title: 'iPhone 14 128GB PTA Approved', brand: 'Apple', price: 219999, cat: 'smartphones', pta: 'APPROVED', weekly: true, specs: { ram: '6GB', storage: '128GB' } },
  { title: 'Samsung A55 5G PTA Approved', brand: 'Samsung', price: 89999, cat: 'smartphones', pta: 'APPROVED', specs: { ram: '8GB', storage: '128GB' } },
  { title: 'Acer Nitro 5 Gaming Laptop', brand: 'Acer', price: 249999, cat: 'gaming-laptops', pta: 'NA', specs: { ram: '16GB', gpu: 'RTX 3050' } },
  { title: 'Huawei FreeBuds Pro 3', brand: 'Huawei', price: 44999, cat: 'headphones', pta: 'NA', specs: { anc: true } },
  { title: 'Smart Ring Health Tracker', brand: 'Ultrahuman', price: 59999, cat: 'smartwatches', pta: 'NA', specs: { sizes: '6-13' } },
  { title: 'Mini Bluetooth Speaker', brand: 'Anker', price: 7999, cat: 'headphones', pta: 'NA', under999: false, specs: { battery: '12h' } },
  { title: 'Phone Gimbal Stabilizer', brand: 'DJI', price: 34999, cat: 'mobile-accessories', pta: 'NA', specs: { axis: '3-axis' } },
  { title: 'Used iPhone 12 64GB Grade C', brand: 'Apple', price: 89999, cat: 'used-phones', pta: 'APPROVED', condition: 'PRE_OWNED', grade: 'C', specs: { storage: '64GB', battery: '78%' } },
];

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@telemart.local' },
    update: {},
    create: {
      email: 'admin@telemart.local',
      passwordHash,
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  });

  const customerHash = await bcrypt.hash('customer123', 12);
  await prisma.user.upsert({
    where: { email: 'customer@telemart.local' },
    update: {},
    create: {
      email: 'customer@telemart.local',
      passwordHash: customerHash,
      fullName: 'Test Customer',
      phone: '03001234567',
      role: 'CUSTOMER',
    },
  });

  const catMap: Record<string, string> = {};

  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        name: cat.name,
        nameUr: cat.nameUr,
        sortOrder: cat.sortOrder,
        imageUrl: `${PLACEHOLDER}${encodeURIComponent(cat.name)}`,
      },
    });
    catMap[cat.slug] = parent.id;

    for (const child of cat.children) {
      const sub = await prisma.category.upsert({
        where: { slug: child.slug },
        update: {},
        create: {
          slug: child.slug,
          name: child.name,
          nameUr: child.nameUr,
          parentId: parent.id,
        },
      });
      catMap[child.slug] = sub.id;
    }
  }

  const createdProducts = [];
  for (const p of products) {
    const slug = slugify(p.title, { lower: true, strict: true });
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: p.title,
        description: `${p.title} - Available at Telemart Clone with fast delivery across Pakistan. Genuine product with warranty support.`,
        price: p.price,
        compareAtPrice: p.compareAt ?? undefined,
        stock: Math.floor(Math.random() * 50) + 5,
        imageUrl: `${PLACEHOLDER}${encodeURIComponent(p.brand)}`,
        images: [`${PLACEHOLDER}${encodeURIComponent(p.brand)}`],
        brand: p.brand,
        categoryId: catMap[p.cat],
        ptaStatus: p.pta as 'APPROVED' | 'NON_PTA' | 'NA',
        condition: (p.condition as 'NEW' | 'PRE_OWNED') ?? 'NEW',
        preOwnedGrade: p.grade as 'A' | 'B' | 'C' | undefined,
        specs: p.specs,
        isFeatured: p.featured ?? false,
        isWeeklyDeal: p.weekly ?? false,
        isUnder999: p.under999 ?? false,
        rating: 3.5 + Math.random() * 1.5,
        reviewCount: Math.floor(Math.random() * 200),
        searchVector: `${p.title} ${p.brand} ${JSON.stringify(p.specs)}`.toLowerCase(),
      },
    });
    createdProducts.push(product);
  }

  // Flash deals on first 4 products
  for (let i = 0; i < 4; i++) {
    await prisma.flashSale.create({
      data: {
        productId: createdProducts[i].id,
        discountPercent: 10 + i * 5,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        maxStock: 20,
        soldCount: Math.floor(Math.random() * 5),
      },
    });
  }

  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'best-phones-2026-pakistan',
        title: 'Best Smartphones in Pakistan 2026',
        titleUr: 'پاکستان میں بہترین اسمارٹ فون 2026',
        excerpt: 'Our top picks for PTA approved smartphones this year.',
        content: '## Top Picks\n\n1. iPhone 15 Pro Max\n2. Samsung S24 Ultra\n3. Xiaomi Redmi Note 13 Pro\n\nAll available with COD and fast delivery.',
        published: true,
        publishedAt: new Date(),
      },
      {
        slug: 'pta-approved-guide',
        title: 'PTA Approved vs Non-PTA: Complete Guide',
        titleUr: 'PTA منظور شدہ گائیڈ',
        excerpt: 'Everything you need to know about PTA status in Pakistan.',
        content: '## What is PTA?\n\nPTA approval ensures your device works on all Pakistani networks without issues.',
        published: true,
        publishedAt: new Date(),
      },
      {
        slug: 'flash-sale-tips',
        title: 'How to Win Flash Sales',
        titleUr: 'فلیش سیل میں کامیابی',
        excerpt: 'Tips to grab the best deals during flash sales.',
        content: '## Tips\n\n- Add items to cart early\n- Complete checkout quickly\n- Enable notifications',
        published: true,
        publishedAt: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded admin: ${admin.email} / admin123`);
  console.log(`Seeded ${createdProducts.length} products`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
