import axios from 'axios';
import { Client, Subscription } from '../types/types';

// Базовый URL для аутентификации
const AUTH_BASE_URL = 'http://localhost:5000';

// Базовый URL для клиентов и подписок
const API_BASE_URL = 'http://localhost:5001';

// Экземпляр axios для аутентификации
const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Экземпляр axios для клиентов и подписок
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Функция для обновления токена в localStorage
export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('token', token);

  } else {
    localStorage.removeItem('token');
  }
};

// Методы для работы с клиентами и подписками
export const fetchClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};

export const fetchSubscriptions = async (): Promise<Subscription[]> => {
  const response = await api.get('/subscriptions');
  return response.data;
};

export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const response = await api.post('/clients', client);
  return response.data;
};

export const addSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const response = await api.post('/subscriptions', subscription);
  return response.data;
};

export const deleteClient = async (clientId: number) => {
  await api.delete(`/clients/${clientId}`);
};

export const deleteSubscription = async (subscriptionId: number) => {
  await api.delete(`/subscriptions/${subscriptionId}`);
};

// Методы для аутентификации
export const register = async (userData: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await authApi.post('/login', credentials);
  return response.data;
};

export default api;