// Типы для TypeScript

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
  status: PropertyStatus;
  address: string;
  city: string;
  district?: string;
  latitude: number;
  longitude: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  totalFloors?: number;
  price: number;
  currency: string;
  pricePerMonth?: number;
  deposit?: number;
  amenities: string[];
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  availableFrom?: string;
  availableTo?: string;
  minRentDays?: number;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  owner?: User;
  isFavorite?: boolean;
  reviews?: Review[];
  blockedDates?: BlockedDate[];
  _count?: {
    reviews: number;
    favorites: number;
    bookings: number;
  };
}

export type PropertyType =
  | 'APARTMENT'
  | 'ROOM'
  | 'HOUSE'
  | 'STUDIO'
  | 'PENTHOUSE'
  | 'VILLA';

export type DealType = 'SALE' | 'RENT' | 'BOTH';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'ACTIVE'
  | 'BOOKED'
  | 'RENTED'
  | 'SOLD'
  | 'ARCHIVED'
  | 'BLOCKED';

export interface User {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  languageCode: string;
  isVerified: boolean;
  role: UserRole;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'USER' | 'AGENT' | 'ADMIN';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  depositAmount: number;
  currency: string;
  status: BookingStatus;
  guestCount: number;
  notes?: string;
  cancelReason?: string;
  cancelledBy?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  property?: Property;
  user?: User;
  payments?: Payment[];
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export interface Payment {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  currency: string;
  telegramPaymentId?: string;
  providerPaymentId?: string;
  status: PaymentStatus;
  paymentMethod?: string;
  description?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED';

export interface Review {
  id: string;
  authorId: string;
  targetId: string;
  propertyId?: string;
  rating: number;
  comment: string;
  cleanRating?: number;
  locationRating?: number;
  communicationRating?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  author?: User;
  target?: User;
  property?: Property;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  bookingId?: string;
  isRead: boolean;
  isSent: boolean;
  data?: any;
  createdAt: string;
  readAt?: string;
}

export type NotificationType =
  | 'NEW_BOOKING'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'REVIEW_RECEIVED'
  | 'MESSAGE_RECEIVED'
  | 'PROPERTY_APPROVED'
  | 'PROPERTY_REJECTED'
  | 'REMINDER_CHECKIN'
  | 'REMINDER_CHECKOUT'
  | 'NEW_PROPERTY'
  | 'PRICE_DROP';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  chatRoomId: string;
  content: string;
  attachments: string[];
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  sender?: User;
}

export interface BlockedDate {
  id: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property?: Property;
}

// New types for address selection
export interface AddressData {
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  type: PropertyType;
  dealType: DealType;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  images: string[];
}
