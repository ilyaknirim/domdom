import axios, { AxiosInstance } from 'axios';
import { getInitData } from '../utils/telegram';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Добавляем Telegram init data в каждый запрос
    this.client.interceptors.request.use((config) => {
      const initData = getInitData();
      if (initData) {
        config.headers['x-telegram-init-data'] = initData;
      }
      return config;
    });

    // Обработка ошибок
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const data = error.response?.data || {};
        const code = data.code || error.code || 'API_ERROR';
        const rawErr = (data && (data.error ?? data.message)) ?? error.message ?? 'Unknown error';
        const message = typeof rawErr === 'string' ? rawErr : JSON.stringify(rawErr);
        console.error('API Error:', { status, code, message, data });
        const enriched = new Error(message);
        (enriched as any).name = code;
        (enriched as any).status = status;
        (enriched as any).raw = data;
        return Promise.reject(enriched);
      }
    );
  }

  // Properties
  async getProperties(params?: Record<string, any>) {
    const { data } = await this.client.get('/properties', { params });
    return data;
  }

  async getPropertyById(id: string) {
    const { data } = await this.client.get(`/properties/${id}`);
    return data;
  }

  async createProperty(propertyData: any) {
    const { data } = await this.client.post('/properties', propertyData);
    return data;
  }

  async updateProperty(id: string, propertyData: any) {
    const { data } = await this.client.put(`/properties/${id}`, propertyData);
    return data;
  }

  async deleteProperty(id: string) {
    const { data } = await this.client.delete(`/properties/${id}`);
    return data;
  }

  async getMyProperties() {
    const { data } = await this.client.get('/properties/my/list');
    return data;
  }

  async checkAvailability(propertyId: string, checkIn: string, checkOut: string) {
    const { data } = await this.client.post(`/properties/${propertyId}/check-availability`, {
      checkIn,
      checkOut,
    });
    return data;
  }

  // Bookings
  async getBookings() {
    const { data } = await this.client.get('/bookings');
    return data;
  }

  async createBooking(bookingData: any) {
    const { data } = await this.client.post('/bookings', bookingData);
    return data;
  }

  async confirmBooking(id: string) {
    const { data } = await this.client.put(`/bookings/${id}/confirm`);
    return data;
  }

  async cancelBooking(id: string, reason?: string) {
    const { data } = await this.client.put(`/bookings/${id}/cancel`, { reason });
    return data;
  }

  // Favorites
  async getFavorites() {
    const { data } = await this.client.get('/favorites');
    return data;
  }

  async addToFavorites(propertyId: string) {
    const { data } = await this.client.post('/favorites', { propertyId });
    return data;
  }

  async removeFromFavorites(propertyId: string) {
    const { data } = await this.client.delete(`/favorites/${propertyId}`);
    return data;
  }

  // User
  async getCurrentUser() {
    const { data } = await this.client.get('/users/me');
    return data;
  }

  async updateProfile(userData: any) {
    const { data } = await this.client.put('/users/me', userData);
    return data;
  }

  // Reviews
  async getReviews(targetId: string) {
    const { data } = await this.client.get(`/reviews?targetId=${targetId}`);
    return data;
  }

  async createReview(reviewData: any) {
    const { data } = await this.client.post('/reviews', reviewData);
    return data;
  }

  // Notifications
  async getNotifications() {
    const { data } = await this.client.get('/notifications');
    return data;
  }

  async markNotificationAsRead(id: string) {
    const { data } = await this.client.put(`/notifications/${id}/read`);
    return data;
  }

  // Chat
  async getChatMessages(chatRoomId: string) {
    const { data } = await this.client.get(`/chat/${chatRoomId}/messages`);
    return data;
  }

  async sendMessage(chatRoomId: string, content: string) {
    const { data } = await this.client.post(`/chat/${chatRoomId}/messages`, { content });
    return data;
  }

  // Payments
  async createPayment(bookingId: string, amount: number) {
    const { data } = await this.client.post('/payments/create', {
      bookingId,
      amount,
    });
    return data;
  }

  // Upload images
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await this.client.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  }
}

export const api = new ApiService();
