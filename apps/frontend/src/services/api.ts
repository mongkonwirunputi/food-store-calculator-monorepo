import axios from 'axios';
import {
  Product,
  CalculateRequest,
  CalculateResponse,
  RedStatusResponse,
  OrderHistoryEntry,
} from '@food-store-calculator/shared';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  async calculate(request: CalculateRequest): Promise<CalculateResponse> {
    const response = await apiClient.post<CalculateResponse>('/calculate', request);
    return response.data;
  },

  async getRedStatus(): Promise<RedStatusResponse> {
    const response = await apiClient.get<RedStatusResponse>('/red-status');
    return response.data;
  },

  async getOrderHistory(limit = 20): Promise<OrderHistoryEntry[]> {
    const response = await apiClient.get<OrderHistoryEntry[]>('/orders', {
      params: { limit },
    });
    return response.data;
  },
};
