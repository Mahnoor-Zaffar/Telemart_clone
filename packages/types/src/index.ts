export type Locale = 'en' | 'ur';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

export enum PaymentMethod {
  COD = 'COD',
  CARD = 'CARD',
  JAZZCASH = 'JAZZCASH',
  EASYPAISA = 'EASYPAISA',
  BANK_TRANSFER = 'BANK_TRANSFER',
  BNPL = 'BNPL',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PtaStatus {
  APPROVED = 'APPROVED',
  NON_PTA = 'NON_PTA',
  NA = 'NA',
}

export enum ProductCondition {
  NEW = 'NEW',
  PRE_OWNED = 'PRE_OWNED',
  REFURBISHED = 'REFURBISHED',
}

export enum PreOwnedGrade {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum VendorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductCard {
  id: string;
  slug: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  brand?: string;
  ptaStatus: PtaStatus;
  condition: ProductCondition;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  isFlashDeal?: boolean;
  flashEndsAt?: string;
}

export interface CategoryTree {
  id: string;
  slug: string;
  name: string;
  nameUr?: string;
  imageUrl?: string;
  children?: CategoryTree[];
}

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  maxQuantity: number;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  area: string;
  streetAddress: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface ProductFilter {
  category?: string;
  subcategory?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  ptaStatus?: PtaStatus[];
  condition?: ProductCondition[];
  grade?: PreOwnedGrade[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  page?: number;
  limit?: number;
  q?: string;
}

export interface ProductDetail extends ProductCard {
  description: string;
  descriptionUr?: string;
  images: string[];
  stock: number;
  category: { id: string; slug: string; name: string };
  vendor?: { id: string; name: string; rating?: number };
  specs: Record<string, string | number | boolean>;
  preOwnedReport?: PreOwnedReport;
  flashSale?: { id: string; endsAt: string; discountPercent: number };
}

export interface PreOwnedReport {
  grade: PreOwnedGrade;
  batteryHealth?: number;
  cosmeticNotes?: string;
  warrantyDays: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface OrderDetail extends OrderSummary {
  items: Array<{
    productId: string;
    title: string;
    imageUrl: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shippingFee: number;
  codFee: number;
  discount: number;
}

export interface CheckoutShippingDto {
  address: Address;
  guestEmail?: string;
}

export interface CheckoutPaymentDto {
  method: PaymentMethod;
  bnplInstallments?: 4 | 6;
}

export interface FlashDeal {
  id: string;
  product: ProductCard;
  discountPercent: number;
  endsAt: string;
  stockRemaining: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleUr?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  publishedAt: string;
  author: string;
}

export interface VendorRegistrationDto {
  businessName: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  city: string;
  description?: string;
}

export interface VendorProfile {
  id: string;
  businessName: string;
  slug: string;
  status: VendorStatus;
  rating?: number;
  productCount: number;
  createdAt: string;
}

export interface PaymentIntent {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  redirectUrl?: string;
  reference?: string;
}

export interface SearchFacets {
  brands: Array<{ name: string; count: number }>;
  priceRanges: Array<{ min: number; max: number; count: number }>;
  ptaStatus: Array<{ status: PtaStatus; count: number }>;
  conditions: Array<{ condition: ProductCondition; count: number }>;
}

export interface SearchResult {
  products: ProductCard[];
  facets: SearchFacets;
  total: number;
  page: number;
  query?: string;
}

export const PAKISTAN_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Hyderabad',
  'Sialkot',
  'Gujranwala',
  'Abbottabad',
  'Sargodha',
  'Bahawalpur',
  'Sukkur',
] as const;

export type PakistanCity = (typeof PAKISTAN_CITIES)[number];

export const COD_FEE = 150;
export const FREE_SHIPPING_THRESHOLD = 5000;
